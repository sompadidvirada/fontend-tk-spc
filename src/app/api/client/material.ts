import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createCategoryMaterial = (form: { name: string }) => {
  return axios.post(`${URL}/material/createcategorymaterial`, form, {
    withCredentials: true,
  });
};

export const createMaterail = (form: FormData) => {
  return axios.post(`${URL}/material/creatematerial`, form, {
    withCredentials: true,
  });
};

export const createMaterialVariant = (form: { materialId: number }) => {
  return axios.post(`${URL}/material/createnewmaterialvariant`, form, {
    withCredentials: true,
  });
};

export const updateRelationVariant = (variantsArray: any[]) => {
  const payload = {
    variants: variantsArray,
  };

  return axios.post(`${URL}/material/updaterelationmaterialvariant`, payload, {
    withCredentials: true,
  });
};

export const deleteMaterialVariant = (id:number) => {
    return axios.delete(`${URL}/material/deletematerialvarinat/${id}`, {
        withCredentials: true
    })
}

export const updateMaterial = (form: FormData, id:number) => {
    return axios.put(`${URL}/material/updatematerial/${id}`, form, {
        withCredentials: true
    })
}