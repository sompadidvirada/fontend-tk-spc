"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/command";

type Branch_type = {
  id: number;
  name: string;
  phonenumber: string;
  province: string;
  available: boolean;
};

type Props = {
  branches: Branch_type[];
  selectedBranchIds: number[];
  setSelectedBranchIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function BranchMultiSelect({
  branches,
  selectedBranchIds,
  setSelectedBranchIds,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const toggleBranch = (id: number) => {
    setSelectedBranchIds((current) =>
      current.includes(id)
        ? current.filter((branchId) => branchId !== id)
        : [...current, id],
    );
  };
  const selectedBranches = branches.filter((branch) =>
    selectedBranchIds.includes(branch.id),
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {" "}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between font-lao"
        >
          <span className="truncate">
            {selectedBranches.length === 0
              ? "ເລືອກສາຂາ"
              : selectedBranches.length === branches.length
                ? "ທຸກສາຂາ"
                : `ເລືອກ ${selectedBranches.length} ສາຂາ`}
          </span>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="ຄົ້ນຫາສາຂາ..." className="font-lao" />

          <CommandEmpty className="font-lao">ບໍ່ພົບສາຂາ</CommandEmpty>

          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {branches.map((branch) => {
              const selected = selectedBranchIds.includes(branch.id);

              return (
                <CommandItem
                  key={branch.id}
                  value={branch.name}
                  onSelect={() => toggleBranch(branch.id)}
                  className="font-lao"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {branch.name}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
