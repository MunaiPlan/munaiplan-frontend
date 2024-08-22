import { instance } from "../api/axios.api"
import { ICompany, IDesign, IField, ISite, IWell, IWellBore, ICase } from "../types/types"

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
        const {data} = await instance.post<ISite>('api/site', {siteData})
        return data
    }
}

export const wellService = {
    async createWell(wellData: IWell): Promise<IWell | undefined> {
        const {data} = await instance.post<IWell>('api/well', {wellData})
        return data
    }
}

export const wellBoreService = {
    async createWellBore(wellBoreData: IWellBore): Promise<IWellBore | undefined> {
        const {data} = await instance.post<IWellBore>('api/wellbore', {wellBoreData})
        return data
    }
}

export const DesignService = {
    async createDesign(designData: IDesign): Promise<IDesign | undefined> {
        const {data} = await instance.post<IDesign>('api/design', {designData})
        return data
    }
}

export const CaseService = {
    async createCase(caseData: ICase): Promise<ICase | undefined> {
        const {data} = await instance.post<ICase>('api/case', {caseData})
        return data
    }
}