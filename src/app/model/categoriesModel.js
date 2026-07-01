import { Schema, model, models } from "mongoose";

const categoriesSchema = new Schema({
  categoryName: {
    type: String,
    required: [true, "Category name is required"],
    unique: [true, "Category name already exists"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  subCategory: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
 
},{timestamps: true, versionKey:false});

const Category = models.Category || model("Catégorie", categoriesSchema);

export default Category;
