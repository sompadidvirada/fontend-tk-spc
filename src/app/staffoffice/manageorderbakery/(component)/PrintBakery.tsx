import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React, { useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import ComponentPrint from "./ComponentPrint";
import { getOrderBakeryPrint } from "@/app/api/client/order_bakery";

const PrintBakery = ({ selecDate }: { selecDate: string }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [dataToPrint, setDataToPrint] = React.useState();

  useEffect(() => {
    const fecthOrderPrint = async () => {
      try {
        const ress = await getOrderBakeryPrint({ order_at: selecDate });
        setDataToPrint(ress.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (selecDate) {
      fecthOrderPrint();
    }
  }, [selecDate]);


  return (
    <>
      <Button variant="secondary" onClick={reactToPrintFn}>
        <Printer size={18} className="mr-2" /> ພິມອໍເດີສາຂາ
      </Button>
      <div className="hidden">
        <div ref={contentRef} className="p-8 font-lao">
          <ComponentPrint ref={contentRef} dataToPrint={dataToPrint}/>
        </div>
      </div>
    </>
  );
};

export default PrintBakery;
