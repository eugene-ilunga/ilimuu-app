import { NextResponse } from "next/server";
import Lecture from "../../../model/lectureModel";
import { connectToDB } from "../../../../utils/database";
import { deleteStoredFile } from "../../../../utils/local-file-storage";

const requiredFields = ["title", "duration", "course"];

function toOptionalValue(value) {
  return value ? String(value) : null;
}

async function validateFields(data) {
  for (const field of requiredFields) {
    if (!data.get(field)) {
      return field;
    }
  }

  const contentType = data.get("contentType") || "video";

  if (contentType === "video") {
    if (!data.get("videoType") || !data.get("videoUrl")) {
      return "videoUrl";
    }
  }

  if (contentType === "pdf" && !data.get("pdfUrl")) {
    return "pdfUrl";
  }

  if (contentType === "both") {
    if (!data.get("videoUrl") || !data.get("videoType")) {
      return "videoUrl and videoType";
    }
    if (!data.get("pdfUrl")) {
      return "pdfUrl";
    }
  }

  return null;
}

async function deleteLectureAssets(lecture) {
  const references = [
    lecture?.video_public_id,
    lecture?.videoUrl,
    lecture?.thumbnail,
    lecture?.pdf_public_id,
    lecture?.pdfUrl,
  ].filter(Boolean);

  await Promise.all(
    [...new Set(references)].map((reference) => deleteStoredFile(reference))
  );
}

export async function PUT(req) {
  try {
    const data = await req.formData();
    const lectureId = data.get("id");

    if (!lectureId) {
      return NextResponse.json(
        { status: 400, message: "Lecture ID is required" },
        { status: 400 }
      );
    }

    const missingField = await validateFields(data);
    if (missingField) {
      return NextResponse.json(
        { status: 400, message: `The field ${missingField} is required` },
        { status: 400 }
      );
    }

    const contentType = data.get("contentType") || "video";
    const lectureData = {
      title: data.get("title"),
      duration: data.get("duration"),
      contentType,
      summary: data.get("summary"),
      status: data.get("status"),
    };

    if (contentType === "video" || contentType === "both") {
      lectureData.videoType = data.get("videoType");
      lectureData.videoUrl = data.get("videoUrl");
      lectureData.video_public_id = toOptionalValue(data.get("video_public_id"));
      lectureData.thumbnail = toOptionalValue(data.get("thumbnail"));
    } else {
      lectureData.videoType = null;
      lectureData.videoUrl = null;
      lectureData.video_public_id = null;
      lectureData.thumbnail = null;
    }

    if (contentType === "pdf" || contentType === "both") {
      lectureData.pdfUrl = data.get("pdfUrl");
      lectureData.pdf_public_id = toOptionalValue(data.get("pdf_public_id"));
    } else {
      lectureData.pdfUrl = null;
      lectureData.pdf_public_id = null;
    }

    await connectToDB();

    const existingLecture = await Lecture.findById(lectureId);
    if (!existingLecture) {
      return NextResponse.json(
        { status: 404, message: "Lecture not found" },
        { status: 404 }
      );
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      { $set: lectureData },
      { new: true, runValidators: true }
    );

    const shouldDeletePreviousVideo =
      Boolean(existingLecture.video_public_id) &&
      existingLecture.video_public_id !== updatedLecture.video_public_id;
    const shouldDeletePreviousPdf =
      Boolean(existingLecture.pdf_public_id) &&
      existingLecture.pdf_public_id !== updatedLecture.pdf_public_id;

    if (shouldDeletePreviousVideo || shouldDeletePreviousPdf) {
      await deleteLectureAssets({
        video_public_id: shouldDeletePreviousVideo
          ? existingLecture.video_public_id
          : null,
        videoUrl: shouldDeletePreviousVideo ? existingLecture.videoUrl : null,
        thumbnail: shouldDeletePreviousVideo ? existingLecture.thumbnail : null,
        pdf_public_id: shouldDeletePreviousPdf
          ? existingLecture.pdf_public_id
          : null,
        pdfUrl: shouldDeletePreviousPdf ? existingLecture.pdfUrl : null,
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Lecture updated successfully",
      data: updatedLecture,
    });
  } catch (error) {
    console.error("Error updating lecture:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
