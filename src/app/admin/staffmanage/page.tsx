import { DataTableCompo } from "./(component)/Table";
import Addstaff from "./(component)/Addstaff";
import { getStaff } from "@/app/api/server/staff";
import AddstaffBaristar from "./(component)/AddstaffBaristar";
import { getAllBranch } from "@/app/api/server/branchs";

const StaffManage = async () => {
  const staffData = await getStaff();
  const branchs = await getAllBranch()
  return (
    <div className="mx-3 min-h-[80vh] pb-3 relative mt-3">
      {/* Header Section */}
      <div className="px-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="font-lao">
            <h2 className="text-xl md:text-2xl font-bold">ຈັດການພະນັກງານ</h2>
            <p className="text-[12px] text-muted-foreground">
              ລວມລວມລາຍງານຂອງການຕິດຕາມແຕ່ລະລາຍການ.
            </p>
          </div>
        </div>
      </div>
      {/* Controls Section: Buttons and Search */}
      <>
        <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4">
          {/* Buttons: Stacked on mobile, row on desktop */}
          <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10">
            <Addstaff />

            <AddstaffBaristar branchs={branchs}/>
          </div>
        </div>
        <div className="px-5 mt-3">
          <div>
            <DataTableCompo data={staffData} branchs={branchs}/>
          </div>
        </div>
      </>

      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
};

export default StaffManage;
