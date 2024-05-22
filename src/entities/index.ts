export interface UserData {
    id: string;
    name: string;
    password?: string;
    authorities: string;
    gender?: string;
    phone?: string;
    description?: string;
}

export interface DeviceData {
    id: string;
    name: string;
    description?: string;
}

export interface AccessInfoId {
    deviceId: string;
    userId: string;
}

export interface AccessInfoData {
    id: AccessInfoId;
    description?: string;
}

export interface LoginData {
    token: string,
    information: UserData
}

export interface PageData<T> {
    content: T
    totalPages: number;
    totalElements: number;
}

export interface ResponseData<T> {
    status: number;
    message: string;
    data: T;
}
