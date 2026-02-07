import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const createBranchs = (form: {name:string, province: string, lat: number | undefined, lng: number | undefined}) => {
    return axios.post(`${URL}/branchs/createbranch`, form, {
        withCredentials: true
    })
}

export const addPhoneBranch = (form: {phone: string}, id: number) => {
    return axios.put(`${URL}/branchs/updatephonebranch/${id}`, form, {
        withCredentials: true
    })
}

export const updateDetailBranch = (form: {name: string, province: string, location: any}, id: number) => {
    return axios.put(`${URL}/branchs/updatebranchdetail/${id}`, form, {
        withCredentials: true
    })
}