import { FC, useState } from 'react';
import { authService } from '../services/auth.service';
import { saveUserLocally } from '../api/axios.api';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  surname: z.string().min(1),
  phone: z.string().min(1).regex(/^\+7\s?7\d{2}\s?\d{3}\s?\d{4}$/, {
    message: "Неправильный номер",
  }),
})

type FormFields = z.infer<typeof schema>;

const Auth: FC<FormFields> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, 
          handleSubmit, 
          setError,
          formState: {errors, isSubmitting} } = useForm<FormFields>({
            defaultValues: {
              name: "John",
              surname: "Doe",
              phone: "+7 777 777 7777",
            },
            resolver: zodResolver(schema)
          });

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    phone: ''
  });

  const onSubmit: SubmitHandler<FormFields> = async (d) => {
    try {
      if (isLogin) {
        try {
          const data = await authService.login(
            {
              email: d.email,
              password: d.password,
            }
            );
          if (data) {
            dispatch(login(data));
            toast.success('Вы успешно вошли в аккаунт');
            navigate('/');
          }
      } catch (err: any) {
        const error = err.response?.data.message || 'Возникла ошибка с входом в аккаунт';
        toast.error(error.toString());
        }
      } else {
        try {
          const data = await authService.registration(
            d,
            '9aec66f7-4143-47b8-8bd3-cb3a468f23d0'
          );
          if (data) {
            toast.success('Аккаунт был создан');
            setIsLogin(true);
          }
        } catch (err: any) {
          const error = err.response?.data?.message || 'Возникла ошибка во время создания аккаунта';
          toast.error(error.toString());
        }
      }

    } catch (error) {
      setError("root", {
        message: "Этот email уже используется",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
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
        <form className="mb-7" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="email">
              EMAIL
            </label>
            <input
              {...register("email")}
              className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
              id="email"
              type="email"
              placeholder="Введите почту"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          {errors.email && <div className='text-red-400'>{errors.email.message}</div>}

          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="phone">
                  Номер телефона
                </label>
                <input
                  {...register("phone")}
                  className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                  id="phone"
                  type="text"
                  placeholder="Введите номер телефона"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              {errors.phone && <div className='text-red-400'>{errors.phone.message}</div>}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="name">
                  Имя
                </label>
                <input
                  {...register("name")}
                  className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                  id="name"
                  type="text"
                  placeholder="Введите ваше имя"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.name && <div className='text-red-400'>{errors.name.message}</div>}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="surname">
                  Отечество
                </label>
                <input
                  {...register("surname")}
                  className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                  id="surname"
                  type="text"
                  placeholder="Введите ваше отечество"
                  value={formData.surname}
                  onChange={handleInputChange}
                />
              </div>
              {errors.surname && <div className='text-red-400'>{errors.surname.message}</div>}
            </>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="password">
              ПАРОЛЬ
            </label>
            <input
              {...register("password")}
              className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <div className='text-red-400'>{errors.password.message}</div>}
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
              disabled={isSubmitting}
              className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
              type="submit"
            >
              {isSubmitting ? 'Loading' : (isLogin ? 'Войти' : 'Регистрация')}
            </button>
          </div>
          {errors.root && <div className='text-red-400'>{errors.root.message}</div>}
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
