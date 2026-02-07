"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

interface CalendarProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  forOrder: boolean
}

const CalendarCompo = ({ selectedDate, onDateChange, forOrder }: CalendarProps) => {
  const [open, setOpen] = React.useState(false);
 
  

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-48 justify-between font-lao"
        >
          {selectedDate
            ? new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              }).format(selectedDate)
            : "ເລືອກວັນທີ"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          captionLayout="dropdown"
          disabled={forOrder ? { dayOfWeek: [0,1,2,4,5,] } : false}
          onSelect={(date) => {
            onDateChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarCompo;
