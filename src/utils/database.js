import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../app/model/userModel';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@elimuu.com';
    const adminPassword = '123456';
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      // Create admin user
      const adminUser = new User({
        name: 'ELIMUU Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        status: 'active',
        authType: 'manual'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully:', adminEmail);
    } else {
      console.log('ℹ️ Admin user already exists:', adminEmail);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

export const connectToDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const configuredUri = process.env.MONGODB_URI;
    
    // Check if a real MongoDB URI is configured (not placeholder)
    const hasRealUri = configuredUri && 
      !configuredUri.includes('cluster0.xxxxx') && 
      !configuredUri.includes('<username>') &&
      !configuredUri.includes('127.0.0.1');

    if (hasRealUri) {
      // Use the configured MongoDB URI
      console.log('🔗 Connecting to configured MongoDB...');
      const opts = {
        dbName: process.env.MONGODB_DB_NAME || 'elimuu_db',
        bufferCommands: false,
      };
      cached.promise = mongoose.connect(configuredUri, opts);
    } else {
      // Use in-memory MongoDB (no installation required!)
      console.log('🧠 No external MongoDB found. Starting in-memory MongoDB...');
      console.log('⏳ This may take a moment for first-time download (~100MB)...');
      
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'elimuu_db',
        },
      });
      const memUri = mongod.getUri();
      console.log('✅ In-memory MongoDB started at:', memUri);
      
      const opts = {
        dbName: 'elimuu_db',
        bufferCommands: false,
      };
      cached.promise = mongoose.connect(memUri, opts);
    }

    // After connection, create admin user
    cached.promise = cached.promise
      .then(async (mongooseInstance) => {
        await createAdminUser();
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
