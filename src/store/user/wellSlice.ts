import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IWell, IWellBore } from '../../types/types'

// Define a type for the slice state
interface WellState {
    id: string | null,
    name: string | null,
    description: string | null
    location: string | null
    universalWellIdentifier: string | null
    type: string | null
    wellNumber: string | null
    workingGroup: string | null
    activeWellUnit: string | null
    wellBores: IWellBore[] | null
    createdAt: Date | null
    isWellFormOpened: boolean
}

// Define the initial state using that type
const initialState: WellState = {
    id: null,
    name:  null,
    description: null,
    location: null,
    universalWellIdentifier: null,
    type: null,
    wellNumber: null,
    workingGroup: null,
    activeWellUnit: null,
    wellBores: null,
    createdAt: null,
    isWellFormOpened: false,
}

export const WellSlice = createSlice({
  name: 'well',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openWellForm: (state) => {
        state.isWellFormOpened = true
    },
    closeWellForm: (state) => {
      state.isWellFormOpened = false
    },
    createWell: (state, action: PayloadAction<IWell>) => {
        state.id = action.payload.id
        state.name = action.payload.name
        state.description = action.payload.description
        state.location = action.payload.location
        state.universalWellIdentifier = action.payload.universalWellIdentifier
        state.type = action.payload.type
        state.wellNumber = action.payload.wellNumber
        state.workingGroup = action.payload.workingGroup
        state.activeWellUnit = action.payload.activeWellUnit
        state.wellBores = action.payload.wellBores
        state.createdAt = action.payload.createdAt
    },
  },
})

export const { openWellForm, createWell, closeWellForm } = WellSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectWell = (state: RootState) => state.well

export default WellSlice.reducer