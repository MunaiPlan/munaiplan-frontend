import { FC, useState } from 'react';
import { authService } from '../services/auth.service';
import { saveUserLocally } from '../api/axios.api';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Auth: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await authService.login(
        {
          email: formData.email,
          password: formData.password,
        },
      );

      if (data) {
        saveUserLocally(data);
        dispatch(login(data));
        toast.success('Вы успешно вошли в аккаунт');
        navigate('/');
      }
    } catch (err: any) {
      const error = err.response?.data.message || 'An error occurred during login';
      toast.error(error.toString());
    }
  };

  const registrationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await authService.registration(
        formData,
        '3d93d668-9c5d-416d-8f49-324dfc38fa48'
      );
      if (data) {
        toast.success('Аккаунт был создан');
        setIsLogin(true);
      }
    } catch (err: any) {
      const error = err.response?.data?.message || 'Возникла ошибка во время создания аккаунта';
      toast.error(error.toString());
    }
  };

  return (
    <div className='flex h-screen w-full'>
      <div className="w-1/2 bg-[#16171B] flex items-top justify-left">
        <h1 className="text-white text-3xl font-semibold ml-24 mt-12 font-inter">MunaiPlan</h1>
      </div>
    <div className="w-1/2 flex items-center justify-center">
      <div className="w-3/4 max-w-md justify-center items-center">
        <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">
          {isLogin ? 'Вход' : 'Регистрация'}
        </h2>
        <form onSubmit={isLogin ? loginHandler : registrationHandler} className="mb-7">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="email">
              EMAIL
            </label>
            <input
              className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
              id="email"
              type="email"
              placeholder="Введите почту"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="phone">
                  Номер телефона
                </label>
                <input
                  className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                  id="phone"
                  type="text"
                  placeholder="Введите номер телефона"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="name">
                  Имя
                </label>
                <input
                  className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                  id="name"
                  type="text"
                  placeholder="Введите ваше имя"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="surname">
                  Отечество
                </label>
                <input
                  className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                  id="surname"
                  type="text"
                  placeholder="Введите ваше отечество"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="password">
              ПАРОЛЬ
            </label>
            <input
              className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {isLogin && (
              <div className="flex items-center justify-end">
                <a className="text-xs inline-block align-baseline mt-2 text-blue-500 hover:text-blue-800" href="#">
                  Забыли пароль?
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
              type="submit"
            >
              {isLogin ? 'Вход' : 'Регистрация'}
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          {isLogin ? (
            <button onClick={() => setIsLogin(false)} className="text-black hover:text-black/80">
              Не зарегистрированы?
            </button>
          ) : (
            <button onClick={() => setIsLogin(true)} className="text-black hover:text-black/80">
              Уже есть аккаунт
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Auth;
