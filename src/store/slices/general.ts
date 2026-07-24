import { userApi } from '@/services/modules'
import { RootState } from '@/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
  currency: string
}

type GeneralInitialState = {
  token: string | null
  user: User | null
}

const initialState: GeneralInitialState = {
  token: null,
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
        userApi.endpoints.login.initiate({ body: payload }),
      ).unwrap()

      dispatch(setCredentials({ token: result.token, user: result.user }))
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
        userApi.endpoints.register.initiate({ body: payload }),
      ).unwrap()
      return result
    } catch (err: any) {
      return rejectWithValue(err.data || err.message)
    }
  },
)

export const updateUser = createAsyncThunk(
  'user/updateProfile',
  async (
    payload: {
      name?: string
      email?: string
      currency?: string
      currentPassword?: string
      newPassword?: string
    },
    { dispatch, rejectWithValue, getState },
  ) => {
    try {
      const body: {
        name?: string
        email?: string
        currency?: string
        currentPassword?: string
        newPassword?: string
      } = {}

      if (payload.name !== undefined) body.name = payload.name
      if (payload.email !== undefined) body.email = payload.email
      if (payload.currency !== undefined) body.currency = payload.currency
      if (payload.newPassword) {
        body.currentPassword = payload.currentPassword
        body.newPassword = payload.newPassword
      }

      const res = await dispatch(
        userApi.endpoints.updateProfile.initiate(body),
      ).unwrap()

      const state = getState() as RootState
      const currentToken = state.general.token

      dispatch(
        setCredentials({
          token: currentToken,
          user: {
            id: res._id,
            name: res.name,
            email: res.email,
            currency: res.currency,
          },
        }),
      )

      return res
    } catch (err: any) {
      return rejectWithValue(err.data || err.message)
    }
  },
)

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload }: PayloadAction<{ token: string | null; user: User | null }>,
    ) => {
      state.token = payload.token
      state.user = payload.user
    },
    clearCredentials: state => {
      state.token = null
      state.user = null
    },
  },
})

export const selectUser = (state: RootState) => state.general.user
export const selectToken = (state: RootState) => state.general.token

export const { setCredentials, clearCredentials } = generalSlice.actions

export default generalSlice.reducer
