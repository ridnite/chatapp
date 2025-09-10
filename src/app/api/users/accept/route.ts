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
        const { error } = await supabase.from("friendships").update({ status: "accepted" }).eq("sender_id", sender_id).eq("receiver_id", decoded.id);
        if (error) {
            return NextResponse.json({ error: "hata" }, { status: 404 });
        }
        const { error: insertError } = await supabase.from("friendships").insert([{ sender_id: decoded.id, receiver_id: sender_id, status: "accepted" }]);
        if (insertError) {
            return NextResponse.json({ error: "hata" }, { status: 404 });
        }
        return NextResponse.json({ message: "Arkadaşlık isteği kabul edildi" });
    } catch (err) {
        return NextResponse.json({ error: "İstek alınamadı" }, { status: 500 });
    }
}