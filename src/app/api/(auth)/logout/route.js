import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    //logout and clear the cookie

    const cookieStore = await cookies();

    // clear the session cookie
    cookieStore.getAll().forEach((cookie) => {
        cookieStore.delete(cookie.name);
    });

    return NextResponse.json({
        status: 200,
        message: "Logout Successfully!",
    });
}
