"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Assumes shadcn progress component
import { FileInput, Loader2, Paperclip } from "lucide-react";
import { toast } from "sonner"; // Or your preferred toast library
import { insertStockRemian } from "@/app/api/client/stock_requisition";
import { Material, Material_Variant } from "../../material/page";


interface UploadFileProps {

  materials: Material[];
  fecthStockRemain: any
  isDisable: boolean
}

const UploadFile = ({ materials,fecthStockRemain ,isDisable }: UploadFileProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);



const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setLoading(true);
  try {
    const htmlText = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const rows = doc.querySelectorAll("table.list tr");
    
    // 1. Prepare the Array
    const stockDataBatch: { variantId: number; count: number; baseFactor: number }[] = [];

    rows.forEach((row, index) => {
      if (index === 0) return;
      const cells = row.querySelectorAll("td");
      if (cells.length < 9) return;

      const barcode = cells[2]?.textContent?.trim();
      const quantity = parseInt(cells[8]?.textContent?.trim() || "0", 10);

      if (barcode && !isNaN(quantity)) {
        materials.forEach((rm) => {
          rm.material_variant.forEach((variant) => {
            if (variant.barcode === barcode) {
              stockDataBatch.push({
                variantId: variant.id,
                count: quantity,
                // Pass the conversion factor so backend can calculate base_count
                baseFactor: variant.conver_to_base || 1 
              });
            }
          });
        });
      }
    });

    if (stockDataBatch.length === 0) {
      toast.error("ບໍ່ພົບຂໍ້ມູນໃນຟາຍ");
      setLoading(false);
      return;
    }

    await insertStockRemian({ stockData: stockDataBatch })
    fecthStockRemain()
    toast.success("ອັປໂຫລດທັງໝົດສຳເລັດ!");
  } catch (err) {
    console.error(err);
    toast.error("ເກີດຂໍ້ຜິດພາດໃນການອັປໂຫລດ");
  } finally {
    setLoading(false);
    event.target.value = "";
  }
};

  // Check if form is ready (matching your MUI logic)
  const isDisabled = loading

  return (
    <div className="">
      {/* Hidden Native Input */}
      <input
        type="file"
        id="file-upload"
        accept=".html"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isDisabled || isDisable}
      />

      {/* Styled Button acting as Label */}
      <Button
        asChild
        variant={loading ? "secondary" : "outline"}
        className="font-lao cursor-pointer"
        disabled={isDisabled || isDisable}
      >
        <label htmlFor="file-upload" className="flex items-center justify-center gap-2 cursor-pointer">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Paperclip className="h-4 w-4" />
          )}
          {loading ? `ກຳລັງອັປໂຫລດ (${progress}%)` : "ອັປໂຫລດຟາຍສະຕ໋ອກ"}
        </label>
      </Button>

      {/* Progress Bar Rendering */}
      {loading && (
        <div className="mt-2 w-full space-y-1">
          <Progress value={progress} className="h-1" />
          <div className="text-[10px] text-right text-muted-foreground font-sans">
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;