import { compare } from "bcryptjs";
import { generateToken } from "../../../../utils/jwt";
import User from "../../../model/userModel";
import { connectToDB } from "../../../../utils/database";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const formData = await req.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return NextResponse.json(
      { status: 400, message: "All fields are required" },
      { status: 400 }
    );
  }
  await connectToDB();
  const userData = await User.findOne({ email: email });
  if (!userData) {
    return NextResponse.json(
      { status: 401, message: "Invalid Credentials" },
      { status: 401 }
    );
  }

  try {
    // Compare the password
    const isValid = await compare(password, userData.password);
    if (isValid) {
      
        const user = { id: userData._id, email, role: userData.role };
    
        // Generate JWT
        const token = await generateToken(user);
        return NextResponse.json(
          {
            status: 200,
            message: "Login Successfully!",
            userid: userData._id,
            token,
            role: userData.role
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            status: 401,
            message: "Invaild Credentials",
            userid: userData._id,
            token,
            role: userData.role
          },
          { status: 401 }
        );
      }
  } catch (error) {
   
    return NextResponse.json(
      { status: 401, message: "Invaild Credentials" },
      { status: 401 }
    );
  }


}
