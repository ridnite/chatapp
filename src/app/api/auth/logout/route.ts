import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const res = NextResponse.json({ message: "Çıkış yapıldı" });
        res.cookies.set({
            name: "token",
            value: "",
            httpOnly: true,
            path: "/",
            expires: new Date(0), 
        });
        return res;
    } catch (error) {
        console.error("Logout hatası:", error);
        return NextResponse.json({ error: "Çıkış yapılamadı" }, { status: 500 });
    }
}