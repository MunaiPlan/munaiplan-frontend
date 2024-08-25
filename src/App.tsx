import { RouterProvider } from "react-router-dom"
import { router } from "./router/router"
import { useAppDispatch } from "./store/hooks"
import { getTokenFromLocalStorage, removeTokenFromLocalStorage } from "./helpers/localStorage.helper"
import { authService } from "./services/auth.service"
import { login, logout } from "./store/user/userSlice"
import { useEffect } from "react"
import { useAuth, useUser } from "./hooks/useAuth"

function App() {
  const dispatch = useAppDispatch()
  const isAuth = useAuth() 
  // console.log(isAuth)

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage()
    // console.log(token)
    // console.log(isAuth)
    try {
      // console.log("We are in try")
      // if (token) {
      //   dispatch(login());
      // }
      // else {
      //   dispatch(logout());
      //   removeTokenFromLocalStorage('token')
      //   console.log("YEAH it did work")
      // }
      // console.log("YEAH it didn't work")

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // console.log("START")
    checkAuth()
    // console.log("END")
  }, [])

  return <RouterProvider router={router}/>
}

export default App
