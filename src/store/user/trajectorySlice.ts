import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ICase, IDesign, ITrajectoryHeader, ITrajectoryUnit, IWellBore } from '../../types/types'

// Define a type for the slice state
interface TrajectoryState {
    id: string | null,
    name: string | null,
    description: string | null,
    headers: ITrajectoryHeader[] | null,
    units: ITrajectoryUnit[] | null
    cases: ICase[] | null,
    createdAt: Date | null,
    isTrajectoryFormOpened: boolean,
    designId: string | null
}

// Define the initial state using that type
const initialState: TrajectoryState = {
    id: null,
    name: null,
    description: null,
    headers: null,
    units: null,
    cases: null,
    createdAt: null,
    isTrajectoryFormOpened: false,
    designId: null
}

export const TrajectorySlice = createSlice({
  name: 'trajectory',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openTrajectoryForm: (state) => {
        state.isTrajectoryFormOpened = true
    },
    closeTrajectoryForm: (state) => {
      state.isTrajectoryFormOpened = false
    },
    setDesignId: (state, action: PayloadAction<string>) => {
      state.designId = action.payload
    }
  }
})

export const { openTrajectoryForm, closeTrajectoryForm, setDesignId } = TrajectorySlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTrajectory = (state: RootState) => state.trajectory

export default TrajectorySlice.reducer