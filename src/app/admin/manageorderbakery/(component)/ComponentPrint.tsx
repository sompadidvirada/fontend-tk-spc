import React from "react";
import { format } from "date-fns";

interface BranchHeader {
  id: number;
  name: string;
}

interface TableRowData {
  bakeryName: string;
  bakeryId: number;
  total: number;
  [key: string]: string | number | any;
}

interface ComponentPrintProps {
  dataToPrint:
    | {
        date: string;
        branches: BranchHeader[];
        tableData: TableRowData[];
      }
    | null
    | undefined;
}

const ComponentPrint = React.forwardRef<HTMLDivElement, ComponentPrintProps>(
  (props, ref) => {
    const { dataToPrint } = props;
    const CATEGORY_COLORS: Record<string, string> = {
      ຄົວຊ່ອງ: "#53c8ffff",
      ເຄັກ: "#eeb919ff",
      ຄອປໂຟ: "#F2E9FF",
      ເຄື່ອງດື່ມ: "#ff8f2cff",
      'ເບເກີລີ້ ອຶ່ນໆ': "#ffa28c",
      ທິມເບີລິ້ງ: "#ffa7fc"
    };

    if (!dataToPrint) return <div ref={ref}>...</div>;

    return (
      <div
        ref={ref}
        className="p-10 bg-white font-lao"
        style={{ fontFamily: "Noto Sans Lao" }}
      >
        <div className="border-[4px] border-double border-black p-4 mb-4 text-center">
          <h1 className="text-2xl font-black italic">ລາຍງານການສັ່ງຊື້ສິນຄ້າ</h1>
          <p className="font-bold uppercase">
            Report Date: {format(new Date(dataToPrint.date), "dd/MM/yyyy")}
          </p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-yellow-400 border-[2px] border-black">
              <th className="border-2 border-black p-2 text-left">
                ລາຍການສິນຄ້າ
              </th>
              {dataToPrint.branches.map((branch) => (
                <th
                  key={branch.id}
                  className="border-2 border-black p-1 text-[12px] h-24 w-10"
                >
                  <div className="rotate-180 [writing-mode:vertical-lr] mx-auto font-bold">
                    {branch.name}
                  </div>
                </th>
              ))}
              <th className="border-2 border-black p-2 bg-gray-100">ລວມ</th>
            </tr>
          </thead>
          <tbody>
            {dataToPrint.tableData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-black"
                style={{
                  backgroundColor: CATEGORY_COLORS[row.categotyName] || "white",
                }}
              >
                <td className="border-x-2 border-black px-2 py-1 font-medium">
                  {row.bakeryName}
                </td>
                {dataToPrint.branches.map((branch) => (
                  <td
                    key={branch.id}
                    className="border-r-2 border-black p-1 text-center font-bold bg-white/20"
                  >
                    {row[`branch_${branch.id}`] !== 0
                      ? row[`branch_${branch.id}`]
                      : ""}
                  </td>
                ))}
                <td className="border-r-2 border-black p-1 text-center font-black bg-white/40">
                  {row.total}
                </td>
              </tr>
            ))}
            <tr className="bg-yellow-400 border-2 border-black font-black">
              <td className="p-2 text-right border-r-2 border-black">
                TOTAL ALL
              </td>
              {dataToPrint.branches.map((branch) => (
                <td
                  key={branch.id}
                  className="border-r-2 border-black text-center"
                >
                  {dataToPrint.tableData.reduce(
                    (sum, r) => sum + (Number(r[`branch_${branch.id}`]) || 0),
                    0,
                  )}
                </td>
              ))}
              <td className="text-center">
                {dataToPrint.tableData.reduce((sum, r) => sum + r.total, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
);

export default ComponentPrint;
