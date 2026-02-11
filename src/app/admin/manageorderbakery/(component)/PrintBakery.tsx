import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React, { useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import ComponentPrint from "./ComponentPrint";
import { getOrderBakeryPrint } from "@/app/api/client/order_bakery";

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

  const handlePrint = useReactToPrint({
    contentRef,
  });

  const onPrintButtonClick = async () => {
    setLoading(true);
    try {
      const ress = await getOrderBakeryPrint({
        order_at: selecDate,
        supplyerId: supplyerId,
      });

      setDataToPrint(ress.data);

      // 3. IMPORTANT: Wait for React to render the data into the hidden div
      // We use a small timeout to let the state update reflect in the DOM
      setTimeout(() => {
        handlePrint();
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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
