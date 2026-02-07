import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getBakerySellReport = (form: {startDate: string | undefined, endDate: string | undefined}) => {
    return axios.post(`${URL}/dashboard/getreportselllinechart`, form, {
        withCredentials: true
    })
}

export const getBakerysReportLine = (form: {startDate: string | undefined, endDate: string | undefined}) => {
    return axios.post(`${URL}/dashboard/getbakerynameline`, form, {
        withCredentials: true
    })
}

export const getCardBakeryReport = (form: {startDate: string | undefined, endDate: string | undefined}) => {
    return axios.post(`${URL}/dashboard/getreportcardbakery`, form, {
        withCredentials: true
    })
}