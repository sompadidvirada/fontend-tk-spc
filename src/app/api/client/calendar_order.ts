import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createCalendarOrderSpc = (form: any) => {
  return axios.post(`${URL}/calendarorder/createcalendarorder`, form, {
    withCredentials: true,
  });
};

export const getAllCalendarOrderSpc = (params: {
  start: string;
  end: string;
  role: string
  id: string
}) => {
  return axios.get(`${URL}/calendarorder/getallcalendarorderspc`, {
    params: params,
    withCredentials: true,
  });
};

export const updateCalendarOrderDate = async (
  id: string,
  plan_date: string,
) => {
  const response = await axios.patch(
    `${URL}/calendarorder/updatecalendarorderspc/${id}`,
    {
      plan_date,
    },
    {
      withCredentials: true,
    },
  );
  return response;
};

export const deleteCalendarOrderSpc = async (id: string) => {
  return axios.delete(`${URL}/calendarorder/deleteorderspc/${id}`, {
    withCredentials: true,
  });
};

export const updateStatusCalendarOrderSpc = async (
  id: string,
  type: { statusType: string; statusValue: string },
) => {
  return axios.patch(
    `${URL}/calendarorder/updatestatuscalendarorderspc/${id}`,
    type,
    {
      withCredentials: true,
    },
  );
};

export const updatePaymentDate = async (id: string, form: {payment_date: string}) => {
  return axios.patch(`${URL}/calendarorder/updatepaymentdate/${id}`, form, {
    withCredentials: true
  })
}

export const updateDeliveryDate = async (id:string, form: {delivery_date: string}) => {
  return axios.patch(`${URL}/calendarorder/updatedeliverydate/${id}`, form, {
    withCredentials: true
  })
}