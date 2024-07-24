import {FC} from 'react'
import { useAuth } from '../hooks/useAuth'

interface Props {
    children: JSX.Element
}

const ProtectedRoute: FC<Props> = ({children}) => {
  const isAuth = useAuth()
  return <>
    {true ? (
        children
    ) : (<div className='flex flex-col justify-center items-center mt-20 gap-10'>
            <h1 className='text-2xl'>Чтобы увидеть данную страницу, вы должны зарегистрированы в системе</h1>
        </div>)}
  </>
}

export default ProtectedRoute
