import { EndpointBuilder } from '@reduxjs/toolkit/query'

export interface RegisterPayload {
  body: {
    name: string
    email: string
    password: string
  }
}

export interface RegisterResponse {
  id: 'string'
  name: 'string'
  email: 'string'
}

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<RegisterResponse, RegisterPayload>({
    query: payload => ({
      url: '/api/auth/register',
      method: 'POST',
      body: payload.body,
    }),
  })
