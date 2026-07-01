import { NextResponse } from "next/server"; 
import Question from "@/app/model/courseQNA";
import { connectToDB } from "@/utils/database";
import { ObjectId } from "mongodb";
import path from "path";
import { model } from "mongoose";
import User from "@/app/model/userModel";

export async function POST(req) {

    try {
const formdata = await req.formData();
const courseid = formdata.get("courseid");

await connectToDB();

const qna = await Question.find({course:new ObjectId(String(courseid))})
.populate(
    {
    path: "askedBy",
    model: User,
    select: "_id name image"
    }

)
.populate
( {
    path: "answers.answeredBy",
    model: User,
    select: "_id name image"
    }
)

;

if (!qna) {
return NextResponse.json({
status: 200,
message: "QNA not found",
});
} else {

return NextResponse.json({
status: 200,
message: "QNA fetch successfully",
qna

});
}
    }
catch (error) {
return NextResponse.json({
status: 500,
message: error.message,
});

    }
}