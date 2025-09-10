import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const { data, error } = await supabase.from("users").select("*").eq("email", email).single();

        if (error && error.code !== 'PGRST116') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, data.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
        }

        const token = jwt.sign({ id: data.id, username: data.name }, process.env.JWT_SECRET!, { expiresIn: "1d" });

        const response = NextResponse.json({ message: "Giriş başarılı", username: data.name, image: data.image, bio: data.bio }, { status: 200 });
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
        });
        return response;
    } catch (error) {
        console.error("Giriş hatası:", error);
        return NextResponse.json({ error: "Giriş yapılamadı" }, { status: 500 });
    }
}