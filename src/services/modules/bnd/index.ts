import { api } from '@/services/api'

export const grpcApi = api.injectEndpoints({
  endpoints: build => ({}),
  overrideExisting: true,
})

export const {} = grpcApi
