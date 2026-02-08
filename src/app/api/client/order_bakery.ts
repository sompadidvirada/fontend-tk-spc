import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface BakeryOrderInput {
  bakery_detailId: number;
  order_at: string | undefined; // ISO string or YYYY-MM-DD
  branchId: number;
  order_set: number;
}

// The form structure expected by your axios function
export interface InsertManyBakeryOrderForm {
  orders: BakeryOrderInput[];
}

export const getDataOrderBakery = (form: {
  branchId: number;
  order_at: string | undefined;
  supplyerId?: number
}) => {
  return axios.post(`${URL}/orderbakery/getdatatoorder`, form, {
    withCredentials: true,
  });
};

export const getOrderBakery = (form: {
  branchId: number;
  order_at: string | undefined;
}) => {
  return axios.post(`${URL}/orderbakery/getallorderbakery`, form, {
    withCredentials: true,
  });
};

export const insertOrderBakery = (form: {
  order_set: string;
  order_at: string | undefined;
  bakery_detailId: string;
  branchId: string;
}) => {
  return axios.post(`${URL}/orderbakery/insertorderbakery`, form, {
    withCredentials: true,
  });
};

export const updateOrderBakery = (form: { order_set: number }, id: number) => {
  return axios.put(`${URL}/orderbakery/updateorderbakery/${id}`, form, {
    withCredentials: true,
  });
};

export const deleteORderBakery = (id: number) => {
  return axios.delete(`${URL}/orderbakery/deleteorderbakery/${id}`, {
    withCredentials: true,
  });
};

export const insertManyOrderBakery = (form: InsertManyBakeryOrderForm) => {
  return axios.post(`${URL}/orderbakery/insertmanyorderbakery`, form, {
    withCredentials: true,
  });
};

export const updateConfirmSttAdmin = (form: {admin_confirm_stt: boolean}, id: number) => {
  return axios.put(`${URL}/orderbakery/updateconfirmstatusadmin/${id}`, form, {
    withCredentials: true
  })
}

export const getTrackingOrderBakery = (form: {track_date: string | undefined}) => {
  return axios.post(`${URL}/orderbakery/trackorderbakery`, form, {
    withCredentials: true
  })
}

export const getOrderBakeryPrint = (form: {order_at: string | undefined, supplyerId: string}) => {
  return axios.post(`${URL}/orderbakery/getordertoprint`, form, {
    withCredentials: true
  })
}
