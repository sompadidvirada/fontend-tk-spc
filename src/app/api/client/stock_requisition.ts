import { Form_Insert } from "@/app/admin/materialrequisition/(component)/TableMaterial";
import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface UploadStock_Requisition {
  material_variantId: number;
  quantity: number;
  base_quantity: number;
  price_kip: number | null;
  sell_price_kip: number | null;
  price_bath: number | null;
  sell_price_bath: number | null;
  date: string;
  branchId: number;
  variant_name: string;
  material_name: string;
}

export const insertStockRequisition = (form: Form_Insert) => {
  return axios.post(`${URL}/materialrequisition/createstockrequisition`, form, {
    withCredentials: true,
  });
};

export const getAllStockRequisition = (form: {
  date: string;
  branchId: number;
}) => {
  return axios.post(`${URL}/materialrequisition/getallstockrequisition`, form, {
    withCredentials: true,
  });
};

export const updateStock = (
  form: { quantity: number; base_quantity: number },
  id: number,
) => {
  return axios.put(
    `${URL}/materialrequisition/updatestockrequisition/${id}`,
    form,
    {
      withCredentials: true,
    },
  );
};

export const deleteStockRequisition = (id: number) => {
  return axios.delete(
    `${URL}/materialrequisition/deletestockrequisition/${id}`,
    {
      withCredentials: true,
    },
  );
};

export const uploadFileStock = (form: {
  requisitions: UploadStock_Requisition[];
  branchId: number;
}) => {
  return axios.post(`${URL}/materialrequisition/uploadstockrequisition`, form, {
    withCredentials: true,
  });
};

export const insertStockRemian = (form: any) => {
  return axios.post(`${URL}/materialrequisition/insertstockremain`, form, {
    withCredentials: true,
  });
};

export const getAllStockReamin = () => {
  return axios.get(`${URL}/materialrequisition/getallstockremain`, {
    withCredentials: true,
  });
};

export const getReportRequisition = (form: {
  startDate: string;
  endDate: string;
  branchId: number | string;
}) => {
  return axios.post(
    `${URL}/materialrequisition/getreportstockrequisition`,
    form,
    {
      withCredentials: true,
    },
  );
};

export const deleteAllStockRemain = () => {
  return axios.delete(`${URL}/materialrequisition/deleteallstockremain`, {
    withCredentials: true,
  });
};

export const updateStockRemain = (
  form: {
    count: number;
    base_count_variant: number;
    material_variantId: number;
  },
  id: number,
) => {
  return axios.put(`${URL}/materialrequisition/updatestockremain/${id}`, form, {
    withCredentials: true,
  });
};

export const deleteAllStockRequisition = (form: {
  date: string;
  branchId: number;
}) => {
  return axios.post(
    `${URL}/materialrequisition/delteallstockrequisition`,
    form,
    {
      withCredentials: true,
    },
  );
};
