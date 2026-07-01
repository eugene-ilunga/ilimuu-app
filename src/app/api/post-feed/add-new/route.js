import { NextResponse } from "next/server";
import Post from "../../../model/postModel";
import { connectToDB } from "../../../../utils/database";
import { ObjectId } from "mongodb";
import User from "@/app/model/userModel";
import { cookies } from "next/headers";
import { Filter } from "bad-words";

const filter = new Filter();

const requiredFields = ["content"];

async function validateFields(data) {
  for (const field of requiredFields) {
    if (!data.get(field)) {
      return field;
    }
  }
  return null;
}

export async function POST(req, res) {
  try {
    const data = await req.formData();
    const cookiesStore = await cookies();

     const userid = data.get("user") || cookiesStore.get("user_id")?.value;

    const missingField = await validateFields(data);
    if (missingField) {
      return NextResponse.json(
        { status: 400, message: `The field ${missingField} is required` },
        { status: 400 }
      );
    }
     // Check for bad words
    const content = data.get("content") || "";
    if (filter.isProfane(content)) {
      return NextResponse.json(
        { status: 400, message: "Your post contains language that violates our community guidelines. Please remove any inappropriate words and try again." },
        { status: 400 }
      );
    }

    // Safely parse image field
    let imageArray = [];
    const imageField = data.get("image");
    if (imageField) {
      try {
        const parsedImage = JSON.parse(imageField);
        imageArray = Array.isArray(parsedImage) ? parsedImage : [];
      } catch (error) {
        console.error("Error parsing image field:", error);
        imageArray = [];
      }
    }
    
    console.log(imageArray)
    const postData = {
      title: "", // Title is optional, set to empty string
      content: data.get("content") || "",
      image: imageArray,
      video: data.get("video") || "",
      user: new ObjectId(String(userid)),
      status: data.get("status") || "public",
    };

    await connectToDB();

    const user = await User.findOne({ _id: postData.user });
    if (user.isBanfromPosting) {
      return NextResponse.json({
        status: 400,
        message: "You are banned from posting",
      });
    }

    const post = await Post.create(postData);

    return NextResponse.json({
      status: 200,
      message: "Post added successfully",
      data: post,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
