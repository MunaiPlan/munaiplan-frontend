import {FC} from 'react'
import { useCaseFormOpen, useCompanyFormOpen, useDesignFormOpen, useFieldFormOpen, useSiteFormOpen, useWellBoreFormOpen, useWellFormOpen } from '../hooks/useForms'
import CreateCompany from '../components/forms/CreateCompany'
import CreateField from '../components/forms/CreateField'
import CreateSite from '../components/forms/CreateSite'
import CreateWell from '../components/forms/CreateWell'
import CreateWellBore from '../components/forms/CreateWellBore'
import CreateDesign from '../components/forms/CreateDesign'
import CreateCase from '../components/forms/CreateCase'
import { instance } from '../api/axios.api'
import { ICompany, IResponseLoader } from '../types/types'
import { useLoaderData } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
// import { loadCompanies } from '../store/user/userSlice'


// export const companiesLoader = async() => {
//   const companies = await instance.get<ICompany[]>('/api/v1/companies')
//   const data = {
//     companies: companies.data
//   }
//   const dispatch = useAppDispatch()
//   dispatch(loadCompanies(data.companies))
//   return data
// }

// export const companiesAction = async({request }: any) => {
//   const data = {}
//   return data
// }


const Home: FC = () => {
  const isCompanyFormOpened = useCompanyFormOpen()
  const isFieldFormOpened = useFieldFormOpen()
  const isSiteFormOpened = useSiteFormOpen()
  const isWellFormOpened = useWellFormOpen()
  const isWellBoreFormOpened = useWellBoreFormOpen()
  const isDesignFormOpened = useDesignFormOpen()
  const isCaseFormOpened = useCaseFormOpen()

  let content;
  if (isCompanyFormOpened) {
    content = <CreateCompany />
  } else if (isFieldFormOpened) {
    content = <CreateField />
  } else if (isSiteFormOpened) { 
    content = <CreateSite />
  } else if (isWellFormOpened){
    content = <CreateWell />
  } else if (isWellBoreFormOpened) {
    content = <CreateWellBore />
  } else if (isDesignFormOpened) {
    content = <CreateDesign />
  } else if (isCaseFormOpened) {
    content = <CreateCase />
  } else {
    content = <div className='w-screen flex flex-col justify-start items-center'>Тут ваши компании</div>
  }

  return (
    <div className='flex h-screen'>
      {content}
    </div>
  )
}

export default Home
