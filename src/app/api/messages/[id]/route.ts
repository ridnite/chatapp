import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const { id: otherUserId } = await context.params;

        const { data, error } = await supabase
            .from("messages")
            .select("id, sender_id, receiver_id, content, created_at")
            .or(`and(sender_id.eq.${decoded.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${decoded.id})`)
            .order("created_at", { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: "Mesajlar alınamadı" }, { status: 500 });
    }
}
