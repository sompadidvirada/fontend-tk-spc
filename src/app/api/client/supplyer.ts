import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createSupplyer = (form: FormData) => {
  return axios.post(`${URL}/supplyer/createsupplyer`, form, {
    withCredentials: true,
  });
};

export const getAllSupplyer = () => {
  return axios.get(`${URL}/supplyer/getallsupplyer`, {
    withCredentials: true,
  });
};

export const updateSupplyer = (form: FormData, id: number | null) => {
  return axios.put(`${URL}/supplyer/updatesupplyer/${id}`, form, {
    withCredentials: true,
  });
};

export const deleteSupplyer = (id: number | null) => {
  return axios.delete(`${URL}/supplyer/deletesupplyer/${id}`, {
    withCredentials: true,
  });
};

// supplyer for spc

export const createSupplyerSpc = (form: FormData) => {
  return axios.post(`${URL}/supplyer/createsupplyerspc`, form, {
    withCredentials: true,
  });
};

export const getAllSupplyerSpc = () => {
  return axios.get(`${URL}/supplyer/getallsupplyerspc`, {
    withCredentials: true,
  });
};

export const updateSupplyerSpc = (form: FormData, id: number) => {
  return axios.put(`${URL}/supplyer/updatesupplyerspc/${id}`, form, {
    withCredentials: true
  })
}
