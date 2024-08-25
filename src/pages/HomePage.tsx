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
import { useLoaderData, useNavigate } from 'react-router-dom'
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

  return (
    <div className='h-screen w-full'>
      <div className='flex flex-col w-1/5 bg-[#16171B] text-white absolute h-screen'>
      <h1 className='flex text-4xl font-semibold font-montserrat mt-12 mb-16 justify-center items-start'>MunaiPlan</h1>
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
      <div className='flex h-screen'>
        {content}
      </div>
    </div>
  )
}

export default Home
