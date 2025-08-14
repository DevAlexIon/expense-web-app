import { api } from '@/services/api'
import getChains from './getChains'
import login from './login'
import register from './register'

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    getChains: getChains(build),
    login: login(build),
    register: register(build),
  }),
  overrideExisting: true,
})

export const { useGetChainsQuery, useLoginMutation } = userApi
