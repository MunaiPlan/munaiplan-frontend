import {FC} from 'react'
import { useCaseFormOpen, useCompanyFormOpen, useDesignFormOpen, useFieldFormOpen, useSiteFormOpen, useWellBoreFormOpen, useWellFormOpen } from '../hooks/useForms'
import CreateCompany from '../components/forms/CreateCompany'
import CreateSite from '../components/forms/CreateSite'
import CreateWell from '../components/forms/CreateWell'
import CreateWellBore from '../components/forms/CreateWellBore'
import CreateDesign from '../components/forms/CreateDesign'
import CreateCase from '../components/forms/CreateCase'
import { instance } from '../api/axios.api'
import { ICompany, IResponseLoader } from '../types/types'
import { useLoaderData } from 'react-router-dom'
import SideBar from '../components/SideBar'
import CreateField from '../components/forms/CreateField'

export const companiesLoader = async() => {
  try {
    const companies = await instance.get<ICompany[]>('/api/v1/companies');
    console.log(companies)
    const data = { companies: companies.data };
    console.log("START");
    console.log(data);  // Make sure data is correctly logged
    console.log("END");
    return data;
  } catch (error) {
    console.error('Failed to load companies:', error);
    return { companies: [] };  // Return an empty array if there's an error
  }
};


const Home: FC = () => {
  const isCompanyFormOpened = useCompanyFormOpen()
  const isFieldFormOpened = useFieldFormOpen()
  const isSiteFormOpened = useSiteFormOpen()
  const isWellFormOpened = useWellFormOpen()
  const isWellBoreFormOpened = useWellBoreFormOpen()
  const isDesignFormOpened = useDesignFormOpen()
  const isCaseFormOpened = useCaseFormOpen()
  const { companies: initialCompanies = [] } = useLoaderData() as IResponseLoader || {};

  let content;
  if (isCompanyFormOpened) {
    content = <CreateCompany type={"post"} prevName={""} prevDivision={""} prevAddress={""} prevGroup={""} prevPhone={""} prevRepresentative={""}/>
  } else if (isFieldFormOpened) {
    content = <CreateField type={"post"} prevName={""} prevDescription={""} prevReductionLevel={""} prevActiveFieldUnit={""} companyId=''/>
  } else if (isSiteFormOpened) { 
    content = <CreateSite type={"post"} prevName={""} prevArea={""} prevAzimuth={""} prevBlock={""} prevCountry={""} prevRegion={""} prevState={""} />
  } else if (isWellFormOpened){
    content = <CreateWell />
  } else if (isWellBoreFormOpened) {
    content = <CreateWellBore />
  } else if (isDesignFormOpened) {
    content = <CreateDesign />
  } else if (isCaseFormOpened) {
    content = <CreateCase />
  } else {
    content = <div className='w-screen flex flex-col justify-start items-center'>
      {initialCompanies.length > 0 ? 
      <div>
        Тут ваши компании
        <ul>
          {initialCompanies.map((company, i) => <li key={i}>
            {company.name}
          </li>)}
        </ul>
      </div> : "Создайте компнанию"}
    </div>
  }

  return (
    <div className="'h-screen w-full">
        <SideBar />
        <div className="flex h-screen">
            {content}    
        </div>
    </div>
  )
}

export default Home
