import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import companyReducer from './user/companySlice'
import fieldReducer from './user/fieldSlice'
import siteReducer from './user/siteSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    company: companyReducer,
    field: fieldReducer,
    site: siteReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {user: UserState, company: CompanyState}
export type AppDispatch = typeof store.dispatch