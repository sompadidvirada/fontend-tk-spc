import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React from "react";
import ComponentPrint from "./ComponentPrint";

const PrintBakery = ({
  selecDate,
  supplyerId,
}: {
  selecDate: string;
  supplyerId: string;
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [dataToPrint, setDataToPrint] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const onPrintButtonClick = () => {
    // Construct the URL with parameters
    const url = `/print-bakery?date=${selecDate}&supplierId=${supplyerId}`;
    
    // Open in a new tab
    window.open(url, "_blank");
  };

  const isDisable = !supplyerId || !selecDate || loading;

  return (
    <>
      <Button
        variant="secondary"
        onClick={onPrintButtonClick}
        disabled={isDisable}
      >
        <Printer size={18} className="mr-2" />
        {loading ? "ກຳລັງໂຫຼດ..." : "ພິມອໍເດີສາຂາ"}
      </Button>
      <div className="hidden">
        <div ref={contentRef} className="p-8 font-lao">
          <ComponentPrint ref={contentRef} dataToPrint={dataToPrint} />
        </div>
      </div>
    </>
  );
};

export default PrintBakery;
