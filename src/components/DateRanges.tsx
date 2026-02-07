"use client";

import { useUIStore } from "@/store/ui";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { ArrowDown, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker, DateRange, getDefaultClassNames } from "react-day-picker";

interface DateRangesProps {
  range: DateRange | undefined;
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const DateRanges = ({range, setRange}: DateRangesProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [tempRange, setTempRange] = useState<DateRange | undefined>();
  const { language } = useUIStore();
  const defaultClassNames = getDefaultClassNames();


  const selectPreset = (preset: string) => {
    const today = new Date();
    let selection: DateRange = { from: undefined, to: undefined };

    switch (preset) {
      case "today":
        selection = { from: today, to: today };
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        selection = { from: yesterday, to: yesterday };
        break;
      case "last7":
        selection = { from: subDays(today, 6), to: today };
        break;
      case "last30":
        selection = { from: subDays(today, 29), to: today };
        break;
      case "thisMonth":
        selection = { from: startOfMonth(today), to: endOfMonth(today) };
        break;
      case "lastMonth":
        const prevMonth = subMonths(today, 1);
        selection = {
          from: startOfMonth(prevMonth),
          to: endOfMonth(prevMonth),
        };
        break;
      case "thisYear":
        selection = { from: startOfYear(today), to: endOfYear(today) };
        break;
      default:
        selection = { from: undefined, to: undefined };
    }
    setTempRange(selection);
  };

  const presets = [
    { label: "ມື້ນິ້", id: "today" },
    { label: "ມື້ວານ", id: "yesterday" },
    { label: "7 ມື້ຍ້ອນຫລັງ", id: "last7" },
    { label: "30 ມື້ຍ້ອນຫລັງ", id: "last30" },
    { label: "ເດືອນນີ້", id: "thisMonth" },
    { label: "ເດືອນທີແລ້ວ", id: "lastMonth" },
    { label: "ປີນີ້", id: "thisYear" },
    { label: "ເລືອກເອງ", id: "custom" },
  ];

  const handleOpen = () => {
    setTempRange(range);
    setOpen(true);
  };

  const handleApply = () => {
    setRange(tempRange);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempRange(range);
    setOpen(false);
  };

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative inline-block ">
      {/* BUTTON */}
      <button
        onClick={handleOpen}
        suppressHydrationWarning
        className="inline-flex w-full items-center bg-gray-100 gap-2 rounded-md border border-gray-300 px-3 md:h-9 h-6 text-sm font-medium justify-between hover:bg-gray-300 cursor-pointer shadow-sm"
      >
        <Calendar className="md:w-4 md:h-4 w-3 h-3" />
        <span className="flex-1 truncate text-left font-lao text-[10px] md:text-sm">
          {range?.from && range?.to
            ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
            : `${language === "LA" ? "ກະລຸນາເລືອກວັນທີ" : "Pick a date range"}`}
        </span>
        <ArrowDown className="md:w-4 md:h-4 w-3 h-3" />
      </button>

      {/* CALENDAR */}
      {open && (
        <div className=" flex gap-2 absolute w-[314px] md:w-[645px] lg:w-[822px]  md:right-0 right-0 mt-2 z-50 bg-gray-110 rounded-lg shadow-lg p-3">
          <div className="w-full hidden md:w-40 border-b md:border-b-0 bg-gray-50/50 p-2 lg:flex flex-row md:flex-col gap-1 overflow-x-auto">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPreset(p.id)}
                className="whitespace-nowrap text-left px-3 py-2 text-xs rounded-md hover:bg-gray-400 hover:text-white transition-colors cursor-pointer font-lao"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col font-lao">
            <DayPicker
              mode="range"
              selected={tempRange}
              onSelect={setTempRange}
              numberOfMonths={isMobile ? 1 : 2}
              pagedNavigation
              classNames={{
                today: `border-amber-500`, // Add a border to today's date
                selected: `bg-amber-500 border-amber-500 text-gray-950`, // Highlight the selected day
                root: `${defaultClassNames.root} bg-gray-110`, // Add a shadow to the root element
                range_start: `rounded-[5px] bg-blue-300`,
                range_end: `rounded-[5px] bg-blue-300`,
                caption_label: "text-xs font-bold",
                head_cell: "text-xs uppercase tracking-wide",
                day: "text-sm",
              }}
            />
            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-3 pt-3">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs rounded-md border hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!tempRange?.from || !tempRange?.to}
                className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-lao"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRanges;
