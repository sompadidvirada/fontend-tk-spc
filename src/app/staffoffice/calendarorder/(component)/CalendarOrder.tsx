"use client";
import {
  CalendarIcon,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Clock,
  CreditCard,
  FileText,
  Info,
  Truck,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import React, { useRef, useState, useTransition } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useStaffStore } from "@/store/staff";
import {
  createCalendarOrderSpc,
  deleteCalendarOrderSpc,
  getAllCalendarOrderSpc,
  updateCalendarOrderDate,
  updateStatusCalendarOrderSpc,
} from "@/app/api/client/calendar_order";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Supplyer_Spc } from "@/app/admin/material/(component)/DetailSupplyer";

interface Prop {
  supplyer_spc: Supplyer_Spc[];
}

const CalendarOrder = ({ supplyer_spc }: Prop) => {
  const staff = useStaffStore((state) => state.staff);
  const [events, setEvents] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  // Helper to get color based on status
  const getEventColor = (payStatus: string, devStatus: string) => {
    if (payStatus === "success" && devStatus === "success") return "#10b981"; // Green
    if (payStatus === "success" || devStatus === "success") return "#3b82f6"; // Blue
    return "#64748b"; // Slate/Gray for pending
  };

  const [formData, setFormData] = useState({
    title: "",
    supplier_spcId: "",
    description: "",
    po_link: "",
    plan_date: "",
    payment_date: "",
    delivery_date: "",
    payment_status: "pending",
    delivery_status: "pending",
    staff_officeId: staff.id,
  });

  const handleDateClick = (info: any) => {
    setFormData({
      title: "",
      supplier_spcId: "",
      description: "",
      po_link: "",
      plan_date: info.dateStr,
      payment_date: info.dateStr,
      delivery_date: info.dateStr,
      payment_status: "pending",
      delivery_status: "pending",
      staff_officeId: staff.id,
    });
    setIsAddModalOpen(true);
  };

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      ...info.event.extendedProps,
      po_link: info.event.extendedProps.po_link,
      planDate: info.event.startStr,
    });
    setIsDetailModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier_spcId) return toast.error("ກະລຸນາເລືອກບໍລິສັດກ່ອນ.");
    const supplierName =
      supplyer_spc.find((s) => s.id === formData.supplier_spcId)?.name ||
      "ບໍ່ລະບຸ";

    const payload = {
      title: supplierName,
      supplier_spcId: formData.supplier_spcId,
      description: formData.description,
      po_link: formData.po_link,
      plan_date: formData.plan_date,
      payment_date: formData.payment_date,
      delivery_date: formData.delivery_date,
      staff_officeId: staff.id,
    };

    try {
      await createCalendarOrderSpc(payload);

      // 1. Get the Calendar API instance via ref
      const calendarApi = calendarRef.current?.getApi();

      calendarApi?.refetchEvents();

      setIsAddModalOpen(false);
      toast.success("ບັນທຶກແຜນການສຳເລັດ");
    } catch (error) {
      console.error(error);
      toast.error("ບໍ່ສາມາດບັນທຶກໄດ້");
    }
  };

  const updateStatus = async (type: "paymentStatus" | "deliveryStatus") => {
    const newStatusValue =
      selectedEvent[type] === "pending" ? "success" : "pending";

    // Map frontend camelCase to backend snake_case
    const dbField =
      type === "paymentStatus" ? "payment_status" : "delivery_status";
    try {
      await updateStatusCalendarOrderSpc(selectedEvent.id, {
        statusType: dbField,
        statusValue: newStatusValue,
      });
      const updatedEvent = { ...selectedEvent, [type]: newStatusValue };
      setSelectedEvent(updatedEvent);

      // 4. Tell FullCalendar to fetch fresh data (this updates the colors on the grid)
      const calendarApi = calendarRef.current?.getApi();
      calendarApi?.refetchEvents();

      toast.success("ອັບເດດສະຖານະສຳເລັດ");
    } catch (err) {
      console.error(err);
      toast.error("ບໍ່ສາມາດອັບເດດສະຖານະໄດ້");
    }
  };

  const handleEventDrop = async (info: any) => {
    const eventId = info.event.id;
    const newDate = info.event.startStr; // FullCalendar gives us 'YYYY-MM-DD'

    try {
      // 1. Update the database
      await updateCalendarOrderDate(eventId, newDate);

      // 2. Success feedback
      toast.success(`ຍ້າຍ ${info.event.title} ໄປວັນທີ ${newDate} ສຳເລັດ`);

      // Note: We don't need setEvents() here because
      // the UI is already showing the event in the new position.
    } catch (error) {
      // 3. If backend fails, move the event back to where it was
      info.revert();
      console.error(error);
      toast.error("ບໍ່ສາມາດຍ້າຍວັນທີໄດ້");
    }
  };

  //delete fucntion..............................................//

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        // 1. Call your API (Ensure you have this exported in your client api file)
        await deleteCalendarOrderSpc(selectedEvent.id);

        // 2. Refresh the Calendar UI
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.refetchEvents();

        // 3. Close both modals
        setIsDeleteConfirmOpen(false);
        setIsDetailModalOpen(false);
        toast.success("ລົບລາຍການສຳເລັດ");
      } catch (error) {
        console.error(error);
        toast.error("ບໍ່ສາມາດລົບລາຍການໄດ້");
      }
    });
    setIsDeleteConfirmOpen(false);
  };

  //............................................................//

  return (
    <div>
      <div className="flex-1 bg-white border rounded-xl p-4 shadow-sm h-[80vh]">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          height="100%"
          ref={calendarRef}
          editable={true}
          selectable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          events={async (info, successCallback, failureCallback) => {
            try {
              const response = await getAllCalendarOrderSpc({
                start: info.startStr,
                end: info.endStr,
                role: staff.role,
                id: staff.id
              });

              const formattedEvents = response.data.map((order: any) => ({
                id: order.id,
                title: order.supplier_spc.name,
                start: order.plan_date,
                allDay: true,
                backgroundColor: getEventColor(
                  order.payment_status,
                  order.delivery_status,
                ),
                borderColor: "transparent",
                extendedProps: {
                  ...order,
                  paymentStatus: order.payment_status,
                  deliveryStatus: order.delivery_status,
                },
              }));

              successCallback(formattedEvents);
            } catch (error: any) {
              failureCallback(error);
            }
          }}
        />
      </div>

      {/* --- MODAL 1: ADD EVENT (Keep previous logic) --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">ເພີ່ມແຜນໃໝ່</h3>
            <Label>ບໍລິສັດຜູ້ສະໜອງ</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-lao bg-white"
                >
                  {/* Search by ID, display by Name */}
                  {formData.supplier_spcId
                    ? supplyer_spc.find(
                        (spc) => spc.id.toString() === formData.supplier_spcId,
                      )?.name
                    : "ເລືອກບໍລິສັດຜູ້ສະໜອງ..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              {/* Use Portal to ensure it floats above the z-[100] modal */}
              <PopoverContent
                className="w-full p-0 font-lao z-[110]"
                align="start"
              >
                <Command shouldFilter={true}>
                  <CommandInput placeholder="ຄົ້ນຫາຊື່ຜູ້ສະໜອງ..." />
                  <CommandList>
                    <CommandEmpty>ບໍ່ພົບຂໍ້ມູນຜູ້ສະໜອງ.</CommandEmpty>
                    <CommandGroup>
                      {supplyer_spc.map((spc) => (
                        <CommandItem
                          key={spc.id}
                          // IMPORTANT: The value is what the search input looks at
                          value={spc.name}
                          onSelect={() => {
                            // Set the ID in your form, but close the popover
                            setFormData({
                              ...formData,
                              supplier_spcId: spc.id.toString(),
                            });
                            setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.supplier_spcId === spc.id.toString()
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <div className="flex items-center gap-2">
                            {spc.image && (
                              <img
                                src={spc.image}
                                className="h-5 w-5 rounded-full object-cover"
                                alt=""
                              />
                            )}
                            <span>{spc.name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold">ວັນທີຊຳລະ</label>
                <input
                  type="date"
                  value={formData.payment_date}
                  className="w-full border p-2 rounded-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, payment_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold">ວັນທີສົ່ງເຄື່ອງ</label>
                <input
                  type="date"
                  value={formData.delivery_date}
                  className="w-full border p-2 rounded-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_date: e.target.value })
                  }
                />
              </div>
            </div>{" "}
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-bold">
                ລິ້ງເອກະສານ PO (ຖ້າມີ)
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.po_link}
                  className="w-full border p-2 rounded-lg pl-8 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, po_link: e.target.value })
                  }
                />
                <FileText
                  size={14}
                  className="absolute left-2.5 top-3 text-slate-400"
                />
              </div>
            </div>
            <textarea
              placeholder="ໝາຍເຫດ..."
              className="w-full border rounded-lg p-2 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              ບັນທຶກ
            </button>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="w-full text-slate-400 py-1"
            >
              ຍົກເລີກ
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 2: DETAIL VIEW (New UI) --- */}
      {/* MODAL 2: DETAIL VIEW (With Interactive Status Update) */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
              <X
                className="cursor-pointer"
                onClick={() => setIsDetailModalOpen(false)}
              />
            </div>

            <div className="p-8 space-y-8">
              <div className="relative space-y-8">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                {/* Plan Date */}
                <div className="relative flex items-center gap-6">
                  <div className="z-10 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-500">
                    <CalendarIcon size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">
                      ວັນທີອໍເດີ
                    </p>
                    <p className="text-lg font-bold">
                      {selectedEvent.planDate}
                    </p>
                  </div>
                </div>

                {/* Payment Status Row */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div
                      className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${selectedEvent.paymentStatus === "success" ? "bg-green-50 border-green-500" : "bg-slate-50 border-slate-300"}`}
                    >
                      <CreditCard
                        size={18}
                        className={
                          selectedEvent.paymentStatus === "success"
                            ? "text-green-600"
                            : "text-slate-400"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">
                        ການຊຳລະເງິນ
                      </p>
                      <p className="text-lg font-bold">
                        {selectedEvent.payment_date?.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateStatus("paymentStatus")}
                    className={`flex items-center cursor-pointer gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedEvent.paymentStatus === "success" ? "bg-green-500 text-white shadow-lg shadow-green-100" : "bg-slate-100 text-slate-500"}`}
                  >
                    {selectedEvent.paymentStatus === "success" ? (
                      <>
                        <CheckCircle2 size={14} /> ສຳເລັດ
                      </>
                    ) : (
                      <>
                        <Clock size={14} /> ລໍຖ້າ...
                      </>
                    )}
                  </button>
                </div>

                {/* Delivery Status Row */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div
                      className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${selectedEvent.deliveryStatus === "success" ? "bg-green-50 border-green-500" : "bg-slate-50 border-slate-300"}`}
                    >
                      <Truck
                        size={18}
                        className={
                          selectedEvent.deliveryStatus === "success"
                            ? "text-green-600"
                            : "text-slate-400"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">
                        ການສົ່ງເຄື່ອງ
                      </p>
                      <p className="text-lg font-bold">
                        {selectedEvent.delivery_date?.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateStatus("deliveryStatus")}
                    className={`flex cursor-pointer items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedEvent.deliveryStatus === "success" ? "bg-green-500 text-white shadow-lg shadow-green-100" : "bg-slate-100 text-slate-500"}`}
                  >
                    {selectedEvent.deliveryStatus === "success" ? (
                      <>
                        <CheckCircle2 size={14} /> ສຳເລັດ
                      </>
                    ) : (
                      <>
                        <Clock size={14} /> ລໍຖ້າ...
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* PO Link Section */}
              {selectedEvent.po_link && (
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-lg text-white">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-500 uppercase font-black">
                        PO Document
                      </p>
                      <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                        {selectedEvent.po_link}
                      </p>
                    </div>
                  </div>
                  <a
                    href={selectedEvent.po_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    ເປີດເບິ່ງໄຟລ໌
                  </a>
                </div>
              )}

              {/* Description Box (Normal Text) */}
              {selectedEvent.description && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-slate-600 font-bold text-sm">
                    <Info size={16} /> ໝາຍເຫດເພີ່ມເຕີມ:
                  </div>
                  <p className="text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t flex flex-col gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="w-full py-3 rounded-xl font-bold"
                >
                  ລົບລາຍການນີ້
                </Button>
                <Button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
                >
                  ປິດໜ້າຕ່າງ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <X className="text-red-500 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold">ຢືນຢັນການລົບ?</h3>
                <p className="text-sm text-slate-500">
                  ທ່ານແນ່ໃຈຫຼືບໍ່ວ່າຕ້ອງການລົບລາຍການນີ້?
                  ຂໍ້ມູນນີ້ບໍ່ສາມາດກູ້ຄືນໄດ້.
                </p>
              </div>
              <div className="flex w-full gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 rounded-xl"
                  disabled={isPending}
                >
                  ຍົກເລີກ
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 rounded-xl font-bold"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                    </>
                  ) : (
                    "ລົບອອກ"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarOrder;
