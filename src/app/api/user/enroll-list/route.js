import { NextResponse } from "next/server";
import Enroll from "../../../model/enrollModel";
import { connectToDB } from "../../../../utils/database";
import { handleApiError } from "../../../../utils/errorHandler";
import Course from "../../../model/courseModel";

export async function POST(req, res) {
    try {
        const data = await req.formData();
    
        await connectToDB();
    
        const enrollist = await Enroll.find({user: data.get('userid')}).populate({path: 'course', select: '_id title image price', model: 'Cours'});
    
        return NextResponse.json({
            status: 200,
            message: "Enroll List",
            data: enrollist,
        });
    } catch (error) {
        return handleApiError(error);
    }
    }