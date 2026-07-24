import { EndpointBuilder } from '@reduxjs/toolkit/query'

export interface UpdateProfilePayload {
  name?: string
  email?: string
  currency?: string
  currentPassword?: string
  newPassword?: string
}

export interface UpdateProfileResponse {
  _id: string
  name: string
  email: string
  currency: string
}

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<UpdateProfileResponse, UpdateProfilePayload>({
    query: values => ({
      url: `/profile`,
      method: 'PATCH',
      body: values,
    }),
  })
