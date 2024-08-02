import { instance } from "../api/axios.api"
import { ICompany, IField, ISite, IWell } from "../types/types"

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

export const siteService = {
    async createSite(siteData: ISite): Promise<ISite | undefined> {
        const {data} = await instance.post<ISite>('api/field', {siteData})
        return data
    }
}

export const wellService = {
    async createWell(wellData: IWell): Promise<IWell | undefined> {
        const {data} = await instance.post<IWell>('api/well', {wellData})
        return data
    }
}