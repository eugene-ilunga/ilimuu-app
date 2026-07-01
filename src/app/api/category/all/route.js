import { NextResponse } from "next/server";
import Category from "../../../model/categoriesModel";
import { connectToDB } from "../../../../utils/database";

export async function GET(req) {
  try {
  
    await connectToDB();

    const total = await Category.countDocuments();
    const categories = await Category.find({})


    return NextResponse.json({
      status: 200,
      message: "Toutes les catégories",
      data: categories,
      total, // Return the total count of items
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
