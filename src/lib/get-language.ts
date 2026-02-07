// lib/get-language.ts
import { cookies } from "next/headers";

export async function getLanguage(): Promise<"LA" | "EN"> {
  const cookieStore = await cookies();
  return cookieStore.get("lang")?.value === "LA" ? "LA" : "EN";
}
