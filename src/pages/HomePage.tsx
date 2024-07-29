import {FC} from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAppDispatch } from '../store/hooks'
import { logout } from '../store/user/userSlice'
import { removeTokenFromLocalStorage } from '../helpers/localStorage.helper'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import SideBar from '../components/SideBar'
import { MenuItem } from '../components/SideBarItem'
import { useCompanyFormOpen } from '../hooks/useCompany'
import CreateCompany from '../components/forms/CreateCompany'



const Home: FC = () => {
  const isCompanyFormOpened = useCompanyFormOpen()

  return (
    <div className='flex h-screen'>
      {
      isCompanyFormOpened ? (<CreateCompany />) : (<div className='w-screen flex flex-col justify-center items-center'>Welcome dear user</div>)
    }
    </div>
    
  )
}

export default Home
