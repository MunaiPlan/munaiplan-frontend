import { useAppSelector } from "../store/hooks"
import { IUser } from "../types/types"

export const useAuth = (): boolean => {
    const isAuth = useAppSelector((state) => state.user.isAuth)
    return isAuth
}

export const useUser = (): IUser | null => {
    const User = useAppSelector((state) => state.user.user)
    return User
}