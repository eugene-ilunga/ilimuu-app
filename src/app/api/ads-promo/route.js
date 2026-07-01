import { connectToDB } from "@/utils/database";
import adsPromoModel from "@/app/model/adsPromoModel";
import { NextResponse } from "next/server";
import { ConnectionStates } from "mongoose";


export async function POST(req) {
    try {
        await connectToDB();
        const form = await req.formData();
        const isActiveValue = form.get('isActive')

        const newPromo = {
            title: form.get('title'),
            buttonLink: form.get('buttonLink'),
            buttonText: form.get('buttonText'),
            description: form.get('description'),
            isActive: isActiveValue === 'false' ? false : true,
            image: form.get('image'),
        }
        const created = await adsPromoModel.create(newPromo);
        return NextResponse.json({ success: true, data: created })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "something went wrong" }, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectToDB();
        const promos = await adsPromoModel.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: promos })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: "Failed to fetch data" })
    }
}


export async function PATCH(req) {
    try {
        await connectToDB();
        const { id, isActive } = await req.json();

        const updatedPromo = await adsPromoModel.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }

        )
        return NextResponse.json({ success: true, data: updatedPromo })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to updata' })
    }

}

export async function PUT(req) {
    try {
        await connectToDB();
        const form = await req.formData();
        const id = form.get('id');
        
        if (!id) {
            return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
        }

        const updateData = {
            title: form.get('title'),
            buttonLink: form.get('buttonLink'),
            buttonText: form.get('buttonText'),
            description: form.get('description'),
        };

        // Only update image if a new one is provided
        const image = form.get('image');
        if (image && image !== 'undefined' && image !== 'null') {
            updateData.image = image;
        }

        const updatedPromo = await adsPromoModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedPromo) {
            return NextResponse.json({ success: false, message: 'Promo not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedPromo });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to update promo' }, { status: 500 });
    }
}

export async function DELETE(req) {

    try {
        await connectToDB();
        const { id } = await req.json();
        await adsPromoModel.findByIdAndDelete(id)
        return NextResponse.json({ success: true, message: "Promo Deleted Successfully" })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 })

    }

}