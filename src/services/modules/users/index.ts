import { api } from '@/services/api'
import getChains from './getChains'

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    getChains: getChains(build),
  }),
  overrideExisting: true,
})

export const { useGetChainsQuery } = userApi
