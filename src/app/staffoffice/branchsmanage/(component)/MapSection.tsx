"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BranchMap, { Branch } from "./BranchMap";
import { Label } from "@/components/ui/label";


const MapSection = ({ branchs }: { branchs: Branch[] }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSelect = (branch: Branch) => {
    // 1. Trigger the map to move
    const event = new CustomEvent("map-jump", { 
      detail: { lat: branch.lat, lng: branch.lng, id: branch.id } 
    });
    window.dispatchEvent(event);
    
    // 2. UI feedback
    setValue(branch.name);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Searchable Select Menu on top of the map */}
      <div className="flex flex-col gap-2">
        <Label className="font-lao pl-2 font-bold text-2xl">ຄົ້ນຫາສາຂາໃນແຜນທີ</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between font-lao"
            >
              {value ? value : "ຄົ້ນຫາຊື່ສາຂາ..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 font-lao">
            <Command>
              <CommandInput placeholder="ພິມຊື່ສາຂາ..." />
              <CommandList>
                <CommandEmpty>ບໍ່ພົບຂໍ້ມູນ.</CommandEmpty>
                <CommandGroup>
                  {branchs.map((branch) => (
                    <CommandItem
                      key={branch.id}
                      value={branch.name}
                      onSelect={() => handleSelect(branch)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === branch.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {branch.name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {branch.province}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* The Map */}
      <BranchMap branchs={branchs} />
    </div>
  );
};

export default MapSection;