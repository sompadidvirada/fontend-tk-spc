import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/app/(lib)/session";

export default async function Home() {
  // 1. Get the session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  // 2. Decrypt it to get the role
  const payload = await decrypt(session);

  // 3. Logic-based redirection
  if (!payload) {
    // Not logged in? Send to login
    redirect("/login");
  }

  const role = payload.role as string;

  if (role === "ADMIN") {
   return redirect("/admin");
  } 
  
  if (role === "STAFF_SPC" || role === "STAFF_TK" || role === "STAFF_WH") {
   return redirect("/staffoffice");
  }

  if (role === "BARISTAR") {
   return redirect("/staffbaristar")
  }

  // Fallback for unknown roles
 return redirect("/login");
}