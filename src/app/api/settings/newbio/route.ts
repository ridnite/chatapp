import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { newBio } = await request.json();
        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const { error } = await supabase.from("users").update({ bio: newBio }).eq("id", decoded.id);
        if (error) {
            return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 400 });
        }
        return NextResponse.json({ message: "Bio başarıyla güncellendi" });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "İstek alınamadı" }, { status: 500 });
    }
}