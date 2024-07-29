import { useAppSelector } from "../store/hooks"

export const useCompanyFormOpen = () => {
    const isCompanyFormOpen = useAppSelector((state) => state.company.isCompanyFormOpened)
    return isCompanyFormOpen
}