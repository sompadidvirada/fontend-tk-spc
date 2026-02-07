import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fecthAllReportBakeryBaristar = (form: {
  page: number;
  limit: number;
}) => {
  return axios.post(`${URL}/trackreportbaristar/getalltracbakeryreport`, form, {
    withCredentials: true,
  });
};

export const checkNotification = (form: { staffId: number }) => {
  return axios.post(
    `${URL}/trackreportbaristar/checknotification`,
    form,
    {
      withCredentials: true,
    },
  );
};


export const markAsRead = (form: { staffId: number; reportId: number }) => {
  return axios.post(`${URL}/trackreportbaristar/markasread`, form, {
    withCredentials: true,
  });
};

export const getDetailReport = (id: number) => {
    return axios.get(`${URL}/trackreportbaristar/getreportdetail/${id}`, {
        withCredentials: true
    })
}

export const updateStatusReport = (form: {status: boolean}, id: number) => {
  return axios.put(`${URL}/trackreportbaristar/updatestatusreport/${id}`, form, {
    withCredentials: true
  })
}