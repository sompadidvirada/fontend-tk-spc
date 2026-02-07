// lib/session.ts
import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export async function createSession(token: string) {
  // 1. Set the expiration (match this to your Express JWT 20h)
  const expiresAt = new Date(Date.now() + 20 * 60 * 60 * 1000);

  // 2. Access the cookie store
  const cookieStore = await cookies();

  // 3. Set the cookie
  cookieStore.set("session", token, {
    httpOnly: true, // Prevent JS access (XSS protection)
    secure: true, // Only over HTTPS in production
    expires: expiresAt,
    sameSite: "lax", // CSRF protection
    path: "/", // Available across the whole site
  });
}

const secretKey = process.env.SESSION_SECRET; // Must match Express process.env.SECRET
const encodedKey = new TextEncoder().encode(secretKey);

// src/app/(lib)/session.ts

export async function decrypt(session: string | undefined = "") {
  // 1. If there's no session string at all, stop immediately
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error: any) {
    // Check CloudWatch for this specific message:
    console.error("MIDDLEWARE DECRYPT ERROR:", {
      message: error.message,
      code: error.code, // e.g., ERR_JWT_SIGNATURE_VERIFICATION_FAILED
      secretUsed: process.env.SESSION_SECRET
        ? "SECRET_EXISTS"
        : "SECRET_MISSING",
    });
    return null;
  }
}
