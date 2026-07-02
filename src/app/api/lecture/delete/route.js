import { NextResponse } from "next/server";
import Lecture from "../../../model/lectureModel";
import { connectToDB } from "../../../../utils/database";
import { deleteStoredFile } from "../../../../utils/local-file-storage";

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

export async function DELETE(req, res) {
    try {
        const { searchParams } = new URL(req.url);
        const lectureId = searchParams.get("id");

        if (!lectureId) {
            return NextResponse.json(
                { status: 400, message: "Lecture ID is required" },
                { status: 400 }
            );
        }

        await connectToDB();
        
        const deletedLecture = await Lecture.findByIdAndDelete(lectureId);

        if (!deletedLecture) {
            return NextResponse.json(
                { status: 404, message: "Lecture not found" },
                { status: 404 }
            );
        }

        await deleteLectureAssets(deletedLecture);

        return NextResponse.json({
            status: 200,
            message: "Lecture deleted successfully",
            data: deletedLecture,
        });
    } catch (error) {
        console.error("Error deleting lecture:", error);
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
