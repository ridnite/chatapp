import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        const { data, error } = await supabase.from("users").select("id, name, image").ilike("name", `%${name}%`);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: "Kullanıcı arama işlemi başarılı", user: data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Kullanıcı arama işlemi başarısız" }, { status: 500 });
    }
}