import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import companyReducer from './user/companySlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    company: companyReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {user: UserState, company: CompanyState}
export type AppDispatch = typeof store.dispatch