import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IDesign, ICase, ITrajectory } from '../../types/types'

// Define a type for the slice state
interface DesignState {
    id: string | null,
    namePlan: string | null,
    stage: string | null,
    version: string | null,
    actualDate: Date | null,
    cases: ICase[] | null,
    trajectories: ITrajectory[] | null,
    createdAt: Date | null,
    isDesignFormOpened: boolean,
    wellboreId: string | null
}

// Define the initial state using that type
const initialState: DesignState = {
    id: null,
    namePlan: null,
    stage: null,
    version: null,
    actualDate: null,
    cases: null,
    trajectories: null,
    createdAt: null,
    isDesignFormOpened: false,
    wellboreId: null
}

export const DesignSlice = createSlice({
  name: 'design',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openDesignForm: (state) => {
        state.isDesignFormOpened = true
    },
    closeDesignForm: (state) => {
      state.isDesignFormOpened = false
    },
    setWellboreId: (state, action: PayloadAction<string>) => {
      state.wellboreId = action.payload
    }
  }
})

export const { setWellboreId, openDesignForm, closeDesignForm } = DesignSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectDesign = (state: RootState) => state.design

export default DesignSlice.reducer