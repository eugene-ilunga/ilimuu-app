import { NextResponse } from "next/server";
import Question from "@/app/model/courseQNA";
import { connectToDB } from "@/utils/database";
import { ObjectId } from "mongodb";
export async function POST(req) {
  try {
    const formdata = await req.formData();
    const courseid = formdata.get("courseid");
    const askedBy = formdata.get("askedBy");
    const question = formdata.get("question");
    const answerToQuestionId = formdata.get("answerToQuestionId");
    const answerContent = formdata.get("answer");

    await connectToDB();

    // Check if we are adding a new answer to an existing question
    if (answerToQuestionId) {
      // Find the question by ID
      const qna = await Question.findOne({course:new ObjectId(String(courseid) ), _id: new ObjectId(String(answerToQuestionId)) });

      if (!qna) {
        return NextResponse.json({
          status: false,
          message: "Question not found",
        });
      }

      console.log(qna);
      // Find the specific answer to reply to
      qna.answers.push({
        content: answerContent,
        answeredBy: askedBy,
      });
      await qna.save();


    } else {
      // Create a new question
      const newQuestion = new Question({
        course: courseid,
        question,
        askedBy,
      });

      await newQuestion.save();
    }

    return NextResponse.json({
      status: 200,
      message: "QNA posted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
