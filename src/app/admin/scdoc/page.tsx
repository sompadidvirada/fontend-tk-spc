"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import ExcelDoc from "./component/ExcelDoc";
import { getAllSupplyerSpc } from "@/app/api/client/supplyer";
import { Supplyer_Spc } from "../material/(component)/DetailSupplyer";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Page = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "ໃບຂໍເບີກຄ່າໃຊ້ຈ່າຍ_Voucher",
    pageStyle: `
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `,
  });

  const [supplyers, setSupplyers] = useState<Supplyer_Spc[]>([]);
  const [supplyerId, setSupplyerId] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplyer_Spc | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getSupplyers = async () => {
      try {
        const ress = await getAllSupplyerSpc();
        setSupplyers(ress.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSupplyers();
  }, []);

  const handleSelectSupplier = (id: string) => {
    // Toggle selection off if user clicks the same item twice
    const nextId = id === supplyerId ? "" : id;
    setSupplyerId(nextId);
    
    const found = supplyers.find((item) => item.id.toString() === nextId);
    setSelectedSupplier(found || null);
    setOpen(false); // Close dropdown on selection
  };

  return (
    <div className="p-6">
      {/* Top Action Bar */}
      <div className="mb-6 flex justify-end gap-5">
        
        {/* Searchable Combobox */}
        <div className="w-64">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-secondary font-lao border-slate-200"
              >
                {selectedSupplier
                  ? selectedSupplier.name
                  : "ເລືອກບໍລິສັດ/ຮ້ານ..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 font-lao" align="start">
              <Command>
                <CommandInput placeholder="ຄົ້ນຫາບໍລິສັດ/ຮ້ານ..." />
                <CommandList>
                  <CommandEmpty>ບໍ່ພົບຂໍ້ມູນ (No results)</CommandEmpty>
                  <CommandGroup>
                    {supplyers.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name} // Allows searching by name
                        onSelect={() => handleSelectSupplier(item.id.toString())}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            supplyerId === item.id.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Print Button */}
        <Button variant="secondary" onClick={() => handlePrint()}>
          🖨️ Print Excel Doc
        </Button>
      </div>

      {/* Printable Area */}
      <div ref={contentRef} >
        <ExcelDoc supplier={selectedSupplier} />
      </div>
    </div>
  );
};

export default Page;