"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { getReport3monthBakery } from "../api/client/dashboard";
import ComponentToPrint3Month from "../admin/reportbakery/(component)/ComponentToPrint3Month";

const Bakery3MonthPagePrint = () => {
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const branchId = searchParams.get("branchId");
  const branchName = searchParams.get("branchName");

  const [dataMap, setDataMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `3Month_Bakery_Report_${branchId}`,
  });

  useEffect(() => {
    const fetchReport = async () => {
      if (!start || !branchId) return;
      try {
        const ress = await getReport3monthBakery({
          date: start,
        });
        setDataMap(ress.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchReport();
  }, [start, branchId]);

  console.log(dataMap);

  useEffect(() => {
    if (!loading && Object.keys(dataMap).length > 0) {
      const timer = setTimeout(() => handlePrint(), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, dataMap, handlePrint]);

  if (loading)
    return <div className="p-10 text-center font-lao">ກຳລັງໂຫລດຂໍ້ມູນ...</div>;

  return (
    <div className="p-4 bg-white">
      <div ref={contentRef}>
        <ComponentToPrint3Month
          dataMap={dataMap}
        />
      </div>
    </div>
  );
};

export default Bakery3MonthPagePrint;
