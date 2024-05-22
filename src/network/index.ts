import configuration from '@/configuration.json'
import { ResponseData } from '@/entities'
import { store } from '@/store'
import { objectToUrlParams } from '@/utils'

export enum ApiFetchMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export const fetchApi = async (
    method: ApiFetchMethod,
    operation: string,
    data: any
): Promise<any> => {
    const headers: any = {
        'Content-Type': 'application/json'
    }
    if (store.state.token) {
        headers['Authorization'] = `Bearer ${store.state.token}`
    }
    let response: Response
    switch (method) {
        case ApiFetchMethod.GET:
        case ApiFetchMethod.DELETE:
            response = await fetch(`${configuration.apiUrl}/${operation}?${objectToUrlParams(data)}`, {
                method: method,
                headers: headers
            })
            break
        case ApiFetchMethod.POST:
        case ApiFetchMethod.PUT:
            response = await fetch(`${configuration.apiUrl}/${operation}`, {
                method: method,
                headers: headers,
                body: JSON.stringify(data)
            })
            break
        default:
            throw new Error('Invalid method.')
    }
    if (!response || !response.ok) {
        throw new Error(response.statusText)
    }
    const result: ResponseData<any> = await response.json()
    if (result.status !== 200) {
        throw new Error(result.message)
    }
    return result.data
}
