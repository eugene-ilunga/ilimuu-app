import { NextResponse } from "next/server";
import Lecture from "../../../model/lectureModel";
import { connectToDB } from "../../../../utils/database";
import { ObjectId } from "mongodb";

function toOptionalValue(value) {
    return value ? String(value) : null;
}

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

export async function POST(req, res) {
    try {
        const data = await req.formData();

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
            course: new ObjectId(String(data.get("course"))),
            status: data.get("status"),
        };
        
        // Add video fields only if content type is "video" or "both"
        if (contentType === "video" || contentType === "both") {
            lectureData.videoType = data.get("videoType");
            lectureData.videoUrl = data.get("videoUrl");
            lectureData.video_public_id = toOptionalValue(data.get("video_public_id"));
            lectureData.thumbnail = toOptionalValue(data.get("thumbnail"));
        }
        
        // Add PDF fields only if content type is "pdf" or "both"
        if (contentType === "pdf" || contentType === "both") {
            lectureData.pdfUrl = data.get("pdfUrl");
            lectureData.pdf_public_id = toOptionalValue(data.get("pdf_public_id"));
        }

        await connectToDB();
        const lecture = await Lecture.create(lectureData);

        return NextResponse.json({
            status: 200,
            message: "Lecture added successfully",
            data: lecture,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
