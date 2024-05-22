import { fetchApi, ApiFetchMethod } from '.'
import { PageData, AccessInfoData, AccessInfoId } from '@/entities'

export const listAccessInfos = (
    page: number,
    itemsPerPage: number,
    sortBy?: { key: string, order: string },
    searchDescription?: string
): Promise<PageData<AccessInfoData[]>> => {
    return fetchApi(ApiFetchMethod.GET, 'accessInfo/list', {
        page: page,
        size: itemsPerPage,
        sort: sortBy ? `${sortBy.key},${sortBy.order}` : '',
        description: searchDescription ? searchDescription : ''
    })
}

export const addAccessInfo = (data: AccessInfoData) => {
    return fetchApi(ApiFetchMethod.POST, 'accessInfo/add', data)
}

export const updateAccessInfo = (data: AccessInfoData) => {
    return fetchApi(ApiFetchMethod.PUT, 'accessInfo/update', data)
}

export const deleteAccessInfo = (id: AccessInfoId) => {
    return fetchApi(ApiFetchMethod.DELETE, 'accessInfo/delete', {
        deviceId: id.deviceId,
        userId: id.userId
    })
}
