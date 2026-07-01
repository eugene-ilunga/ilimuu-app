import { NextResponse } from "next/server";
import Lecture from "../../../model/lectureModel";
import { connectToDB } from "../../../../utils/database";
import { ObjectId } from "mongodb";

const requiredFields = [
    "title",
    "duration",
    "course",
];

async function validateFields(data) {
    for (const field of requiredFields) {
        if (!data.get(field)) {
            return field;
        }
    }
    
    // Validate content type and corresponding fields
    const contentType = data.get("contentType") || "video";
    
    if (contentType === "video") {
        if (!data.get("videoType") || !data.get("videoUrl")) {
            return "videoUrl";
        }
    }
    
    if (contentType === "pdf") {
        if (!data.get("pdfUrl")) {
            return "pdfUrl";
        }
    }
    
    if (contentType === "both") {
        // For "both", both video and PDF must be provided
        if (!data.get("videoUrl") || !data.get("videoType")) {
            return "videoUrl and videoType";
        }
        if (!data.get("pdfUrl")) {
            return "pdfUrl";
        }
    }
    
    return null;
}

export async function PUT(req, res) {
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
            contentType: contentType,
            summary: data.get("summary"),
            status: data.get("status"),
        };
        
        // Add video fields only if content type is "video" or "both"
        if (contentType === "video" || contentType === "both") {
            lectureData.videoType = data.get("videoType");
            lectureData.videoUrl = data.get("videoUrl");
            lectureData.video_public_id = data.get("video_public_id");
            lectureData.thumbnail = data.get("thumbnail");
        } else {
            // Remove video fields if content type is not video or both
            lectureData.videoType = null;
            lectureData.videoUrl = null;
            lectureData.video_public_id = null;
            lectureData.thumbnail = null;
        }
        
        // Add PDF fields only if content type is "pdf" or "both"
        if (contentType === "pdf" || contentType === "both") {
            lectureData.pdfUrl = data.get("pdfUrl");
            lectureData.pdf_public_id = data.get("pdf_public_id");
        } else {
            // Remove PDF fields if content type is not pdf or both
            lectureData.pdfUrl = null;
            lectureData.pdf_public_id = null;
        }

        await connectToDB();
        
        const updatedLecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { $set: lectureData },
            { new: true, runValidators: true }
        );

        if (!updatedLecture) {
            return NextResponse.json(
                { status: 404, message: "Lecture not found" },
                { status: 404 }
            );
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

