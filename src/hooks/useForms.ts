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

export const useWellBoreFormOpen = () => {
    const isWellBoreFormOpen = useAppSelector((state) => state.wellBore.isWellBoreFormOpened)
    return isWellBoreFormOpen
}

export const useDesignFormOpen = () => {
    const isDesignFormOpen = useAppSelector((state) => state.design.isDesignFormOpened)
    return isDesignFormOpen
}

export const useTrajectoryFormOpen = () => {
    const isTrajectoryFormOpen = useAppSelector((state) => state.trajectory.isTrajectoryFormOpened)
    return isTrajectoryFormOpen
}

export const useCaseFormOpen = () => {
    const isCaseFormOpen = useAppSelector((state) => state.case.isCaseFormOpened)
    return isCaseFormOpen
}