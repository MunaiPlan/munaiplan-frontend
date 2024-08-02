import { useAppSelector } from "../store/hooks"

export const useCompanyFormOpen = () => {
    const isCompanyFormOpen = useAppSelector((state) => state.company.isCompanyFormOpened)
    return isCompanyFormOpen
}

export const useFieldFormOpen = () => {
    const isFieldFormOpen = useAppSelector((state) => state.field.isFieldFormOpened)
    return isFieldFormOpen
}

export const useSiteFormOpen = () => {
    const isSiteFormOpen = useAppSelector((state) => state.site.isSiteFormOpened)
    return isSiteFormOpen
}

export const useWellFormOpen = () => {
    const isWellFormOpen = useAppSelector((state) => state.well.isWellFormOpened)
    return isWellFormOpen
}