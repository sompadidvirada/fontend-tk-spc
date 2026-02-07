import { ClipboardMinus } from "lucide-react";
import React from "react";
import ParentTable from "./(component)/ParentTable";
import { getAllBranch } from "@/app/api/server/branchs";
import { cookies } from "next/headers";

const ReportBakery = async () => {
  const branchs = await getAllBranch();

  const cookieStore = await cookies();

  const lang = cookieStore.get("lang")?.value || "LA";

  const t = {
    title: lang === "LA" ? "ລາຍງານຍອດຂາຍແຕ່ລະສາຂາ" : "Sales Report by Branch",
    description:
      lang === "LA"
        ? "ລາຍງານ ຍອດຂາຍ ຍອດຈັດສົ່ງ ຍອດໝົດອາຍຸ ເບເກີລີ້ແຕ່ລະສາຂາ."
        : "Report on sales, delivery, and expiration for each bakery branch.",
  };
  return (
    <div className="mx-3 min-h-[80vh] pb-3 relative mt-3">
      {/* Header Section */}
      <div className="px-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="font-lao">
            <div className="font-lao flex gap-2 items-center">
              <h2 className="text-xl md:text-2xl font-bold">{t.title}</h2>
              <ClipboardMinus width={24} height={24} />
            </div>
            <p className="text-[12px] text-muted-foreground">{t.description}</p>
          </div>
        </div>
      </div>

      {/** * 2. Pass lang to ParentTable
       * It's important to pass this down so your table knows which language to show
       */}
      <ParentTable branchs={branchs} lang={lang} />

      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
};

export default ReportBakery;
