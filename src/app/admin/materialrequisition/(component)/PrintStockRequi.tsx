import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintStockTemplate } from "./PrintStockTemplate";
import { Branch_type } from "../../tracksell/(component)/ParentTable";
import { Material } from "../../material/page";
import { Stock_Requisition } from "./TableMaterial";

interface Prop {
  branchs: Branch_type[];
  value: string;
  materiant_Variant: Material[];
  check: Stock_Requisition[];
  dateToSend: string;
}

const PrintStockRequi = ({
  branchs,
  value,
  check,
  materiant_Variant,
  dateToSend,
}: Prop) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const selectedBranchName =
    branchs.find((b) => b.id.toString() === value)?.name || "";
  return (
    <>
      {/* Keep your existing UI */}
      <div className="flex ...">
        {/* ... */}
        <Button
          onClick={reactToPrintFn} // Trigger print here
          variant="outline"
          className="font-lao h-8 md:h-9 max-w-50 cursor-pointer"
        >
          <Printer className="h-4 w-4 mr-2" />
          ປີ່ນລາຍການທີຈັດສົ່ງ
        </Button>
      </div>

      {/* Table View... */}

      {/* Hidden Print Template */}
      <div style={{ display: "none" }}>
        <PrintStockTemplate
          ref={contentRef}
          check={check}
          materials={materiant_Variant}
          date={dateToSend}
          branchName={selectedBranchName}
        />
      </div>
    </>
  );
};

export default PrintStockRequi;
