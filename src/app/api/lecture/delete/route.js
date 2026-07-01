import { NextResponse } from "next/server";
import Lecture from "../../../model/lectureModel";
import { connectToDB } from "../../../../utils/database";

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

