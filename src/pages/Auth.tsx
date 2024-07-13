import { FC } from 'react'

const Auth: FC = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="w-1/2 bg-[#16171B] flex items-top justify-left">
        <h1 className="text-white text-3xl font-semibold ml-24 mt-12 font-inter">MunaiPlan</h1>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-3/4 max-w-md justify-center items-center">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">Вход</h2>
          <form className="mb-7">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="email">
                EMAIL
              </label>
              <input
                className="border-b-2 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="email"
                type="email"
                placeholder="Введите почту"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="password">
                ПАРОЛЬ
              </label>
              <input
                className="border-b-2 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="password"
                type="password"
                placeholder="Введите пароль"
              />
              <div className="flex items-center justify-end">
                <a className="text-xs inline-block align-baseline mt-2 text-blue-500 hover:text-blue-800" href="#">
                  Забыли пароль?
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base font-medium"
                type="button"
              >
                Войти
              </button>
            </div>
          </form>
          <a className="flex justify-center" href="#">Не зарегистрированы?</a>
        </div>
      </div>
    </div>
  );
}

export default Auth
