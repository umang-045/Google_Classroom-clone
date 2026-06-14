import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { getToken } from "next-auth/jwt";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: NextRequest) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            return NextResponse.json({ message: "No file Found" }, { status: 400 })
        }
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ message: "File too large, max 10MB" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "classroom-clone" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result)
                }
            )
            uploadStream.end(buffer)
        })
        return NextResponse.json({ result }, { status: 200 })


    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }

}