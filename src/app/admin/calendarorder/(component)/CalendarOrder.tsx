"use client";
import {
  CalendarIcon,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Clock,
  CreditCard,
  Edit3,
  FileText,
  Info,
  Truck,
  User,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState, useTransition } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Supplyer_Spc } from "../../material/(component)/DetailSupplyer";
import { Button } from "@/components/ui/button";
import { useStaffStore } from "@/store/staff";
import {
  deleteCalendarOrderSpc,
  getAllCalendarOrderSpc,
  updateCalendarOrderDate,
  updateDeliveryDate,
  updateDescriptionCalendar,
  updatePaymentDate,
  updateStatusCalendarOrderSpc,
} from "@/app/api/client/calendar_order";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import AddEventCalendar, { Material } from "./AddEventCalendar";
import { IconMoneybag } from "@tabler/icons-react";

interface Prop {
  supplyer_spc: Supplyer_Spc[];
  materials: Material[];
}

const mockEvents = [
  {
    id: "1",
    title: "ບໍລິສັດ ດີຈີຕອນ ລາວ ເທັກໂນໂລຊີ",
    start: "2026-09-05",
    extendedProps: {
      planDate: "2026-09-05",
      payment_date: "2026-09-04T00:00:00.000Z",
      delivery_date: "2026-09-06T00:00:00.000Z",
      paymentStatus: "success",
      deliveryStatus: "pending",
      po_link: "https://example.com/po-document.pdf",
      description:
        "ກະລຸນາກວດເຊັກສິນຄ້າກ່ອນເຊັນຮັບ. (Please verify items upon arrival)",
      products: [
        {
          id: "p1",
          name: "ນ້ຳດື່ມບໍລິສຸດ 1.5L",
          image:
            "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=150&auto=format&fit=crop&q=80",
          orderQuantity: 10,
          packSize: "Pack of 6",
        },
        {
          id: "p2",
          name: "ເມັດກາເຟອາຣາບິກາ 500g",
          image:
            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=150&auto=format&fit=crop&q=80",
          orderQuantity: 5,
          packSize: "500g Bag",
        },
      ],
    },
  },
];

interface Product {
  id?: string | number;
  name: string;
  image?: string;
  orderQuantity?: number;
  quantity?: number;
  packSize: string;
}
const CalendarOrder = ({ supplyer_spc, materials }: Prop) => {
  const staff = useStaffStore((state) => state.staff);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [isEditingPaymentDate, setIsEditingPaymentDate] = useState(false);
  const [isEditingDeliveryDate, setIsEditingDeliveryDate] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDetailModalOpen(false);
      // Optional: reset inline editing states if active
      setIsEditingPaymentDate(false);
      setIsEditingDeliveryDate(false);
      setIsEditingDescription(false);
    }
  };

  if (isDetailModalOpen) {
    window.addEventListener("keydown", handleKeyDown);
  }

  // Cleanup event listener when modal closes or unmounts
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [isDetailModalOpen]);

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
    items: [],
  });

  // 1. Wrap your event fetching logic in useCallback
  const fetchEvents = useCallback(
    async (
      info: { startStr: string; endStr: string },
      successCallback: (events: any[]) => void,
      failureCallback: (error: any) => void,
    ) => {
      try {
        const response = await getAllCalendarOrderSpc({
          start: info.startStr,
          end: info.endStr,
          role: staff.role,
          id: staff.id,
        });

        console.log(response);

        const formattedEvents = response.data.map((order: any) => ({
          id: order.id,
          title: order.supplier_spc.name,
          start: order.delivery_date,
          allDay: true,
          backgroundColor: getEventColor(
            order.payment_status,
            order.delivery_status,
            order.delivery_date, // 👈 Pass delivery_date here
          ),
          borderColor: "transparent",
          extendedProps: {
            ...order,
            paymentStatus: order.payment_status,
            deliveryStatus: order.delivery_status,
          },
        }));

        console.log(response);

        successCallback(formattedEvents);
      } catch (error: any) {
        failureCallback(error);
      }
    },
    [staff.id, staff.role],
  );

  const handleUpdatePaymentDate = async (newDate: string) => {
    try {
      await updatePaymentDate(selectedEvent.id, {
        payment_date: newDate,
      });
      // Update local state so UI changes immediately
      setSelectedEvent({ ...selectedEvent, payment_date: newDate });
      setIsEditingPaymentDate(false);

      // Refresh the background calendar
      calendarRef.current?.getApi().refetchEvents();
      toast.success("ອັບເດດວັນທີຊຳລະສຳເລັດ");
    } catch (err) {
      console.error(err);
      toast.error("ບໍ່ສາມາດອັບເດດວັນທີໄດ້");
    }
  };

  const handleUpdateDeliveryDate = async (newDate: string) => {
    try {
      await updateDeliveryDate(selectedEvent.id, {
        delivery_date: newDate,
      });

      setSelectedEvent({ ...selectedEvent, delivery_date: newDate });
      setIsEditingDeliveryDate(false);

      // Refresh the background calendar
      calendarRef.current?.getApi().refetchEvents();
      toast.success("ອັບເດດວັນທີຊຳລະສຳເລັດ");
    } catch (err) {
      console.error(err);
      toast.error("ບໍ່ສາມາດອັບເດດວັນທີໄດ້");
    }
  };

  // Helper to get color based on status
  const getEventColor = (
    payStatus: string,
    devStatus: string,
    deliveryDateStr?: string,
  ) => {
    if (deliveryDateStr) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Strip time so we strictly compare dates

      const deliveryDate = new Date(deliveryDateStr);
      deliveryDate.setHours(0, 0, 0, 0);

      if (deliveryDate.getTime() < today.getTime() && devStatus != "success") {
        return "#ef4444";
      }
    }

    // Existing status checks
    if (payStatus === "success" && devStatus === "success") return "#00bbff"; // Purple
    if (devStatus === "success") return "#3b82f6"; // Blue
    if (payStatus === "success") return "#10b981"; // Green
    return "#bfb521"; // Black / Pending
  };

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
      items: [],
    });
    setIsAddModalOpen(true);
  };

  const handleEventClick = (clickInfo: { event: any }) => {
    const event = clickInfo.event;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      ...event.extendedProps, // Flattens planDate, products, paymentStatus, etc.
    });

    setIsDetailModalOpen(true);
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

    const newColor = getEventColor(
      info.event.extendedProps.paymentStatus,
      info.event.extendedProps.deliveryStatus,
      newDate,
    );

    info.event.setProp("backgroundColor", newColor);

    try {
      // 1. Update the database
      await updateCalendarOrderDate(eventId, newDate);

      info.event.setExtendedProp("delivery_date", newDate);

      // 2. Success feedback
      toast.success(`ຍ້າຍ ${info.event.title} ໄປວັນທີ ${newDate} ສຳເລັດ`);

      // Note: We don't need setEvents() here because
      // the UI is already showing the event in the new position.
    } catch (error) {
      // 3. If backend fails, move the event back to where it was
      info.revert();
      const oldColor = getEventColor(
        info.event.extendedProps.paymentStatus,
        info.event.extendedProps.deliveryStatus,
        info.oldEvent.startStr,
      );
      info.event.setProp("backgroundColor", oldColor);
      console.error(error);
      toast.error("ບໍ່ສາມາດຍ້າຍວັນທີໄດ້");
    }
  };

  //delete fucntion..............................................//

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState("");
  const [tempDeliveryDate, setTempDeliveryDate] = useState<string>("");
  const [tempPayDate, setTempPayDate] = useState<string>("");

  const handleUpdateDescription = async (
    tempDescription: string,
    id: string,
  ) => {
    try {
      await updateDescriptionCalendar({ description: tempDescription, id: id });

      setSelectedEvent((prev: any) =>
        prev ? { ...prev, description: tempDescription } : null,
      );
      setIsEditingDescription(false);
      toast.success("ອັບເດດໝາຍເຫດສຳເລັດ");
    } catch (err) {
      console.log(err);
    }
  };

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
          events={fetchEvents}
        />
      </div>

      {/* --- MODAL 1: ADD EVENT (Keep previous logic) --- */}
      {isAddModalOpen && (
        <AddEventCalendar
          staff={staff}
          formData={formData}
          supplyer_spc={supplyer_spc}
          calendarRef={calendarRef}
          setIsAddModalOpen={setIsAddModalOpen}
          setFormData={setFormData}
          materials={materials}
        />
      )}

     {/* MODAL 2: DETAIL VIEW (Two-Column Split Layout) */}
{isDetailModalOpen && selectedEvent && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
    <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-in fade-in zoom-in duration-300">
      
      {/* LEFT COLUMN: Order Info, Dates, Statuses & Description */}
      <div className="md:w-5/12 bg-slate-50 border-r border-slate-200/80 p-6 flex flex-col justify-between overflow-y-auto space-y-6 shrink-0">
        <div className="space-y-6">
          {/* Header Title */}
          <div>
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
              ລາຍລະອຽດອໍເດີ
            </span>
            <h3 className="text-xl font-bold text-slate-800 break-words">
              {selectedEvent.title}
            </h3>
          </div>

          {/* Created By Staff */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase font-bold">
                ຜູ້ສ້າງ / Created By
              </p>
              <p className="text-sm font-bold text-slate-700 truncate">
                {selectedEvent.staff_office?.name ||
                  selectedEvent.staff_name ||
                  selectedEvent.staff?.name ||
                  "ບໍ່ລະບຸຜູ້ສ້າງ"}
              </p>
            </div>
          </div>

          {/* Dates & Statuses Section */}
          <div className="space-y-4">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              ກຳນົດເວລາ ແລະ ສະຖານະ
            </p>

            {/* Plan Date */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <CalendarIcon size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  ວັນທີອໍເດີ (Plan Date)
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {selectedEvent.plan_date?.split("T")[0] ||
                    selectedEvent.payment_date?.split("T")[0]}
                </p>
              </div>
            </div>

            {/* Payment Date & Status */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${selectedEvent.paymentStatus === "success" ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      ວັນທີຊຳລະ (Pay Date)
                    </p>
                    {isEditingPaymentDate ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="date"
                          className="border rounded-md px-1.5 py-0.5 text-xs font-bold text-slate-700 outline-blue-500"
                          defaultValue={selectedEvent.payment_date?.split("T")[0]}
                          onChange={(e) => setTempPayDate(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (tempPayDate) handleUpdatePaymentDate(tempPayDate);
                            setIsEditingPaymentDate(false);
                          }}
                          className="px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded"
                        >
                          ບັນທຶກ
                        </button>
                        <button
                          onClick={() => setIsEditingPaymentDate(false)}
                          className="text-xs text-slate-400 underline"
                        >
                          ຍົກເລີກ
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-1.5 cursor-pointer group"
                        onClick={() => setIsEditingPaymentDate(true)}
                      >
                        <p className="text-sm font-bold text-slate-800">
                          {selectedEvent.payment_date?.split("T")[0]}
                        </p>
                        <Edit3 size={12} className="text-slate-300 group-hover:text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => updateStatus("paymentStatus")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${selectedEvent.paymentStatus === "success" ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {selectedEvent.paymentStatus === "success" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {selectedEvent.paymentStatus === "success" ? "ສຳເລັດ" : "ລໍຖ້າ"}
                </button>
              </div>
            </div>

            {/* Delivery Date & Status */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${selectedEvent.deliveryStatus === "success" ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      ວັນທີຈັດສົ່ງ (Deliver Date)
                    </p>
                    {isEditingDeliveryDate ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="date"
                          className="border rounded-md px-1.5 py-0.5 text-xs font-bold text-slate-700 outline-blue-500"
                          defaultValue={selectedEvent.delivery_date?.split("T")[0]}
                          onChange={(e) => setTempDeliveryDate(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (tempDeliveryDate) handleUpdateDeliveryDate(tempDeliveryDate);
                            setIsEditingDeliveryDate(false);
                          }}
                          className="px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded"
                        >
                          ບັນທຶກ
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingDeliveryDate(false)}
                          className="text-xs text-slate-400 underline"
                        >
                          ຍົກເລີກ
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-1.5 cursor-pointer group"
                        onClick={() => {
                          setTempDeliveryDate(selectedEvent.delivery_date?.split("T")[0] || "");
                          setIsEditingDeliveryDate(true);
                        }}
                      >
                        <p className="text-sm font-bold text-slate-800">
                          {selectedEvent.delivery_date?.split("T")[0]}
                        </p>
                        <Edit3 size={12} className="text-slate-300 group-hover:text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => updateStatus("deliveryStatus")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${selectedEvent.deliveryStatus === "success" ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {selectedEvent.deliveryStatus === "success" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {selectedEvent.deliveryStatus === "success" ? "ສຳເລັດ" : "ລໍຖ້າ"}
                </button>
              </div>
            </div>
          </div>

          {/* PO Link Section */}
          {selectedEvent.po_link && (
            <div className="bg-blue-50/60 rounded-2xl p-3 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-500 p-1.5 rounded-lg text-white">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-blue-500 uppercase font-black">
                    PO Document
                  </p>
                  <p className="text-xs font-bold text-slate-700 truncate max-w-[110px]">
                    {selectedEvent.po_link}
                  </p>
                </div>
              </div>
              <a
                href={selectedEvent.po_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                ເປີດເບິ່ງ
              </a>
            </div>
          )}

          {/* Description Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs">
                <Info size={14} /> ໝາຍເຫດເພີ່ມເຕີມ:
              </div>
              {!isEditingDescription && (
                <button
                  type="button"
                  onClick={() => setIsEditingDescription(true)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Edit3 size={12} />
                  {selectedEvent.description ? "ແກ້ໄຂ" : "ເພີ່ມໝາຍເຫດ"}
                </button>
              )}
            </div>

            {isEditingDescription ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-blue-500 font-medium text-slate-700 resize-none"
                  defaultValue={selectedEvent.description || ""}
                  placeholder="ປ້ອນໝາຍເຫດເພີ່ມເຕີມ..."
                  onChange={(e) => setTempDescription(e.target.value)}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingDescription(false)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-400"
                  >
                    ຍົກເລີກ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateDescription(tempDescription, selectedEvent.id)}
                    className="px-2.5 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm"
                  >
                    ບັນທຶກ
                  </button>
                </div>
              </div>
            ) : (
              <p
                onClick={() => setIsEditingDescription(true)}
                className="text-slate-600 text-xs leading-relaxed break-words whitespace-pre-wrap cursor-pointer hover:text-slate-900"
              >
                {selectedEvent.description || (
                  <span className="text-slate-400 italic">ບໍ່ມີໝາຍເຫດ...</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Delete Button at Bottom Left */}
        <div className="pt-4 border-t border-slate-200">
          <Button
            variant="destructive"
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="w-full py-2.5 rounded-xl text-xs font-bold"
          >
            ລົບລາຍການນີ້
          </Button>
        </div>
      </div>

      {/* RIGHT COLUMN: Product List Details */}
      <div className="md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="font-bold text-slate-800 text-base">
              ລາຍການສິນຄ້າ ({(selectedEvent.items || selectedEvent.products)?.length || 0})
            </h4>
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Product Cards Container */}
          {((selectedEvent.items && selectedEvent.items.length > 0) ||
            (selectedEvent.products && selectedEvent.products.length > 0)) ? (
            <div className="space-y-2.5 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-1">
              {(selectedEvent.items || selectedEvent.products).map(
                (item: any, index: number) => {
                  const variant = item.material_variant || item.variant;
                  const materialName =
                    item.material_name ||
                    variant?.material?.name ||
                    item.name ||
                    "ສິນຄ້າ";
                  const variantName =
                    variant?.variant_name || item.variant_name;
                  const image =
                    item.image ||
                    variant?.image ||
                    variant?.material?.image ||
                    "/placeholder.png";

                  const qty = item.qty ?? item.orderQuantity ?? item.quantity ?? 0;
                  const baseQty = item.base_qty ?? item.baseQuantity;

                  return (
                    <div
                      key={item.id || index}
                      className="flex items-center gap-3.5 bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:border-slate-200 transition-all"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={materialName}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-white shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0 flex items-center justify-center text-lg">
                          📦
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">
                          {materialName}
                          {variantName && (
                            <span className="text-slate-500 font-normal">
                              {" "}
                              - {variantName}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                          <span>
                            ຈຳນວນ:{" "}
                            <strong className="text-slate-800 font-bold">
                              {qty}
                            </strong>
                          </span>
                          {baseQty !== undefined && (
                            <>
                              <span>•</span>
                              <span>
                                ຈຳນວນທັງໝົດ:{" "}
                                <strong className="text-blue-600 font-bold">
                                  {baseQty}
                                </strong>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs italic">
              ບໍ່ມີລາຍການສິນຄ້າ
            </div>
          )}
        </div>

        {/* Modal Close Action Button */}
        <div className="pt-4 border-t border-slate-100 mt-4">
          <Button
            onClick={() => setIsDetailModalOpen(false)}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs"
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
