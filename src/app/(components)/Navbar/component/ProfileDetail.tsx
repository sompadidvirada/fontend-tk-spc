import { Settings } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ProfileDetail = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRefProfile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRefProfile.current &&
        !dropdownRefProfile.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRefProfile}>
      <button
        onClick={() => setOpenProfile(!openProfile)}
        className="flex items-center gap-3 hover:bg-blue-100 cursor-pointer px-2 py-1 rounded-2xl"
      >
        <Image
          src="/518324812_1041827988067448_2425716812174515325_n.jpg"
          alt="Profile"
          width={34}
          height={34}
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
        />
        <span className="font-semibold hidden md:block">sompadid virada</span>
      </button>

      {openProfile && (
        <div className="absolute right-0 mt-2 w-45 bg-white border rounded-lg shadow-md overflow-hidden z-50 py-1 px-1">
          <button
            onClick={() => {}}
            className={`w-full flex gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 font-lao items-center cursor-pointer`}
          >
            <Image
              src="/518324812_1041827988067448_2425716812174515325_n.jpg"
              alt="Profile"
              width={27}
              height={27}
              className="rounded-full h-full object-cover"
            />{" "}
            <span className="text-sm">ແກ້ໄຂ້ຂໍ້ມູນຜູ້ໃຊ້</span>
          </button>
          <hr className="border-solid border-l border-gray-300 mx-3  my-1 " />
          <button
            onClick={() => {}}
            className={`w-full flex gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 font-lao items-center cursor-pointer`}
          >
            <div className="w-7 h-7 bg-gray-300 flex items-center justify-center rounded-full p-1">
              <Settings />
            </div>{" "}
            <span className="text-sm">ຕັ້ງຄ່າລະບົບ</span>
          </button>
          <button
            onClick={() => {}}
            className={`w-full flex gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 font-lao items-center cursor-pointer`}
          >
            <div className="w-7 h-7 bg-gray-300 flex items-center justify-center rounded-full p-1">
              <Settings />
            </div>{" "}
            <span className="text-sm">ອອກຈາກລະບົບ</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
