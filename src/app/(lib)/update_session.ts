"use server"

import { cookies } from "next/headers";

export async function updateSessionAction(token: string) {
  const expiresAt = new Date(Date.now() + 20 * 60 * 60 * 1000);
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAt,
    sameSite: isProd ? "none" : "lax", 
    path: "/",
  });
}