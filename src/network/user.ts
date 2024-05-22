import { fetchApi, ApiFetchMethod } from '.'
import { PageData, UserData } from '@/entities'

export const getUser = (id: string): Promise<UserData> => {
    return fetchApi(ApiFetchMethod.GET, 'user/get', {
        id: id
    })
}

export const listUsers = (
    page: number,
    itemsPerPage: number,
    sortBy?: { key: string, order: string },
    searchName?: string,
    searchId?: string
): Promise<PageData<UserData[]>> => {
    return fetchApi(ApiFetchMethod.GET, 'user/list', {
        page: page,
        size: itemsPerPage,
        sort: sortBy ? `${sortBy.key},${sortBy.order}` : '',
        name: searchName ? searchName : '',
        id: searchId ? searchId : ''
    })
}

export const addUser = (data: UserData) => {
    return fetchApi(ApiFetchMethod.POST, 'user/add', data)
}

export const updateUser = (data: UserData) => {
    return fetchApi(ApiFetchMethod.PUT, 'user/update', data)
}

export const deleteUser = (id: string) => {
    return fetchApi(ApiFetchMethod.DELETE, 'user/delete', {
        id: id
    })
}
