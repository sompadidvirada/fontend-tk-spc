import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const insertImageTrack = (form: FormData) =>{
    return axios.post(`${URL}/imagetrack/uploadtrackimage`, form, {
        withCredentials: true
    })
}

export const getImageTracking = (form: {track_date: string, branchId: string | number}) => {
    return axios.post(`${URL}/imagetrack/gettrackingimages`, form, {
        withCredentials: true
    })
}

export const getAllBranchImage = (form: {track_date: string}) => {
    return axios.post(`${URL}/imagetrack/getallbranchimagetrack`, form, {
        withCredentials: true
    })
}