import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { sender_id } = await request.json();
        if (!sender_id) {
            return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
        }
        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const { error } = await supabase.from("friendships").delete().eq("sender_id", sender_id).eq("receiver_id", decoded.id).eq("status", "pending");
        if (error) {
            return NextResponse.json({ error: "hata" }, { status: 404 });
        }
        return NextResponse.json({ message: "Arkadaşlık isteği reddedildi" });
    } catch (err) {
        return NextResponse.json({ error: "İstek alınamadı" }, { status: 500 });
    }
}