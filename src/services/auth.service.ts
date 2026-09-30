import { instance } from "../api/axios.api";
import type { IUserData, IUser } from "../types/types";
import { parseSignInResponse } from "../auth/session";

export const authService = {
    async login(userData: IUserData): Promise<IUser> {
        const { data } = await instance.post<unknown>(
          "/api/v1/users/sign-in",
          userData
        );
        return parseSignInResponse(data);
    },
};
