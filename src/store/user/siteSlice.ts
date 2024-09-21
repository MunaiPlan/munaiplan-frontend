import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ISite, IWell } from '../../types/types'

// Define a type for the slice state
interface SiteState {
    id: string | null,
    name: string | null,
    fieldId: string | null,
    area: number | null
    block: string | null
    azimuth: number | null
    country: string | null
    state: string | null
    region: string | null
    wells: IWell[] | null
    isSiteFormOpened: boolean,
}

// Define the initial state using that type
const initialState: SiteState = {
  id: null,
  name: null,
  area: null,
  block: null,
  azimuth: null,
  country: null,
  state: null,
  region: null,
  wells: [],
  isSiteFormOpened: false,
  fieldId: null
}

export const SiteSlice = createSlice({
  name: 'site',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openSiteForm: (state) => {
        state.isSiteFormOpened = true
    },
    closeSiteForm: (state) => {
      state.isSiteFormOpened = false
    },
    createSite: (state, action: PayloadAction<ISite>) => {
        state.id = action.payload.id
        state.name = action.payload.name
        state.area = action.payload.area
        state.block = action.payload.block
        state.azimuth = action.payload.azimuth
        state.country = action.payload.country
        state.state = action.payload.state
        state.region = action.payload.region
        state.wells = action.payload.wells
    },
    setFieldId: (state, action: PayloadAction<string>) => {
      state.fieldId = action.payload
    },
  },
})

export const { openSiteForm, createSite, closeSiteForm, setFieldId } = SiteSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSite = (state: RootState) => state.site

export default SiteSlice.reducer