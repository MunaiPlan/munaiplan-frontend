import { useAppSelector } from "../store/hooks"

export const useCompanyFormOpen = () => {
    const isCompanyFormOpen = useAppSelector((state) => state.company.isCompanyFormOpened)
    return isCompanyFormOpen
}

export const useFieldFormOpen = () => {
    const isFieldFormOpen = useAppSelector((state) => state.field.isFieldFormOpened)
    return isFieldFormOpen
}