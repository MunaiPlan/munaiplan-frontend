import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IDesign, IWellBore } from '../../types/types'

// Define a type for the slice state
interface WellBoreState {
    id: string | null,
    name: string | null,
    bottomLocation: string | null,
    wellBoreDepth: number | null,
    averageHookLead: number | null,
    riserPressure: number | null,
    averageInLetFlow: number | null,
    averageColumnRotationFrequency: number | null,
    maximumColumnRotationFrequency: number | null,
    averageWeightOnBit: number | null,
    maximumWeightOnBit: number | null,
    averageTorque: number | null,
    maximumTorque: number | null,
    downStaticFriction: number | null,
    depthInterval: number | null,
    designs: IDesign[] | null,
    createdAt: Date | null,
    isWellBoreFormOpened: boolean
}

// Define the initial state using that type
const initialState: WellBoreState = {
    id: null,
    name: null,
    bottomLocation: null,
    wellBoreDepth: null,
    averageHookLead: null,
    riserPressure: null,
    averageInLetFlow: null,
    averageColumnRotationFrequency: null,
    maximumColumnRotationFrequency: null,
    averageWeightOnBit: null,
    maximumWeightOnBit: null,
    averageTorque: null,
    maximumTorque: null,
    downStaticFriction: null,
    depthInterval: null,
    designs: null,
    createdAt: null,
    isWellBoreFormOpened: false
}

export const WellBoreSlice = createSlice({
  name: 'wellBore',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openWellBoreForm: (state) => {
        state.isWellBoreFormOpened = true
    },
    closeWellBoreForm: (state) => {
      state.isWellBoreFormOpened = false
    },
    createWellBore: (state, action: PayloadAction<IWellBore>) => {
        state.id = action.payload.id
        state.name = action.payload.name
        state.bottomLocation = action.payload.bottomLocation
        state.wellBoreDepth = action.payload.wellBoreDepth,
        state.averageHookLead = action.payload.averageHookLead,
        state.riserPressure = action.payload.riserPressure,
        state.averageInLetFlow = action.payload.averageInLetFlow,
        state.averageColumnRotationFrequency = action.payload.averageColumnRotationFrequency,
        state.maximumColumnRotationFrequency = action.payload.maximumColumnRotationFrequency,
        state.averageWeightOnBit = action.payload.averageWeightOnBit,
        state.maximumWeightOnBit = action.payload.maximumWeightOnBit,
        state.averageTorque = action.payload.averageTorque,
        state.maximumTorque = action.payload.maximumTorque,
        state.downStaticFriction = action.payload.downStaticFriction,
        state.depthInterval = action.payload.depthInterval,
        state.designs = action.payload.designs,
        state.createdAt = action.payload.createdAt
    }
  }
})

export const { openWellBoreForm, createWellBore, closeWellBoreForm } = WellBoreSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectWellBore = (state: RootState) => state.wellBore

export default WellBoreSlice.reducer