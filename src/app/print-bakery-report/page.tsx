"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { getReportBakery } from "@/app/api/client/trackingbakery";
import ComponentToPrint from "../admin/reportbakery/(component)/ComponentToPrint";

export default function BakeryPrintPage() {
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const branchId = searchParams.get("branchId");
  const branchName = searchParams.get("branchName");
  const lang = searchParams.get("lang");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Bakery_Report_${branchId}_${start}`,
  });

  useEffect(() => {
    if (start && end && branchId) {
      getReportBakery({ startDate: start, endDate: end, branchId })
        .then((ress) => {
          setData(ress.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [start, end, branchId]);

  // Auto-print effect
  useEffect(() => {
    if (!loading && data.length > 0) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [loading, data, handlePrint]);

  if (loading) return <div className="p-10 font-lao text-center">ກຳລັງໂຫລດຂໍ້ມູນ...</div>;

  return (
    <div className="p-4 bg-white">
      <div ref={contentRef}>
        {/* Pass your props to your existing component */}
        <ComponentToPrint
          data={data}
          branchId={branchId || ""} 
          branchName={branchName || ""} 
          dateRange={{ from: new Date(start!), to: new Date(end!) }} 
        />
      </div>

      {/* Helper button that won't show on paper (if you use @media print { .no-print {display: none} }) */}
      <div className="mt-8 flex justify-center no-print">
        <button 
          onClick={() => handlePrint()}
          className="px-6 py-2 bg-blue-500 text-white rounded shadow-lg font-lao"
        >
          {lang === "LA" ? "ພິມຄືນໃໝ່" : "Print Again"}
        </button>
      </div>
    </div>
  );
}