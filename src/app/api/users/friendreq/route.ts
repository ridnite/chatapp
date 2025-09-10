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
        const { data: user, error: userError } = await supabase
            .from("friendships")
            .select(`sender_id,receiver_id,sender:users!friendships_sender_id_fkey ( id, name, image )`)
            .eq("receiver_id", decoded.id)
            .eq("status", "pending");

        if (userError) {
            return NextResponse.json({ error: "hata" }, { status: 404 });
        }
        return NextResponse.json(user ?? []);
    } catch (err) {
        return NextResponse.json({ error: "İstek alınamadı" }, { status: 500 });
    }
}