import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const updateStaffRole = async (form: { role: string }, id: number) => {
  return axios.put(`${URL}/managestaff/updaterolestaff/${id}`, form, {
    withCredentials: true,
  });
};

export const updateAvailableStaff = async (
  form: { available: Boolean },
  id: number
) => {
  return axios.put(`${URL}/managestaff/updateavailablestaff/${id}`, form, {
    withCredentials: true,
  });
};

export const checkPasswordStaff = async (id: { id: number }) => {
  return axios.post(`${URL}/managestaff/checkpasswordstaff/`, id, {
    withCredentials: true,
  });
};

export const deleteStaff = async (id: { id: number }) => {
  return axios.post(`${URL}/managestaff/deletestaff`, id, {
    withCredentials: true,
  });
};

export const createStaffBaristar = async (form: FormData) => {
  return axios.post(`${URL}/managestaff/createstaffbaristar`, form, {
    withCredentials: true,
  });
};

export const createStaff = async (form: FormData) => {
  return axios.post(`${URL}/managestaff/createstaff`, form, {
    withCredentials: true,
  });
};


export const updateStaffProfile =  (form: FormData, id: number) => {
  return axios.put(`${URL}/managestaff/updateprofilestaff/${id}`, form, {
    withCredentials: true
  })
}