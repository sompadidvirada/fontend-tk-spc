import axios from "axios";
import { headers } from "next/headers";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllCategoryMaterail = async () => {
  const headerList = await headers();
  const cookie = headerList.get("cookie");
  try {
    const response = await axios.get(`${URL}/material/getallcategorymaterial`, {
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

export const getAllMaterial = async () => {
  const headerList = await headers();
  const cookie = headerList.get("cookie");
  try {
    const response = await axios.get(`${URL}/material/getallmaterial`, {
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