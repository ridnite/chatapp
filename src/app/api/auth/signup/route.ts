import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();
        const { data, error } = await supabase.from("users").select("*").eq("email", email).single();

        if (error && error.code !== 'PGRST116') {
            return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 });
        }
        if (data) {
            return NextResponse.json({ error: 'Bu email zaten kayıtlı' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const { error: insertError } = await supabase.from("users").insert({ name, email, password: hashedPassword });
        if (insertError) {
            return NextResponse.json({ error: 'Kayıt oluşturulamadı' }, { status: 500 });
        }
        return NextResponse.json({ message: 'Kayıt başarılı' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}