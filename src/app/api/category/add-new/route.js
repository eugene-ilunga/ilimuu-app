import { NextResponse } from "next/server";
import Category from "../../../model/categoriesModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";

export async function POST(req, res) {


  try {
    const formData = await req.formData();
    await connectToDB();

    // Check if category already exists
    const existingCategory = await Category.findOne({
      categoryName: formData.get("categoryName"),
    });
    if (existingCategory) {
      return NextResponse.json(
        { status: 409, message: "Category already exists" },
        { status: 409 }
      );
    }
    // Get the subCategory field as an array
    const subCategory = formData.getAll("subCategory");
    // Create new category
    await Category.create({
      categoryName: formData.get("categoryName"),
      description: formData.get("description"),
      image: formData.get("image"),
      subCategory: subCategory,

    });

    return NextResponse.json(
      { status: 201, message: "Category created successfully" },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
