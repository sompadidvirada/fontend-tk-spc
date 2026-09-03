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
  X,
} from "lucide-react";
import React, { useCallback, useRef, useState, useTransition } from "react";
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

      {/* MODAL 2: DETAIL VIEW (With Interactive Status Update) */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* close button */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
              <X
                className="cursor-pointer"
                onClick={() => setIsDetailModalOpen(false)}
              />
            </div>
            {/** content dialog */}
            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
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
                      {selectedEvent.payment_date?.split("T")[0]}
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
                        ການຊຳລະ
                      </p>
                      {isEditingPaymentDate ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="date"
                            className="border rounded-lg px-2 py-1 text-sm font-bold text-slate-700 outline-blue-500"
                            defaultValue={
                              selectedEvent.payment_date?.split("T")[0]
                            }
                            onChange={(e) => setTempPayDate(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (tempPayDate) {
                                handleUpdatePaymentDate(tempPayDate);
                              }
                              setIsEditingPaymentDate(false);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
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
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => setIsEditingPaymentDate(true)}
                        >
                          <p className="text-lg font-bold">
                            {selectedEvent.payment_date?.split("T")[0]}
                          </p>
                          <Edit3
                            size={14}
                            className="text-slate-300 group-hover:text-blue-500 transition-colors"
                          />
                        </div>
                      )}
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
                        ການຈັດສົ່ງ
                      </p>
                      {isEditingDeliveryDate ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="date"
                            className="border border-slate-200 bg-white rounded-lg px-2 py-1 text-sm font-bold text-slate-700 outline-blue-500 shadow-sm"
                            defaultValue={
                              selectedEvent.delivery_date?.split("T")[0]
                            }
                            onChange={(e) =>
                              setTempDeliveryDate(e.target.value)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (tempDeliveryDate) {
                                handleUpdateDeliveryDate(tempDeliveryDate);
                              }
                              setIsEditingDeliveryDate(false);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                          >
                            ບັນທຶກ
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingDeliveryDate(false)}
                            className="px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-600"
                          >
                            ຍົກເລີກ
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => {
                            setTempDeliveryDate(
                              selectedEvent.delivery_date?.split("T")[0] || "",
                            );
                            setIsEditingDeliveryDate(true);
                          }}
                        >
                          <p className="text-lg font-bold">
                            {selectedEvent.delivery_date?.split("T")[0]}
                          </p>
                          <Edit3
                            size={14}
                            className="text-slate-300 group-hover:text-blue-500 transition-colors"
                          />
                        </div>
                      )}
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
              {/* Description Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                    <Info size={16} /> ໝາຍເຫດເພີ່ມເຕີມ:
                  </div>

                  {!isEditingDescription && (
                    <button
                      type="button"
                      onClick={() => setIsEditingDescription(true)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 size={14} />
                      {selectedEvent.description ? "ແກ້ໄຂ" : "ເພີ່ມໝາຍເຫດ"}
                    </button>
                  )}
                </div>

                {isEditingDescription ? (
                  <div className="space-y-3 mt-2">
                    <textarea
                      rows={3}
                      className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl outline-blue-500 font-medium text-slate-700 resize-none"
                      defaultValue={selectedEvent.description || ""}
                      placeholder="ປ້ອນໝາຍເຫດເພີ່ມເຕີມ..."
                      onChange={(e) => setTempDescription(e.target.value)}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingDescription(false)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200/60 rounded-lg transition-colors"
                      >
                        ຍົກເລີກ
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateDescription(
                            tempDescription,
                            selectedEvent.id,
                          )
                        }
                        className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        ບັນທຶກ
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    onClick={() => setIsEditingDescription(true)}
                    className="text-slate-600 text-sm leading-relaxed break-words whitespace-pre-wrap cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    {selectedEvent.description || (
                      <span className="text-slate-400 italic">
                        ບໍ່ມີໝາຍເຫດ...
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Product List Section */}
              {((selectedEvent.items && selectedEvent.items.length > 0) ||
                (selectedEvent.products &&
                  selectedEvent.products.length > 0)) && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    ລາຍການສິນຄ້າ (
                    {selectedEvent.items?.length ||
                      selectedEvent.products?.length ||
                      0}
                    )
                  </p>
                  <div className="space-y-2">
                    {(selectedEvent.items || selectedEvent.products).map(
                      (item: any, index: number) => {
                        // Resolve item properties across nested relations or flat product objects
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

                        const qty =
                          item.qty ?? item.orderQuantity ?? item.quantity ?? 0;
                        const baseQty = item.base_qty ?? item.baseQuantity;

                        return (
                          <div
                            key={item.id || index}
                            className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3 rounded-2xl"
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
                      },
                    )}
                  </div>
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
