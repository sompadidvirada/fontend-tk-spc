import { useUIStore } from "@/store/ui";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import ReactCountryFlag from "react-country-flag";

const LanguageSwicth = () => {
  const [openLang, setOpenLang] = useState(false);
  const dropdownRefLang = useRef<HTMLDivElement>(null);
  const {  language, setLanguage } = useUIStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRefLang.current &&
        !dropdownRefLang.current.contains(event.target as Node)
      ) {
        setOpenLang(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRefLang} className="relative">
      <button
        onClick={() => setOpenLang(!openLang)}
        className="flex cursor-pointer items-center gap-2 px-3 py-2 font-lao rounded-lg border border-gray-300 hover:bg-gray-100 text-xs md:text-sm font-medium"
      >
        <ReactCountryFlag
          countryCode={language === "LA" ? "LA" : "GB"}
          svg
          className="w-3 h-3 md:w-6 md:h-6"
        />
        {language === "LA" ? "ລາວ" : "ENG"}
      </button>

      {openLang && (
        <div className="absolute right-0 mt-2 w-25 md:w-35 bg-white border rounded-lg shadow-md overflow-hidden z-50">
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                setLanguage("LA");
                router.refresh();
                setOpenLang(!openLang);
              })
            }
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
              language === "LA" ? "bg-gray-100 font-semibold" : ""
            } font-lao flex items-center gap-2 cursor-pointer text-xs md:text-sm `}
          >
            <ReactCountryFlag
              countryCode={"LA"}
              svg
              className="w-3 h-3 md:w-6 md:h-6"
            />
            ລາວ
          </button>

          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                setLanguage("ENG");
                router.refresh();
                setOpenLang(!openLang);
              })
            }
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 font-lao ${
              language === "ENG" ? "bg-gray-100 font-semibold" : ""
            }  flex items-center gap-2 cursor-pointer text-xs md:text-sm `}
          >
            <ReactCountryFlag
              countryCode={"GB"}
              svg
              className="w-3 h-3 md:w-6 md:h-6"
            />
            English
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwicth;
