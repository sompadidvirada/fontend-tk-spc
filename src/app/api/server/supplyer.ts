// lib/api/staff.ts
import axios from "axios";
import { headers } from "next/headers";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getSupplyer() {
  const headerList = await headers();
  const cookie = headerList.get("cookie");

  try {
    const response = await axios.get(`${URL}/supplyer/getallsupplyer`, {
      headers: {
        Cookie: cookie || "",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Fetch error in staff service:", error);
    return [];
  }
}

export const getSupplyerSpc = async ()=> {
  const headerList = await headers();
  const cookie = headerList.get("cookie");

  try {
    const response = await axios.get(`${URL}/supplyer/getallsupplyerspc`, {
      headers: {
        Cookie: cookie || "",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Fetch error in staff service:", error);
    return [];
  }
}