import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import type { RootState } from '@/store'
import { Constants } from '@/constants/general'
import { resetDashboardSession } from '@/helpers/dashboardSession'

const mutex = new Mutex()

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseUrl = Constants.API_BASE_URL as string
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const token = state.general.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  })

  return rawBaseQuery(args, api, extraOptions)
}

/** Avoid importing Redux slices here — circular deps with the API module crash the app. */
const forceClientLogout = (api: {
  dispatch: (action: unknown) => unknown
  getState: () => unknown
}) => {
  const state = api.getState() as RootState
  if (!state.general.token) return

  api.dispatch({ type: 'general/clearCredentials' })
  api.dispatch({ type: 'transaction/setTransactions', payload: [] })
  resetDashboardSession()

  if (
    typeof window !== 'undefined' &&
    window.location.pathname !== '/login' &&
    window.location.pathname !== '/register'
  ) {
    window.location.assign('/login')
  }
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()
  const result = await baseQuery(args, api, extraOptions)

  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        forceClientLogout(api)
      } finally {
        release()
      }
    }
  }

  return result
}

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  reducerPath: 'api',
  tagTypes: ['auth', 'Transactions'],
})
