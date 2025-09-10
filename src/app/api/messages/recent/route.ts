import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase";

export async function GET() {
    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.id;

        const { data, error } = await supabase
            .from("messages")
            .select(
                `
        sender_id,
        content,
        created_at,
        sender:users!messages_sender_id_fkey ( id, name, image )
      `
            )
            .eq("receiver_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "Veri alınamadı" }, { status: 500 });
        }

        const rows: any[] = data ?? [];

        const seen = new Set<string>();
        const recent: any[] = [];

        for (const r of rows) {
            const sid = r.sender_id;
            if (!seen.has(sid)) {
                seen.add(sid);

                const senderObj = Array.isArray(r.sender) ? r.sender[0] : r.sender;

                recent.push({
                    sender: senderObj ?? null,
                    sender_id: sid,
                    lastMessage: r.content,
                    lastAt: r.created_at,
                });
            }
        }

        return NextResponse.json(recent);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "İstek alınamadı" }, { status: 500 });
    }
}
