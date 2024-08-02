import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ICompany, IField } from '../../types/types'

// Define a type for the slice state
interface CompanyState {
    id: string | null,
    name: string | null,
    division: string | null
    group: string | null
    representative: string | null
    address: string | null
    phone: string | null
    fields: IField[] | null
    isCompanyFormOpened: boolean,
}

// Define the initial state using that type
const initialState: CompanyState = {
  id: null,
  name: null,
  isCompanyFormOpened: false,
  division: null,
  group: null,
  representative: null,
  address: null,
  phone: null,
  fields: []
}

export const CompanySlice = createSlice({
  name: 'company',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openCompanyForm: (state) => {
        state.isCompanyFormOpened = true
    },
    closeCompanyForm: (state) => {
      state.isCompanyFormOpened = false
    },
    createCompany: (state, action: PayloadAction<ICompany>) => {
        state.id = action.payload.id
        state.name = action.payload.name
        state.division = action.payload.division
        state.address = action.payload.address
        state.group = action.payload.group
        state.representative = action.payload.representative
        state.fields = action.payload.fields
        state.phone = action.payload.phone
    },
  },
})

export const { openCompanyForm, createCompany, closeCompanyForm } = CompanySlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCompany = (state: RootState) => state.company

export default CompanySlice.reducer