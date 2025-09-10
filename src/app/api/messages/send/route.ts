import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const { receiver_id, content } = await request.json();
        if (!receiver_id || !content) {
            return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("messages")
            .insert([{ sender_id: decoded.id, receiver_id, content }])
            .select();

        if (error) throw error;

        return NextResponse.json(data[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 500 });
    }
}
