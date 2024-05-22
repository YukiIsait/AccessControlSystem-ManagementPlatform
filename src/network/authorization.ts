import { fetchApi, ApiFetchMethod } from '.'
import { LoginData } from '@/entities'
import { store } from '@/store'

export const login = (id: string, password: string): Promise<LoginData> => {
    return fetchApi(ApiFetchMethod.GET, 'authorization/login', {
        id: id,
        password: password
    })
}

export const validate = (): Promise<boolean> => {
    return fetchApi(ApiFetchMethod.GET, 'authorization/validate', {
        token: store.state.token
    })
}
