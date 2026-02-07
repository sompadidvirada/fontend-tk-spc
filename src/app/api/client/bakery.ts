import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface BranchUpdate {
  branchId: number;
  // We don't need 'status' here if we only send the ones that ARE active
}

export interface UpdateAvailabilityForm {
  bakeryId: number;
  activeBranchIds: number[]; // Send only the IDs where the switch is ON
}

//product manage api

export const createBakery = (form: FormData) => {
  return axios.post(`${URL}/managebakery/createbakery`, form, {
    withCredentials: true,
  });
};

export const editBakery = (form: FormData, id: number) => {
  return axios.put(`${URL}/managebakery/updatebakery/${id}`, form, {
    withCredentials: true,
  });
};

export const deleteBakery = (id: number) => {
  return axios.delete(`${URL}/managebakery/deletebakery/${id}`, {
    withCredentials: true,
  });
};

export const changeStatusBakery = (status: string, id: string) => {
  return axios.put(`${URL}/managebakery/updatestatus/${id}`, {status: status}, {
    withCredentials: true
  })
} 

export const updateAvailableBakery = (form: UpdateAvailabilityForm) => {
  return axios.post(`${URL}/managebakery/updatestatussellbranchs`, form, {
    withCredentials: true
  });
};

export const checkAvailaBleBake = (id: number) => {
  return axios.get(`${URL}/managebakery/checkavailablebakeryonbranchs/${id}`,{
    withCredentials: true
  } )
}

// category bakery manage api

export const createCategoryBakery = (name: { name: string }) => {
  return axios.post(`${URL}/managebakery/createcategorybakery`, name, {
    withCredentials: true,
  });
};

export const deleteCategoryBakery = (id: number) => {
  return axios.delete(`${URL}/managebakery/deletecategory/${id}`, {
    withCredentials: true,
  });
};
