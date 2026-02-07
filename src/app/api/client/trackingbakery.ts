import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Track_Bakery_Sell = {
  bakeryId: string;
  sold_at: string | undefined;
  branchId: string;
  quantity: string;
  price: string;
  sell_price: string;
};

export type Track_Bakery_Send = {
  bakeryId: string;
  send_at: string | undefined;
  branchId: string;
  quantity: string;
  price: string;
  sell_price: string;
};

export type Track_Bakery_Exp = {
  bakeryId: string;
  exp_at: string | undefined;
  branchId: string;
  quantity: string;
  price: string;
  sell_price: string;
};

export interface TrackSellItem {
  bakery_detailId: number;
  quantity: number;
}

// This is the shape of the data sent to the backend
export interface UploadTrackSellForm {
  branchId: number;
  date: string; // ISO string format
  items: TrackSellItem[];
}

export const sendTrackBakerySell = (form: Track_Bakery_Sell) => {
  return axios.post(`${URL}/managetracking/trackbakerysell`, form, {
    withCredentials: true,
  });
};

export const getBakerysAvailable = (form: { branchId: number }) => {
  return axios.post(`${URL}/managetracking/getavailablebakerys`, form, {
    withCredentials: true,
  });
};

export const getBakerySold = (form: {
  branchId: number;
  date: string | undefined;
}) => {
  return axios.post(`${URL}/managetracking/getbakerysold`, form, {
    withCredentials: true,
  });
};

export const editTrackSell = (
  form: { quantity: number },
  id: number | string,
) => {
  return axios.put(`${URL}/managetracking/edittracksell/${id}`, form, {
    withCredentials: true,
  });
};

export const deleteTrackingSell = (id: number) => {
  return axios.delete(`${URL}/managetracking/deletetracksell/${id}`, {
    withCredentials: true,
  });
};

export const deleteAllTrackingSell = (form: {
  date: string | undefined;
  branchId: number;
}) => {
  return axios.post(`${URL}/managetracking/deletealltracksell`, form, {
    withCredentials: true,
  });
};

export const uploadFileTrackingSell = (form: UploadTrackSellForm) => {
  return axios.post(`${URL}/managetracking/uploadfiletracksell`, form, {
    withCredentials: true,
  });
};

//TRACKING SEND BAKERY REQUEST API FUNCTOIN.

export const getBakerySend = (form: {
  branchId: number;
  date: string | undefined;
}) => {
  return axios.post(`${URL}/managetracking/getbakerysend`, form, {
    withCredentials: true,
  });
};

export const insertTrackSend = (form: Track_Bakery_Send) => {
  return axios.post(`${URL}/managetracking/trackingsend`, form, {
    withCredentials: true,
  });
};

export const updateTrackSend = (form: { quantity: number }, id: number) => {
  return axios.put(`${URL}/managetracking/updatetracksend/${id}`, form, {
    withCredentials: true,
  });
};

export const deletetracksend = (id: number) => {
  return axios.delete(`${URL}/managetracking/deletetracksend/${id}`, {
    withCredentials: true,
  });
};

export const deleteAllTrackSend = (form: {
  branchId: number;
  date: string | undefined;
}) => {
  return axios.post(`${URL}/managetracking/deletealltracksend`, form, {
    withCredentials: true,
  });
};

export const uploadTrackingSend = (form: UploadTrackSellForm) => {
  return axios.post(`${URL}/managetracking/uploadtrackingsend`, form, {
    withCredentials: true,
  });
};

//TRACKING EXP API FUNCTION

export const insertTrackingExp = (form: Track_Bakery_Exp) => {
  return axios.post(`${URL}/managetracking/trackexp`, form, {
    withCredentials: true,
  });
};

export const getTrackingExp = (form: {
  branchId: number;
  date: string | undefined;
}) => {
  return axios.post(`${URL}/managetracking/gettrackingexp`, form, {
    withCredentials: true,
  });
};

export const deleteTrackExp = (id: number) => {
  return axios.delete(`${URL}/managetracking/deletetrackexp/${id}`, {
    withCredentials: true,
  });
};

export const deletAllTrackExp = (form: {
  branchId: number;
  date: string | undefined;
}) => {
  return axios.post(`${URL}/managetracking/deletalltrackexp`, form, {
    withCredentials: true,
  });
};

export const getReportBakery = (form: {
  startDate: string | undefined;
  endDate: string | undefined;
  branchId: number | string;
}) => {
  return axios.post(`${URL}/managereportbakery/reportbakery`, form, {
    withCredentials: true,
  });
};
