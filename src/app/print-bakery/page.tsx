"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { getOrderBakeryPrint } from "@/app/api/client/order_bakery";
import ComponentPrint from "../admin/manageorderbakery/(component)/ComponentPrint";

export default function PrintPage() {
  const searchParams = useSearchParams();
  const selecDate = searchParams.get("date");
  const supplyerId = searchParams.get("supplierId");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Create a ref for the content we want to print
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize the print hook
  const handlePrint = useReactToPrint({
    contentRef,
    // Optional: add a title for the PDF file name
    documentTitle: `Bakery_Order_${selecDate}`,
  });

  useEffect(() => {
    if (selecDate && supplyerId) {
      getOrderBakeryPrint({ order_at: selecDate, supplyerId })
        .then((ress) => {
          setData(ress.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    }
  }, [selecDate, supplyerId]);

  // Trigger print once data is loaded and DOM is rendered
  useEffect(() => {
    if (!loading && data) {
      // Small delay to ensure React has finished painting the ComponentPrint
      const timer = setTimeout(() => {
        handlePrint();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, data, handlePrint]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-lao">
        ກຳລັງໂຫຼດຂໍ້ມູນ...
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Container that react-to-print will target */}
      <div ref={contentRef} className="font-lao">
        <ComponentPrint dataToPrint={data} />
      </div>
      
      {/* Optional: Visual button for the user if they cancel the first dialog */}
      <div className="mt-4 no-print flex justify-center">
        <button 
          onClick={() => handlePrint()}
          className="px-4 py-2 bg-blue-600 text-white rounded font-lao"
        >
          ກົດເພື່ອພິມອີກຄັ້ງ
        </button>
      </div>
    </div>
  );
}