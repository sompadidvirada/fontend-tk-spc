import { cookies } from "next/headers";
import { decrypt } from "../(lib)/session";
import Navbar from "../(components)/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "./Providers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = await decrypt(token);
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    
    <Providers>
      <SidebarProvider
        style={{ "--sidebar-width": "15rem" } as React.CSSProperties}
        defaultOpen={defaultOpen}
      >
        <div className="flex min-h-screen bg-gray-50 text-gray-900 flex-1">
          <AppSidebar session={session} />

          <SidebarInset>
            <main className="flex flex-col w-full h-full pb-3 bg-gray-200">
              <Navbar />
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
