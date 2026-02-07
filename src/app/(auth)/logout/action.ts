// app/(auth)/logout/action.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();
  
  // 1. Delete the session cookie
  cookieStore.delete("session");
  
  // 2. Redirect to login page
  // Note: redirect() must be called outside of try/catch blocks usually
  redirect("/login");
}