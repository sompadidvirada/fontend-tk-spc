import { getAllBranch } from '@/app/api/server/branchs';
import { Van } from 'lucide-react'
import React from 'react'
import ParentTable from './(component)/ParentTable';

const Tracksend = async () => {
     const branchs = await getAllBranch();
  return (
    <div className="mx-3 min-h-[80vh] pb-3 relative mt-3">
      {/* Header Section */}
      <div className="px-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="font-lao">
            <div className="font-lao flex gap-2 items-center">
              <h2 className="text-xl md:text-2xl font-bold">
                ຄີຍອດຈັດສົ່ງເບເກີລີ້
              </h2>
              <Van width={24} height={24} />
            </div>
            <p className="text-[12px] text-muted-foreground">
              ຄີຍອດຈັດສົ່ງເບເກີລີ້ຂອງແຕ່ລະສາຂາ ເລືອກຕາມວັນທີ ແລະສາຂາໃນລະບົບ.
            </p>
          </div>
        </div>
      </div>
      {/* Controls Section: Buttons and Search */}
      <ParentTable branchs={branchs} />

      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  )
}

export default Tracksend