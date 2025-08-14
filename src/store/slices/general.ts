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

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    payload: { email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const result = await dispatch(
        userApi.endpoints.login.initiate({
          body: payload,
        }),
      ).unwrap()
      return result
    } catch (err: any) {
      return rejectWithValue(err.data || err.message)
    }
  },
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const result = await dispatch(
        userApi.endpoints.register.initiate({
          body: payload,
        }),
      ).unwrap()
      return result
    } catch (err: any) {
      return rejectWithValue(err.data || err.message)
    }
  },
)

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
