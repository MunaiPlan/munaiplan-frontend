import {FC} from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAppDispatch } from '../store/hooks'
import { logout } from '../store/user/userSlice'
import { removeTokenFromLocalStorage } from '../helpers/localStorage.helper'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import SideBar from '../components/SideBar'
import { MenuItem } from '../components/SideBarItem'



const Home: FC = () => {
  const isAuth = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logoutHandler = () => {
    dispatch(logout())
    removeTokenFromLocalStorage('token')
    toast.success('Вы вышли из системы')
    navigate('/')
  }
  return (
    <div className='flex h-screen'>
      <div>Other</div>
    </div>
    
  )
}

export default Home
