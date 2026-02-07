// lib/api/staff.ts
import axios from "axios";
import { headers } from "next/headers";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getStaff() {
  const headerList = await headers();
  const cookie = headerList.get("cookie");

  try {
    const response = await axios.get(`${URL}/managestaff/getallstaff`, {
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