import { instance } from "../api/axios.api"
import { ICompany } from "../types/types"
export const companyService = {

    async createCompany(companyData: ICompany): Promise<ICompany | undefined> {
        const {data} = await instance.post<ICompany>('api/v1/users/sign-in', {companyData})
        return data
    }
}