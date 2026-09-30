import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

// Only the session lives in Redux; page data is loaded where it is used.
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
