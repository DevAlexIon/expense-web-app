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

const prepareHeaders = (headers: Headers) => {
  // headers.set('X-Auth-Token', '126AF11DE93B01044662')

  const withoutAuth = Boolean(headers.get('no-auth'))
  if (withoutAuth) {
    headers.delete('no-auth')
    return headers
  }

  const userDetails = false
  if (userDetails) {
    headers.set('x-profile-id', 'id_of_user')
  }

  return headers
}

// const refreshAppToken = async (api: BaseQueryApi, extraOptions: any) => {
//   const state = api.getState() as RootState
//   const refreshToken = state.auth.refreshToken
//   const result = await baseQuery(
//     {
//       url: `/devices/fresh-token/${refreshToken}`,
//       headers: { 'no-auth': 'true' },
//     },
//     api,
//     extraOptions,
//   )
//   if (result.error) {
//     throw new Error('Cannot refresh app token.')
//   }

//   api.dispatch({ type: 'auth/refreshToken', payload: result.data as string })

//   return true
// }

const mutex = new Mutex()

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState

  const baseUrl = Constants.API_BASE_URL as string
  const rawBaseQuery = fetchBaseQuery({ baseUrl, prepareHeaders })

  return rawBaseQuery(args, api, extraOptions)
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 403) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        // await refreshAppToken(api, extraOptions)
        result = await baseQuery(args, api, extraOptions)
      } catch {
        // api.dispatch(logoutUser())
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  reducerPath: 'api',
  tagTypes: ['auth'],
})
