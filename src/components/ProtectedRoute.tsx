import {FC} from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface Props {
    children: JSX.Element
}

const ProtectedRoute: FC<Props> = ({children}) => {
  const isAuth = useAuth()
  const navigate = useNavigate()
  const authNavigator = () => {
    navigate('/auth')
  }
  return <>
    {isAuth ? (
        children
    ) : (<div className='flex flex-col justify-center items-center mt-20 gap-10'>
            <h1 className='text-2xl m-5 text-center'>Чтобы увидеть данную страницу, вы должны зарегистрированы в системе</h1>
            <button className='pl-4 pr-4 pt-2 pb-2 border border-black rounded-md' onClick={() => authNavigator()}>Зарегистрироваться</button>
        </div>)}
  </>
}

export default ProtectedRoute
