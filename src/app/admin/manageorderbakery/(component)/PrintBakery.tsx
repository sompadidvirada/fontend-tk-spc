import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React from "react";
import ComponentPrint from "./ComponentPrint";
import ComponentPrint2 from "./ComponentPrint2";

const PrintBakery = ({
  selecDate,
  supplyerId,
}: {
  selecDate: string;
  supplyerId: string;
}) => {
  const onPrintButtonClick = () => {
    const url = `/print-bakery?date=${selecDate}&supplierId=${supplyerId}`;

    window.open(url, "_blank");
  };

  const onPrintButtonClick2 = () => {
    // Construct the URL with parameters
    const url = `/print-bakery2?date=${selecDate}&supplierId=${supplyerId}`;

    // Open in a new tab
    window.open(url, "_blank");
  };

  const isDisable = !supplyerId || !selecDate;

  return (
    <>
      <Button
        variant="secondary"
        onClick={onPrintButtonClick}
        disabled={isDisable}
      >
        <Printer size={18} className="mr-2" />
        ພິມອໍເດີສາຂາ
      </Button>
      <Button
        variant="default"
        onClick={onPrintButtonClick2}
        disabled={isDisable}
      >
        <Printer size={18} className="mr-2" />
        ພິມອໍເດີສຳລັບ bakery house
      </Button>
    </>
  );
};

export default PrintBakery;
