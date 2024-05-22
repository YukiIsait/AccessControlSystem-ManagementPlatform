import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { LoginData } from '@/entities'
import { clearObjectValue } from '@/utils'

export interface State extends LoginData {
    theme: 'light' | 'dark'
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        theme: 'light',
        token: '',
        information: {
            id: '',
            name: '',
            password: '',
            authorities: '',
            gender: '',
            phone: '',
            description: ''
        }
    },
    mutations: {
        setTheme(state, theme) {
            state.theme = theme
        },
        setUserInformation(state, { token, information }: LoginData) {
            state.token = token
            state.information = information
        },
        clearUserInformation(state) {
            state.token = ''
            clearObjectValue(state.information)
        }
    }
})

export function useStore() {
    return baseUseStore(key)
}
