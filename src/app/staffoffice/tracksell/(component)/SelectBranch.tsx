"use client";

import * as React from "react";
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
import { Branch_type } from "./ParentTable";

export interface DataBranchSelectProps {
  branchs: Branch_type[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isForReport: boolean;
}

const SelectBranch = ({
  branchs,
  setValue,
  value,
  isForReport = false,
}: DataBranchSelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-lao"
        >
          {value === "all"
            ? "ທຸກສາຂາ"
            : value
              ? branchs.find((b) => String(b.id) === value)?.name
              : "ເລືອກສາຂາ..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 font-lao">
        <Command>
          <CommandInput placeholder="ຄົ້ນຫາ..." />
          <CommandList>
            <CommandEmpty>ບໍ່ພົບຂໍ້ມູນ.</CommandEmpty>
            <CommandGroup>
              {isForReport && (
                <CommandItem
                  value={"ທຸກສາຂາ"}
                  onSelect={() => {
                    const stringId = String("all");
                    setValue(stringId);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === String("all") ? "opacity-100" : "opacity-0",
                    )}
                  />
                  ທຸກສາຂາ
                </CommandItem>
              )}
              {branchs.map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={branch.name}
                  onSelect={() => {
                    const stringId = String(branch.id);
                    setValue(stringId === value ? "" : stringId);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === String(branch.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {branch.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectBranch;
