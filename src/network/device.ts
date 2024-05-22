import { fetchApi, ApiFetchMethod } from '.'
import { PageData, DeviceData } from '@/entities'

export const listDevices = (
    page: number,
    itemsPerPage: number,
    sortBy?: { key: string, order: string },
    searchName?: string
): Promise<PageData<DeviceData[]>> => {
    return fetchApi(ApiFetchMethod.GET, 'device/list', {
        page: page,
        size: itemsPerPage,
        sort: sortBy ? `${sortBy.key},${sortBy.order}` : '',
        name: searchName ? searchName : ''
    })
}

export const addDevice = (data: DeviceData) => {
    return fetchApi(ApiFetchMethod.POST, 'device/add', data)
}

export const updateDevice = (data: DeviceData) => {
    return fetchApi(ApiFetchMethod.PUT, 'device/update', data)
}

export const deleteDevice = (id: string) => {
    return fetchApi(ApiFetchMethod.DELETE, 'device/delete', {
        id: id
    })
}
