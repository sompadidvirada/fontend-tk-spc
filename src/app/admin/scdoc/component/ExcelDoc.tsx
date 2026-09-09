import { useStaffStore } from "@/store/staff";
import Image from "next/image";
import React, { useState, ChangeEvent, useEffect } from "react";
import { Supplyer_Spc } from "../../material/(component)/DetailSupplyer";

// --- Type Definitions ---
export type CurrencyType = "ກີບ" | "ບາດ" | "ໂດລາ";
export type ExpenseType = "general" | "purchase";
export type PaymentMethod = "cheque" | "transfer";

export interface VoucherFormData {
  docNo: string;
  date: string;
  purchasePlanNo: string;
  departmentNo: string;
  requesterName: string;
  department: string;
  payTo: string;
  currency: CurrencyType;
  expenseType: ExpenseType;
  poNo: string;
  invoiceNo: string;
  receiptNo: string;
  paymentMethod: PaymentMethod;
  bankName: string;
  accountName: string;
  accountNo: string;
  dueDate: string;
  amountInWords: string;
}

export interface VoucherItem {
  numbers: string;
  id: number;
  name: string;
  qty: number;
  unitPrice: number;
  amount: number;
  remark: string;
}

export interface BudgetSummary {
  code: string;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  currency: string;
}

interface DataProp {
  supplier: Supplyer_Spc | null; // or change to 'suppliers' if preferred
}

export const ExcelDoc: React.FC<DataProp> = ({ supplier }) => {
  const { staff } = useStaffStore();

  // --- Form State ---
  const [formData, setFormData] = useState<VoucherFormData>({
    docNo: "",
    date: new Date().toISOString().split("T")[0],
    purchasePlanNo: "",
    departmentNo: "",
    requesterName: staff?.name,
    department: "ຈັດຊື້-TREEKOFF",
    payTo: "",
    currency: "ກີບ",
    expenseType: "purchase",
    poNo: "",
    invoiceNo: "",
    receiptNo: "",
    paymentMethod: "transfer",
    bankName: "",
    accountName: "",
    accountNo: "",
    dueDate: "",
    amountInWords: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData((prev) => ({
        ...prev,
        payTo: supplier.name || "",
        accountName: supplier.account_name || "",
        accountNo: supplier.account_number || "",
        bankName: supplier.bank_name || "",
      }));
    }
  }, [supplier]);

  // --- Dynamic Items Table State ---
  const [items, setItems] = useState<VoucherItem[]>([]);

  // --- Budget Summary State ---
  const [budget, setBudget] = useState<BudgetSummary>({
    code: "",
    totalBudget: 0,
    usedBudget: 0,
    remainingBudget: 0,
    currency: "ກີບ/LAK",
  });

  // Generic Form Inputs Handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Table Items Handler with Automatic Row Amount Calculation
  const handleItemChange = (
    index: number,
    field: keyof VoucherItem,
    value: string | number,
  ): void => {
    const newItems = [...items];
    const targetItem = { ...newItems[index] };

    if (field === "qty" || field === "unitPrice") {
      const parsedVal = parseFloat(value as string) || 0;
      (targetItem[field] as number) = parsedVal;

      const qty = field === "qty" ? parsedVal : targetItem.qty;
      const unitPrice =
        field === "unitPrice" ? parsedVal : targetItem.unitPrice;
      targetItem.amount = qty * unitPrice;
    } else if (field === "name" || field === "remark" || field == "numbers") {
      (targetItem[field] as string) = value as string;
    }

    newItems[index] = targetItem;
    setItems(newItems);
  };

  // Add Item Row
  const addRow = (): void => {
    setItems([
      ...items,
      {
        numbers: "",
        id: Date.now(),
        name: "",
        qty: 0,
        unitPrice: 0,
        amount: 0,
        remark: "",
      },
    ]);
  };

  // Remove Item Row
  const removeRow = (index: number): void => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculate Total Amount
  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="font-voucher max-w-4xl mx-auto p-6 bg-white shadow-md my-8 rounded-lg border border-gray-200 text-sm print:shadow-none print:m-0 print:p-2 print:border-none">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-0">
        {/* Header Info with Logo and Company Details */}
        <div className="flex justify-between items-start mb-4 w-full">
          <div className="flex items-center gap-3">
            {/* Logo Image */}
            <img
              src="/images/logo_bigtree.jpg"
              alt="BIGTREE TRADING CO., LTD"
              className="h-8 w-auto object-contain"
            />
            {/* Company Name & Address in Lao */}
            <div className="text-xm leading-tight font-medium text-gray-800">
              <h2 className="font-bold text-sm text-black">
                ບໍລິສັດ ບິກທຮີ ການຄ້າ ຈຳກັດ
              </h2>
              <p>ບ້ານ ສີບຸນເຮືອງ, ເມືອງ ຈັນທະບູລີ</p>
              <p>ແຂວງນະຄອນຫລວງວຽງຈັນ</p>
            </div>
          </div>

          {/* Document Info (Right side) */}
          <div className="text-start text-xm space-y-1 border p-4 border-gray-300">
            <div>
              <strong>ເລກທີ:</strong>{" "}
              <input
                type="text"
                name="docNo"
                value={formData.docNo}
                onChange={handleChange}
                placeholder=""
                className="font-voucher border-b border-gray-400 focus:outline-none w-28 text-center"
              />
            </div>
            <div>
              <strong>ວັນທີ:</strong>{" "}
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="font-voucher border-b border-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <strong>ແຜນການສັ່ງຊື້ເລກທີ:</strong>{" "}
              <input
                type="text"
                name="purchasePlanNo"
                value={formData.purchasePlanNo}
                onChange={handleChange}
                className="font-voucher focus:outline-none w-28 text-center"
              />
            </div>
            <div>
              <strong>ເລກທີພະແນກ:</strong>{" "}
              <input
                type="text"
                name="departmentNo"
                value={formData.departmentNo}
                onChange={handleChange}
                className="font-voucher focus:outline-none w-28 text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Document Title */}
      <div className="text-center mb-4 -mt-3">
        <h1 className="text-2xl font-bold border-b-2 border-black inline-block pb-1">
          ໃບຂໍເບີກຄ່າໃຊ້ຈ່າຍ
        </h1>
      </div>

      {/* Requester & Payment Info */}
      <div className="space-y-1 mb-2 text-[12px]">
        {/* Row 1 */}
        <div className="grid grid-cols-10 gap-2 items-center">
          <div className="col-span-5 flex items-center">
            <span className="whitespace-nowrap font-semibold">
              ຜູ້ທີ່ມາຂໍເບີກ ຊື່ ແລະ ນາມສະກຸນ:
            </span>
            <input
              type="text"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
              className="border-b border-dotted border-gray-600 focus:outline-none flex-1 ml-1 px-1 font-medium"
            />
          </div>
          <div className="col-span-5 flex items-center">
            <span className="whitespace-nowrap font-semibold">
              ພະແນກ/ໜ່ວຍງານ:
            </span>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border-b border-dotted border-gray-600 focus:outline-none flex-1 ml-1 px-1 font-medium"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-10 gap-2 items-center">
          <div className="col-span-3 flex items-center">
            <span className="whitespace-nowrap font-semibold">
              ຈຳນວນເງິນທີ່ຂໍເບີກ:
            </span>
            <span className="border-b border-dotted border-gray-600 flex-1 text-center font-bold px-1">
              {totalAmount > 0 ? totalAmount.toLocaleString() : ""}
            </span>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="whitespace-nowrap font-semibold">ສະກຸນເງິນ:</span>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border-b border-dotted border-gray-600 focus:outline-none ml-1 font-bold bg-transparent"
            >
              <option value="ກີບ">ກີບ (LAK)</option>
              <option value="ບາດ">ບາດ (THB)</option>
              <option value="ໂດລາ">ໂດລາ (USD)</option>
            </select>
          </div>
          <div className="col-span-5 flex items-center">
            <span className="whitespace-nowrap font-semibold">ຈ່າຍໄປທີ່:</span>
            <input
              type="text"
              name="payTo"
              value={formData.payTo}
              onChange={handleChange}
              className="border-b border-dotted border-gray-600 focus:outline-none flex-1 ml-1 px-1 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Requisition Type & References */}
      <div className="grid grid-cols-10 gap-2 mb-2 text-[12px] items-start">
        {/* Left: Checkboxes */}
        <div className="col-span-6 space-y-0.5 flex gap-5">
          <div className="flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <input
                type="radio"
                id="type_general"
                name="expenseType"
                value="general"
                checked={formData.expenseType === "general"}
                onChange={handleChange}
                className="cursor-pointer"
              />
              <label htmlFor="type_general" className="cursor-pointer">
                ຂໍເບີກຄ່າໃຊ້ຈ່າຍທົ່ວໄປ
              </label>
            </div>
            <label htmlFor="type_general" className="cursor-pointer">
              (ຕາມໃບຮັບເງີນແນບມາພ້ອມ)
            </label>
          </div>
          <div className="flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <input
                type="radio"
                id="type_purchase"
                name="expenseType"
                value="purchase"
                checked={formData.expenseType === "purchase"}
                onChange={handleChange}
                className="cursor-pointer"
              />
              <label htmlFor="type_general" className="cursor-pointer">
                ຂໍເບີກຄ່າໃຊ້ຈ່າຍ ສັ່ງຊື້
              </label>
            </div>
            <label htmlFor="type_general" className="cursor-pointer">
              (ຕາມໃບແຈ້ງລາຄາແນບມາພ້ອມ)
            </label>
          </div>
        </div>

        {/* Right: Reference Numbers */}
        <div className="col-span-4 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold">PO No:</span>
            <input
              type="text"
              name="poNo"
              value={formData.poNo}
              onChange={handleChange}
              className="border-b border-dotted border-gray-600 w-3/4 focus:outline-none px-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Invoice No:</span>
            <input
              type="text"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleChange}
              className="border-b border-dotted border-gray-600 w-3/4 focus:outline-none px-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Receipt No:</span>
            <input
              type="text"
              name="receiptNo"
              value={formData.receiptNo}
              onChange={handleChange}
              className="border-b border-dotted border-gray-600 w-3/4 focus:outline-none px-1"
            />
          </div>
        </div>
      </div>

      {/* Payment Method & Bank Details */}
      <div className="grid grid-cols-10 gap-2 mb-2 text-[12px] items-start -mt-6">
        {/* Left Column */}
        <div className="col-span-6 space-y-0.5">
          <div className="flex items-center gap-3">
            <span className="font-semibold">ສັ່ງຈ່າຍຜ່ານ</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cheque"
                checked={formData.paymentMethod === "cheque"}
                onChange={handleChange}
              />
              ແຊັກທະນາຄານ
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="transfer"
                checked={formData.paymentMethod === "transfer"}
                onChange={handleChange}
              />
              ເງິນໂອນທະນາຄານ
            </label>
          </div>

          <div className="pl-2 space-y-0.5">
            <div className="flex items-center">
              <span className="w-20 text-gray-900">- ຊື່ທະນາຄານ:</span>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="border-b border-dotted border-gray-600 flex-1 focus:outline-none px-1 font-medium"
              />
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-900">- ຊື່ບັນຊີ:</span>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                className="border-b border-dotted border-gray-600 flex-1 focus:outline-none px-1 font-medium"
              />
            </div>
            <div className="flex items-center">
              <span className="w-20 text-gray-900">- ເລກທີ່ບັນຊີ:</span>
              <input
                type="text"
                name="accountNo"
                value={formData.accountNo}
                onChange={handleChange}
                className="border-b border-dotted border-gray-600 flex-1 focus:outline-none px-1 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 flex items-end h-full pb-0.5">
          <div className="flex items-center w-full">
            <span className="font-semibold whitespace-nowrap">
              ວັນທີ່ກຳນົດຈ່າຍ:
            </span>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="border-b border-dotted border-gray-600 focus:outline-none flex-1 ml-1 px-1"
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-1">
        <h3 className="font-semibold mb-1 text-[12px]">
          ຈຸດປະສົງຂໍເບີກເງິນ ຄ່າໃຊ້ຈ່າຍ:
        </h3>
        <table className="w-full border-collapse border border-gray-400 text-left text-[12px]">
          <thead className="bg-gray-100 text-center font-bold print:bg-transparent">
            <tr>
              <th className="border border-gray-400 p-1 w-8">ລ/ດ</th>
              <th className="border border-gray-400 p-1">ລາຍການ</th>
              <th className="border border-gray-400 p-1 w-14">ຈຳນວນ</th>
              <th className="border border-gray-400 p-1 w-24">
                ລາຄາຕໍ່ຫົວຫນ່ວຍ
              </th>
              <th colSpan={2} className="border border-gray-400 p-1 w-32">
                ຈຳນວນເງີນ
              </th>
              <th className="border border-gray-400 p-1 w-24">ຫມາຍເຫດ</th>
              <th className="border border-gray-400 p-1 w-6 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id}>
                <td className="border border-gray-400 p-1 text-center">
                  <input
                    type="text"
                    value={item.numbers}
                    onChange={(e) =>
                      handleItemChange(idx, "numbers", e.target.value)
                    }
                    className="w-full focus:outline-none text-center bg-transparent"
                  />
                </td>
                <td className="border border-gray-400 p-1 align-top">
                  <textarea
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(idx, "name", e.target.value)
                    }
                    rows={1}
                    className="w-full focus:outline-none px-1 bg-transparent resize-none overflow-hidden block break-words whitespace-pre-wrap"
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                </td>
                <td className="border border-gray-400 p-1 align-top">
                  <input
                    type="text"
                    value={
                      item.qty ? Number(item.qty).toLocaleString("en-US") : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      if (!isNaN(Number(rawValue))) {
                        handleItemChange(idx, "qty", rawValue);
                      }
                    }}
                    className="w-full text-center focus:outline-none bg-transparent"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-400 p-1 align-top">
                  <input
                    type="text"
                    value={
                      item.unitPrice
                        ? Number(item.unitPrice).toLocaleString("en-US")
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      if (!isNaN(Number(rawValue))) {
                        handleItemChange(idx, "unitPrice", rawValue);
                      }
                    }}
                    className="w-full text-right focus:outline-none px-1 bg-transparent"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-400 p-1 text-right font-semibold align-top">
                  {item.amount > 0 ? item.amount.toLocaleString() : ""}
                </td>
                <td className="border border-gray-400 p-1 text-center text-[12px] w-10 text-gray-900 align-top">
                  {item.amount > 0 ? formData.currency : ""}
                </td>
                <td className="border border-gray-400 p-1 align-top">
                  <input
                    type="text"
                    value={item.remark}
                    onChange={(e) =>
                      handleItemChange(idx, "remark", e.target.value)
                    }
                    className="w-full focus:outline-none px-1 bg-transparent"
                  />
                </td>
                <td className="border border-gray-400 p-1 text-center print:hidden">
                  <button
                    onClick={() => removeRow(idx)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold bg-gray-50 print:bg-transparent">
              <td colSpan={1} className="border border-gray-400 p-1 text-right">
                ລວມ
              </td>

              <td
                colSpan={3}
                className="border border-gray-400 p-1 text-[12px] bg-[repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6_2px,#e5e7eb_2px,#e5e7eb_4px)]"
              >
                <div className="flex items-center">
                  <p className="text-gray-500 whitespace-nowrap">
                    ຂຽນເປັນຕົວໜັງສື:
                  </p>
                  <input
                    type="text"
                    name="amountInWords"
                    value={formData.amountInWords}
                    onChange={handleChange}
                    className="border-b font-bold border-dotted border-gray-600 focus:outline-none flex-1 ml-2 bg-transparent"
                  />
                </div>
              </td>
              <td className="border border-gray-400 p-1 text-right text-xs font-bold">
                {totalAmount > 0 ? totalAmount.toLocaleString() : "0"}
              </td>
              <td className="border border-gray-400 p-1 text-center text-[12px] font-bold">
                {formData.currency}
              </td>
              <td
                colSpan={2}
                className="border border-gray-400 print:hidden"
              ></td>
            </tr>
          </tfoot>
        </table>

        <button
          onClick={addRow}
          className="mt-1 text-[12px] text-blue-600 hover:underline font-semibold print:hidden"
        >
          + ພີ່ມລາຍການ / Add Row
        </button>
      </div>

      {/* Budget Summary Table */}
      <div className="mb-1">
        <h4 className="font-semibold mb-0.5 text-[12px]">
          ຕາຕະລາງ ງົບປະມານ (Budget Summary):
        </h4>
        <table className="w-full border-collapse border border-gray-400 text-[12px] text-center">
          <thead className="bg-[#d8e4bc]">
            <tr>
              <th className="border border-gray-400 p-0.5">ລະຫັດ</th>
              <th className="border border-gray-400 p-0.5">ງົບປະມານ</th>
              <th className="border border-gray-400 p-0.5">ງົບປະມານທີ່ເບີກ</th>
              <th className="border border-gray-400 p-0.5">
                ງົບປະມານທີ່ຍັງເຫຼືອ
              </th>
              <th className="border border-gray-400 p-0.5">ສະກຸນເງິນ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5">ກີບ/LAK</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5">ບາດ/THB</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5"></td>
              <td className="border border-gray-400 p-0.5">ໂດລາ/USD</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures Section 1 (3 Columns) */}
      <div className="mt-2 mb-1">
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-[#d8e4bc]">
              <th className="border border-black p-1 w-1/3 text-center font-bold">
                ຜູ້ສະເໜີຂໍເບີກຄ່າໃຊ້ຈ່າຍ
              </th>
              <th className="border border-black p-1 w-1/3 text-center font-bold">
                ຫົວໜ້າພະແນກ
              </th>
              <th className="border border-black p-1 w-1/3 text-center font-bold">
                ຝ່າຍງົບປະມານ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 h-30 align-top text-left">
                <span className="text-gray-900">ລາຍເຊັນ:</span>
              </td>
              <td className="border border-black p-2 h-30 align-top text-left">
                <span className="text-gray-900">ລາຍເຊັນ:</span>
              </td>
              <td className="border border-black p-2 h-30 align-top text-left">
                <span className="text-gray-900">ລາຍເຊັນ:</span>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-left">
                ຊື່: ...........................................
              </td>
              <td className="border border-black p-2 text-left">
                ຊື່: ...........................................
              </td>
              <td className="border border-black p-2 text-left">
                ຊື່: ...........................................
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-left">
                ວັນທີ່: ......./......./............
              </td>
              <td className="border border-black p-2 text-left">
                ວັນທີ່: ......./......./............
              </td>
              <td className="border border-black p-2 text-left">
                ວັນທີ່: ......./......./............
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures Section 2 (2 Columns) */}
      <div className="mb-2">
        <table className="w-129 border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-[#d8e4bc]">
              <th className="border border-black p-1 w-1/2 text-center font-bold">
                ພະແນກບັນຊີ-ການເງິນ
              </th>
              <th className="border border-black p-1 w-1/2 text-center font-bold">
                ຜູ້ຈັດການທົ່ວໄປ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 h-30 align-top text-left">
                <span className="text-gray-900">ລາຍເຊັນ:</span>
              </td>
              <td className="border border-black p-2 h-30 align-top text-left">
                <span className="text-gray-900">ລາຍເຊັນ:</span>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-left">
                ຊື່: ...........................................
              </td>
              <td className="border border-black p-2 text-left">
                ຊື່: ...........................................
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-left">
                ວັນທີ່: ......./......./............
              </td>
              <td className="border border-black p-2 text-left">
                ວັນທີ່: ......./......./............
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Address */}
      <div className="mt-8 pt-4 border-t text-start text-[12px] text-gray-600 print:fixed print:bottom-0 print:left-0 print:w-full print:m-0 print:px-4 print:border-t-0 bg-white">
        <p className="font-bold">BIGTREE TRADING CO., LTD</p>
        <p className="font-bold text-[rgb(148,138,84)]">
          SIBOUNHUENG VILLAGE, CHANTHABOULY DISTRICT, VIENTIANE CAPITAL, LAO PDR
          | TEL: 020 55 991 799
        </p>
      </div>
    </div>
  );
};

export default ExcelDoc;
