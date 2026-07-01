import { NextResponse } from "next/server";
import Category from "../../../model/categoriesModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";

export async function POST(req, res) {


  try {
    const formData = await req.formData();
    await connectToDB();

    // Update category
    const updatedCategory = await Category.updateOne(
        { _id: formData.get("id") }, // Filter to find the category by ID
        {
          categoryName: formData.get("categoryName"),
          description: formData.get("description"),
          image: formData.get("image"),
        }
      );

          // Check if the category was updated
    if (updatedCategory.nModified === 0) {
        return NextResponse.json(
          { status: 404, message: "Category not found or no changes made" },
          { status: 404 }
        );
      }

      
    return NextResponse.json(
      { status: 201, message: "Category update successfully" },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
