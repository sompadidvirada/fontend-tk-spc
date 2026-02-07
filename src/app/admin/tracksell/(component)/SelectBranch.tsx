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
import { useUIStore } from "@/store/ui";

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

  const lang = useUIStore((s) => s.language); 

  const t = {
    allBranches: lang === "LA" ? "ທຸກສາຂາ" : "All Branches",
    selectBranch: lang === "LA" ? "ເລືອກສາຂາ..." : "Select Branch...",
    search: lang === "LA" ? "ຄົ້ນຫາ..." : "Search...",
    noData: lang === "LA" ? "ບໍ່ພົບຂໍ້ມູນ." : "No data found.",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-lao"
        >
          {/* Label Logic */}
          {value === "all"
            ? t.allBranches
            : value
              ? branchs.find((b) => String(b.id) === value)?.name
              : t.selectBranch}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0 font-lao">
        <Command>
          <CommandInput placeholder={t.search} />
          <CommandList>
            <CommandEmpty>{t.noData}</CommandEmpty>
            <CommandGroup>
              {isForReport && (
                <CommandItem
                  value={t.allBranches} // Using translation for internal command value
                  onSelect={() => {
                    setValue("all");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "all" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {t.allBranches}
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
