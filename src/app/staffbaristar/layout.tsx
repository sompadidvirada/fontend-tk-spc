import { cookies } from "next/headers";
import MobileLayout from "./MoblieLayout";
import { SessionProvider } from "./SessionProvider";
import { decrypt } from "../(lib)/session";

// app/staffbaristar/layout.tsx (Server Component)
export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const staff_detail = await decrypt(token);

  return (
    <SessionProvider session={staff_detail}>
      <MobileLayout>
        {children}
      </MobileLayout>
    </SessionProvider>
  );
}