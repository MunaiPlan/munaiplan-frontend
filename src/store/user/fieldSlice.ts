// import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store'
// import { ICompany, IField, ISite } from '../../types/types'

// // Define a type for the slice state
// interface FieldState {
//     companyId: string | null
//     name: string | null
//     description: string | null
//     reductionLevel: string | null
//     activeFieldUnit: string | null
//     company: ICompany | undefined
//     sites: ISite[] | null
//     isFieldFormOpened: boolean
// }

// // Define the initial state using that type
// const initialState: FieldState = {
//   companyId: null,
//   name: null,
//   description: null,
//   reductionLevel: null,
//   activeFieldUnit: null,
//   company: undefined,
//   sites: null,
//   isFieldFormOpened: false
// }

// export const FieldSlice = createSlice({
//   name: 'field',
//   // `createSlice` will infer the state type from the `initialState` argument
//   initialState,
//   reducers: {
//     openFieldForm: (state) => {
//         state.isFieldFormOpened = true
//     },
//     closeFieldForm: (state) => {
//       state.isFieldFormOpened = false
//     },
//     setCompanyId: (state, action: PayloadAction<string>) => {
//       state.companyId = action.payload
//     },
//     createField: (state, action: PayloadAction<IField>) => {
//       state.companyId = action.payload.companyId
//       state.name = action.payload.name
//       state.description = action.payload.description
//       state.reductionLevel = action.payload.reduction_level
//       state.activeFieldUnit = action.payload.active_field_unit
//       state.company = action.payload.company
//       state.sites = action.payload.sites
//     },
//   },
// })

// export const { openFieldForm, closeFieldForm, createField, setCompanyId } = FieldSlice.actions

// // Other code such as selectors can use the imported `RootState` type
// export const selectField = (state: RootState) => state.field

// export default FieldSlice.reducer