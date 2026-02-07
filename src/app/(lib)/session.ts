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
    // 2. Try to verify
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // 3. Instead of letting the app crash, just log and return null
    // This allows the middleware to handle the redirect properly
    console.warn("Session verification failed (expired or invalid token)");
    return null;
  }
}


