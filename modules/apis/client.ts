import axios, { Method, AxiosInstance } from 'axios'

interface Params {
  protocol?: string
  baseURL?: string
  version?: string
  host?: string
}

interface RequestParams {
  endpoint: string
  method: Method
  data?: object
  params?: object
  headers?: object
}

export default class API {
  private instance: AxiosInstance

  constructor({
    protocol = 'http://',
    host = '',
    baseURL = '/api',
    version = '',
  }: Params = {}) {
    if (!host) {
      throw new Error('host parameter not defined in constructor on API')
    }
    this.instance = axios.create({
      baseURL: `${protocol}${host}${baseURL}${version ? `/${version}` : ''}`,
    })
  }

  request({
    endpoint,
    data = {},
    method,
    params,
    headers = {},
  }: RequestParams) {
    return this.instance.request({
      url: endpoint,
      params,
      data,
      method,
      headers,
    })
  }

  get(endpoint: string, params?: object, headers?: object) {
    return this.request({
      endpoint,
      params,
      headers,
      method: 'GET',
    })
  }

  post(endpoint: string, data: object = {}, params?: object, headers?: object) {
    return this.request({
      endpoint,
      params,
      headers,
      data,
      method: 'POST',
    })
  }

  delete<T>(
    endpoint: string,
    identifier: string,
    _params?: object,
    _headers?: object
  ) {
    return this.instance.delete(`${endpoint}/${identifier}`)
  }

  put<T>(
    endpoint: string,
    identifier: string,
    data: object,
    params?: object,
    headers?: object
  ) {
    return this.request<T>({
      endpoint: `${endpoint}/${identifier}`,
      method: 'PUT',
      params,
      headers,
      data,
    })
  }
}

// new client
function request<T>({
  endpoint,
  data,
  method,
  params,
  headers = {},
}: RequestParams) {
  const queryParams = new URLSearchParams({
    ...params,
  })
  return fetch(`${endpoint}${queryParams ? `?${queryParams}` : ''}`, {
    method,
    ...(data && { body: JSON.stringify(data) }),
    headers: new Headers({
      ...headers,
    }),
  })
}

export async function get<T>(
  endpoint: string,
  params?: object,
  headers?: object
) {
  const response = await request<T>({
    endpoint,
    params,
    headers,
    method: 'GET',
  })
  return response.json()
}
