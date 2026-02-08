import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const updateOrderWant = (form: { order_want: number }, id: number) => {
  return axios.put(`${URL}/orderbakery/updateorderwant/${id}`, form, {
    withCredentials: true,
  });
};

export const checkConfirmStatus = (form: {
  confirm_date: string | undefined;
  branchId: number;
}) => {
  return axios.post(`${URL}/orderbakery/checkconfirmorder`, form, {
    withCredentials: true,
  });
};
export const updateConfirmOrder = (form: {
  branchId: number;
  confirm_date: string;
  barista_confirm_stt: boolean;
}) => {
  return axios.put(`${URL}/orderbakery/updatecomfirmorder`, form, {
    withCredentials: true,
  });
};

export const getSendAndExp = (form: { branchId: number; date: string }) => {
  return axios.post(`${URL}/orderbakery/getsendandexp`, form, {
    withCredentials: true,
  });
};

export const createReportBaristar = (form: FormData) => {
  return axios.post(`${URL}/baristar/reportbaristar`, form, {
    withCredentials: true,
  });
};

export const getReportHistory = (form: {
  branchId: string;
  page: any;
  limit: number;
}) => {
  return axios.post(`${URL}/baristar/getreporthistory`, form, {
    withCredentials: true,
  });
};


export const updatePasswordBaristar = (form: {old_password: string, new_password: string}, id: number) => {
  return axios.patch(`${URL}/baristar/updatepasswordbaristar/${id}`, form, {
    withCredentials: true
  })
}

