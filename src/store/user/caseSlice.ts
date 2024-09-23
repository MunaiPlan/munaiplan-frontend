import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ICase } from '../../types/types'

// Define a type for the slice state
interface CaseState {
    id: string | null,
    caseName: string | null,
    caseDescription: string | null,
    drillDepth: number | null,
    pipeSize: number | null,
    createdAt: Date | null,
    isCaseFormOpened: boolean
    trajectoryId: string, 
}

// Define the initial state using that type
const initialState: CaseState = {
    id: null,
    caseName: null,
    caseDescription: null,
    drillDepth: null,
    pipeSize: null,
    createdAt: null,
    isCaseFormOpened: false,
    trajectoryId: ""
}

export const CaseSlice = createSlice({
  name: 'case',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openCaseForm: (state) => {
        state.isCaseFormOpened = true
    },
    closeCaseForm: (state) => {
      state.isCaseFormOpened = false
    },
    createCase: (state, action: PayloadAction<ICase>) => {
        state.id = action.payload.id
        state.caseName = action.payload.case_name
        state.caseDescription = action.payload.case_description
        state.drillDepth = action.payload.drill_depth,
        state.pipeSize = action.payload.pipe_size
    },
    setTrajectoryId: (state, action: PayloadAction<string>) => {
      state.trajectoryId = action.payload
    }
  }
})

export const { openCaseForm, createCase, closeCaseForm, setTrajectoryId } = CaseSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCase = (state: RootState) => state.case

export default CaseSlice.reducer