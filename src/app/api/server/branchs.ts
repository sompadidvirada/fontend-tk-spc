import axios from "axios";
import { headers } from "next/headers";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllBranch = async () => {
  const headerList = await headers();
  const cookie = headerList.get("cookie");
  try {
    const response = await axios.get(`${URL}/branchs/getallbranch`, {
      headers: {
        Cookie: cookie || "",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};