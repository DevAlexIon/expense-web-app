import { EndpointBuilder } from '@reduxjs/toolkit/query'

export type Storage = {
  id: number
  name: string
  alias: string | null
  bobs: Bob[]
  isActive: boolean
}

export type Company = {
  cui: number
  euid: string
  id: number
  name: string
}

export type Bob = {
  bobBlueprint: {
    version: number
  }
  id: number
  storage: Storage | null
  uid: string
}

export type Chain = {
  id: number
  name: string
  bobs: Bob[]
  company: Company
}

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Chain[], void>({
    query: () => ({
      url: '/chains?lite=true',
      method: 'GET',
    }),
  })
