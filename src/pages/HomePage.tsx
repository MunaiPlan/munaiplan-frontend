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
import { redirect, useLoaderData, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { useAuth } from '../hooks/useAuth'
import { logout } from '../store/user/userSlice'
import { removeTokenFromLocalStorage } from '../helpers/localStorage.helper'
import { toast } from 'react-toastify'
import { openCompanyForm } from '../store/user/companySlice'
import { closeFieldForm } from '../store/user/fieldSlice'
import { closeSiteForm } from '../store/user/siteSlice'
import { closeWellForm } from '../store/user/wellSlice'
import { closeWellBoreForm } from '../store/user/wellBoreSlice'
import { closeDesignForm } from '../store/user/designSlice'
import { FaSignOutAlt } from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'
import { MdPeople } from 'react-icons/md'
import { HiMiniSquares2X2 } from 'react-icons/hi2'
import SideBarMenu from '../components/SideBarItem'
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

export const companiesAction = async({request }: any) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData()
      console.log(formData)
      console.log(formData.get("name"))
      const newCompany = {
        name: formData.get("name"),
        division: formData.get("division"),
        group: formData.get("group"),
        representative: formData.get("representative"),
        address: formData.get("address"),
        phone: formData.get("phone")
      }
      await instance.post('/api/v1/companies', newCompany)
      toast.success("Company was added")
      return null
    }
    case "DELETE": {
        const formData = await request.formData()
        const companyID = formData.get('id')
        await instance.delete(`/api/v1/companies/${companyID}`)
        toast.success("Компания была успешно удалена")
        return redirect('/');
    }
    case "PUT": {
      console.log("PUT works");
      const formData = await request.formData();
      const companyID = formData.get("id");
      console.log("Company ID:", companyID);
      const updatedCompany = {
        name: formData.get("name"),
        division: formData.get("division"),
        group: formData.get("group"),
        representative: formData.get("representative"),
        address: formData.get("address"),
        phone: formData.get("phone")
      };
      console.log("Updated Company:", updatedCompany);
      
      // API call
      try {
        const response = await instance.put(`/api/v1/companies/${companyID}`, updatedCompany);
        console.log("Response:", response);
        toast.success("Компания была успешно обновлено");
        return redirect('/');
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update the company");
      }
    }
  }
}


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
    content = <CreateCompany type={"post"} prevName={""} prevDivision={""} prevAddress={""} prevGroup={""} prevPhone={""} prevRepresentative={""}/>
  } else if (isFieldFormOpened) {
    content = <CreateField type={"post"} prevName={""} prevDescription={""} prevReductionLevel={""} prevActiveFieldUnit={""} companyId=''/>
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
    <div className="'h-screen w-full">
        <SideBar />
        <div className="flex h-screen">
            {content}    
        </div>
    </div>
  )
}

export default Home
