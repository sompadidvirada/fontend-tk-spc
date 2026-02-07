// app/actions/set-language.ts
"use server";

import { cookies } from "next/headers";

export async function setLanguage(lang: "EN" | "LA") {
  const cookieStore = await cookies();

  cookieStore.set("lang", lang, {
    path: "/",
    sameSite: "lax",
  });
}
