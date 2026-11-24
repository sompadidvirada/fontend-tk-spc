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

export const getReport3monthBakery = (form: {date: string}) => {
    return axios.post(`${URL}/managereportbakery/report3month`, form, {
        withCredentials:true
    })
}

export const getReportBakeryNew = (form:{start: string, end: string, supplyerId: number}) => {
    return axios.post(`${URL}/managereportbakery/reportbakerynew`, form, {
        withCredentials: true
    })
}

export const getSaleDataBarChart = (form:{start: string, end: string, supid: string}) => {
    return axios.post(`${URL}/dashboard/getsaledatabarchart`, form, {
        withCredentials: true
    })
}

export const getBestBakeryAPI = (form:{start: string, end: string}) => {
    return axios.post(`${URL}/dashboard/getbestbakery`, form, {
        withCredentials: true
    })
}

export const getDetailBestBakeryAPI = (form:{start: string, end: string, bakery_id: number}) => {
    return axios.post(`${URL}/dashboard/detailbestbakery`, form, {
        withCredentials: true
    })
}

export const getBestBranchSellAPI = (form: {start: string, end: string}) => {
    return axios.post(`${URL}/dashboard/getbestbranchsell`, form, {
        withCredentials: true
    })
}

export const getBestBakeryInBranchAPI = (form:{start: string, end: string, branch_id: number}) => {
    return axios.post(`${URL}/dashboard/getbestbakeryinbranch`, form, {
        withCredentials: true
    })
}

export const getBestBranchPerformAPI = (form:{start: string, end: string}) => {
    return axios.post(`${URL}/dashboard/getbestbranchperformance`, form, {
        withCredentials: true
    })
}

export const getBranchLowPerformAPI = (form: {start: string, end: string}) => {
    return axios.post(`${URL}/dashboard/getbranchlowperform`, form, {
        withCredentials: true
    })
}