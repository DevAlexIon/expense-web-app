import { userApi } from '@/services/modules'
import { Chain } from '@/services/modules/users/getChains'
import { RootState } from '@/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

type GeneralInitialState = {
  theme: string | null
}

const initialState: GeneralInitialState = {
  theme: localStorage.getItem('theme') ?? null,
}

const generalSlice = createSlice({
  name: 'general',
  initialState: initialState,
  reducers: {
    setDarkModeApperance: (
      state,
      { payload }: PayloadAction<'dark' | 'light'>,
    ) => {
      state.theme = payload
      localStorage.setItem('theme', payload)
    },
  },

  // },
})

export const selectApperanceMode = (state: RootState) => {
  return state.general.theme === 'dark'
}

export const { setDarkModeApperance } = generalSlice.actions

export default generalSlice.reducer
