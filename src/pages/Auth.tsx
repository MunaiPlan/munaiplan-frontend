import { FC, useState } from 'react'
import { authService } from '../services/auth.service'
import { toast } from 'react-toastify'
import { useAppDispatch } from '../store/hooks'
import { login } from '../store/user/userSlice'
import { useNavigate } from 'react-router-dom'

const Auth: FC = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [surname, setSurname] = useState<string>('')
  const [phone, setPhone] = useState<string>('')

  const loginHandle = () => {
    dispatch(login({
      id: 0,
      email: "",
      token: ""
    }))
    toast.success('You successfully logged in')
    navigate('/')
  }

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = await authService.login({email, password})
      if (data) {
        dispatch(login(data))
        toast.success("Вы успешно вошли в аккаунт")
        navigate('/')
      }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
    }
  }    

  const registrationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = await authService.registration({email, name, password, phone, surname})
      if (data){
        toast.success('Аккаунт был создан')
        setIsLogin(!isLogin)
      }
    }
    catch (err: any) {
      const error = err.response?.data?.message || 'An error occurred during registration'
      toast.error(error.toString()) 
    }
  }

  return (
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-3/4 max-w-md justify-center items-center">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">{isLogin ? "Вход" : "Регистрация"}</h2>
          <form 
            onSubmit={isLogin ? loginHandler : registrationHandler}
            className="mb-7">
            {/* Email text field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="email">
                EMAIL
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="email"
                type="email"
                placeholder="Введите почту"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone number */}
            {!isLogin ? <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="phone_number">
                Номер телефона
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="phone_number"
                type="text"
                placeholder="Введите номер телефона"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div> : <div></div>}

            {/* Name */}
            {!isLogin ? <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="name">
                Имя
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="name"
                type="text"
                placeholder="Введите ваше имя"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div> : <div></div>}

            {/* Surname */}
            {!isLogin ? <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="surname">
                Отечество
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="surname"
                type="text"
                placeholder="Введите ваше отечество"
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div> : <div></div>}

            {/* Password text field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="password">
                ПАРОЛЬ
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="password"
                type="password"
                placeholder="Введите пароль"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-end">
                <a className="text-xs inline-block align-baseline mt-2 text-blue-500 hover:text-blue-800" href="#">
                  {isLogin ? "Забыли пароль?" : ""}
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={loginHandle}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" type='submit'
              >{isLogin ? "Вход" : "Регистрация"}</button>
            </div>
          </form>
          <div className='flex justify-center'>
            {isLogin ? (<button 
              onClick={() => {setIsLogin(false)}}
              className='text-black hover:text-black/80'>Не зарегистрированы?</button>) : (
                <button 
                  onClick={() => {setIsLogin(true)}}
                  className='text-black hover:text-black/80'>Уже есть аккаунт</button>
                )}
          </div>
        </div>
      </div>
  );
}

export default Auth
