import { EndpointBuilder } from '@reduxjs/toolkit/query'

export interface LoginPayload {
  body: {
    email: string
    password: string
  }
}

export interface LoginResponse {
  token: 'string'
  user: {
    id: 'string'
    name: 'string'
    email: 'string'
  }
}

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<LoginResponse, LoginPayload>({
    query: payload => ({
      url: '/api/auth/login',
      method: 'POST',
      body: payload.body,
    }),
  })
