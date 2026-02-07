import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { getAllBranch } from "@/app/api/server/branchs";
import { getAllBakery } from "@/app/api/server/bakery";
import LineChartBakery from "./(component)/LineChartBakery";
import { cookies } from "next/headers";


export default async function Dashboard() {
    const branchs = await getAllBranch()
    const bakerys = await getAllBakery()

    const cookieStore = await cookies();
    
    const lang = cookieStore.get("lang")?.value || "LA"; 
  return (
    <div className="flex flex-1 flex-col relative">
      <div className="@container/main flex flex-1 flex-col gap-2 mb-8">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive branchs={branchs}/>
          </div>
          <div className="px-4 lg:px-6">
            <LineChartBakery bakerys={bakerys}/>
          </div>
         
        </div>
      </div>
      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
}
