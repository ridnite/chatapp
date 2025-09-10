import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { friendId } = await request.json();

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });
    }

    const senderId = decoded.id;

    const { error } = await supabase.from("friendships").insert([
      {
        sender_id: senderId,
        receiver_id: friendId,
        status: "pending",
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Arkadaşlık isteği gönderildi" });
  } catch (err) {
    return NextResponse.json({ error: "İstek gönderilemedi" }, { status: 500 });
  }
}
