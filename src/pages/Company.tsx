import {FC, useState} from 'react'
import { useAppDispatch } from '../store/hooks'
import { createCompany, openCompanyForm } from '../store/user/companySlice'
import { toast } from 'react-toastify'
import { companyService } from '../services/forms.service'
import { Form, useLoaderData, useNavigate } from 'react-router-dom'
import { instance } from '../api/axios.api'
import { ICompany, IField, IResponseLoader } from '../types/types'
import CreateCompany from '../components/forms/CreateCompany'
import { useAuth } from '../hooks/useAuth'
import { logout } from '../store/user/userSlice'
import { removeTokenFromLocalStorage } from '../helpers/localStorage.helper'
import { closeFieldForm } from '../store/user/fieldSlice'
import { closeSiteForm } from '../store/user/siteSlice'
import { closeWellForm } from '../store/user/wellSlice'
import { closeWellBoreForm } from '../store/user/wellBoreSlice'
import { closeDesignForm } from '../store/user/designSlice'
import SideBarMenu from '../components/SideBarItem'
import { HiMiniSquares2X2 } from 'react-icons/hi2'
import { MdPeople } from 'react-icons/md'
import { FaGear } from 'react-icons/fa6'
import { FaSignOutAlt } from 'react-icons/fa'

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
      try {
        const formData = await request.formData()
        console.log(formData)
        console.log(formData.get("name"))
        const newCompany = {
          name: formData.get("name"),
          division: formData.get("division"),
          group: formData.get("group"),
          representative: formData.get("representative"),
          address: formData.get("address"),
          phone: formData.get("phone"),
          fields: [],
        }
        await instance.post('/api/v1/companies', newCompany)
        toast.success("Company was added")
        return null
      } catch (err: any) {
          const error = err.response?.data.message || 'An error occurred during login';
          toast.error(error.toString());
      }
    }
    case "DELETE": {
        const formData = await request.formData()
        const companyID = formData.get('id')
        await instance.delete(`/api/v1/companies/${companyID}`)
        toast.success("Компания была успешно удалена")
        return null
    }
  }
}


const Company: FC = () => {
  const isAuth = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  console.log("1")
  const { companies: initialCompanies = [] } = useLoaderData() as IResponseLoader || {};
  console.log(initialCompanies)
  console.log("2")

  const logoutHandler = () => {
    dispatch(logout())
    removeTokenFromLocalStorage('token')
    toast.success('You successfully logged out')
    navigate('/auth')
  }

  const companyCreateFormOpenHandler = () => {
    dispatch(openCompanyForm())
    dispatch(closeFieldForm())
    dispatch(closeSiteForm())
    dispatch(closeWellForm())
    dispatch(closeWellBoreForm())
    dispatch(closeDesignForm())
  }

  const homePageNavigation = () => {
    navigate('/')
  }
    return (
      <div className='h-full w-full'>
        <div className='flex flex-col w-1/5 bg-[#16171B] text-white absolute h-full'>
        <h1 className='flex text-4xl font-semibold font-montserrat mt-12 mb-16 justify-center items-start' onClick={homePageNavigation}>MunaiPlan</h1>
        <div 
          onClick={companyCreateFormOpenHandler}
          className='flex justify-center items-start'>
          <button className='flex text-sm rounded-2xl bg-[#FDFFFF] text-[#16171B] w-52 justify-center items-center h-10 mb-5 hover:bg-gray-300'>+ Создать компанию</button>
        </div>
        {/* Dropdown */}
        <div className='flex flex-col ml-10 mr-10 mb-6 overflow-y-auto flex-grow'>
          <div className='flex flex-col gap-x-1 items-start justify-center'>
            {initialCompanies.map((item) => (
              <SideBarMenu key={item.id} item={item} />
            ))}
          </div>
        </div>
        {/* Catalog, Logout, Account */}
        <div id="footer" className="flex bottom-0 left-0 w-full bg-[#16171B] h-1/5 pl-4 pr-4 pt-5 border-t border-gray-400 text-white items-start">
          <div className='flex flex-col flex-grow'>
            <div className='flex justify-start items-center'>
              <HiMiniSquares2X2 className='mr-2 text-gray-500' />
              <button onClick={() => navigate('/catalog')}>
                Каталог
              </button>
            </div>
            <div className='flex justify-start items-center mt-2'>
              <MdPeople className='mr-2 text-gray-500' />
              <button onClick={() => navigate('/account')}>
                Аккаунт
              </button>
            </div>
            <div className='flex justify-start items-center mt-2 mb-2'>
              <FaGear className='mr-2 text-gray-500' />
              <button onClick={() => navigate('/settings')}>
                Настройки
              </button>
            </div>
          </div>
          <div className='flex items-center justify-end ml-4'>
            <FaSignOutAlt className='mr-2 text-gray-500'/>
            <button onClick={logoutHandler}>
              Выйти
            </button>
          </div>
        </div>
      </div>
      <CreateCompany type={"post"} prevName={""} prevDivision={""} prevAddress={""} prevGroup={""} prevPhone={""} prevRepresentative={""}/>
      </div>
    )
}

export default Company;