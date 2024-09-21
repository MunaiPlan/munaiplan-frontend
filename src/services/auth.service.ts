// import { instance } from "../api/axios.api";
// import { IUserData, RegistrationData, RegistrationResponseData, IUser } from "../types/types";

// export const authService = {
//     async login(userData: IUserData, organizationId: string): Promise<IUser | undefined> {
//         const { data } = await instance.post<IUser>(
//           `api/v1/users/sign-in?organizationId=${organizationId}`,
//           userData
//         );
//         return data;
//     },

//     async registration(userData: RegistrationData, organizationId: string): Promise<RegistrationResponseData | undefined> {     
//         const { data } = await instance.post<RegistrationResponseData>(
//           `api/v1/users/sign-up?organizationId=${organizationId}`, 
//           userData
//         );
//         return data;
//       },
// };