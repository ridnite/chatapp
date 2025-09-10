import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase";

export async function GET(request: Request) {
    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const { data, error } = await supabase.from("friendships").select(`sender_id,receiver_id,sender:users!friendships_sender_id_fkey ( id, name, image )`).eq("status", "accepted").eq("receiver_id", decoded.id);
        console.log(data, error);
        if (error) {
            return NextResponse.json({ error: "Veri alınamadı" }, { status: 404 });
        }
        return NextResponse.json(data);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "İstek alınamadı" }, { status: 500 });
    }
}