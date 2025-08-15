import { userApi } from '@/services/modules'
import { LoginResponse } from '@/services/modules/users/login'
import { RootState } from '@/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setTransactions } from './transactionSlice'

type GeneralInitialState = {
  user: LoginResponse | null
}

const initialState: GeneralInitialState = {
  user: null,
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
      dispatch(setUserInfo(result))
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
    setUserInfo: (state, { payload }: PayloadAction<LoginResponse>) => {
      state.user = payload
    },
  },

  // },
})

export const selectUser = (state: RootState) => state.general.user

export const { setUserInfo } = generalSlice.actions

export default generalSlice.reducer
