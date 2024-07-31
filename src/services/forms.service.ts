import { instance } from "../api/axios.api"
import { ICompany, IField } from "../types/types"

export const companyService = {
    async createCompany(companyData: ICompany): Promise<ICompany | undefined> {
        const {data} = await instance.post<ICompany>('api/company', {companyData})
        return data
    }
}

export const fieldService = {
    async createField(fieldData: IField): Promise<IField | undefined> {
        const {data} = await instance.post<IField>('api/field', {fieldData})
        return data
    }
}