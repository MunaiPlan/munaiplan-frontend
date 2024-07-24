import { instance } from "../api/axios.api"
import { IUserData, RegistrationData, RegistrationResponseData, IUser } from "../types/types"
export const authService = {

    async login(userData: IUserData): Promise<IUser | undefined> {
        const {data} = await instance.post<IUser>('api/v1/users/sign-in', {body: userData, organizationID: '001'})
        return data
    },

    async registration(userData: RegistrationData): Promise<RegistrationResponseData | undefined> {
        const requestBody = {
            "body": userData,
            "organizationID": "001"
        };
        const {data} = await instance.post<RegistrationResponseData>('api/v1/users/sign-up', requestBody)
        return data
    },

    async getProfile(): Promise<IUser | undefined> {
        const {data} = await instance.get<IUser>('api/v1/users/sign-out')
        if (data){
            return data
        }
    },
}