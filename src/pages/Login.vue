<template>
    <v-main :class="theme ? 'background' : ''">
        <div class="overlay d-flex justify-center align-center">
            <v-card width="344" class="px-2 py-3">
                <v-card-title class="text-center">门禁信息系统管理平台</v-card-title>
                <v-card-subtitle class="text-center">请使用管理员账户登录</v-card-subtitle>
                <v-card-text>
                    <v-form @submit.prevent="onSubmit">
                        <v-text-field v-model="loginState.id" label="编号" prepend-inner-icon="mdi-account" />
                        <v-text-field v-model="loginState.password" label="密码" prepend-inner-icon="mdi-lock"
                            :type="loginState.passwordVisible ? 'text' : 'password'"
                            :append-inner-icon="loginState.passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="loginState.passwordVisible = !loginState.passwordVisible" />
                        <v-btn text="登录" size="large" color="primary" flat block type="submit" />
                    </v-form>
                </v-card-text>
            </v-card>
        </div>
        <v-btn-toggle class="fixed-top-right ma-6" mandatory :elevation="1" v-model="theme">
            <v-btn icon="mdi-brightness-4" />
            <v-btn icon="mdi-brightness-7" />
        </v-btn-toggle>
        <div class="fixed-bottom-left ma-6">Copyright © 2024 YukiIsait</div>
        <alert-dialog title="错误" :text="alertDialog.message" :cancel-button-text="null" v-model="alertDialog.show" />
    </v-main>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { login } from '@/network/authorization'
import AlertDialog from '@/components/AlertDialog.vue'

const router = useRouter()
const store = useStore()
const theme = computed({
    get: () => store.state.theme === 'dark' ? 0 : 1,
    set: value => { store.commit('setTheme', value === 0 ? 'dark' : 'light') }
})
const loginState = reactive({
    id: '',
    password: '',
    passwordVisible: false
})
const alertDialog = reactive({
    show: false,
    message: ''
})
const onSubmit = async () => {
    if (!loginState.id || !loginState.password) {
        alertDialog.message = '请输入编号和密码'
        alertDialog.show = true
        return
    }
    try {
        const userData = await login(loginState.id, loginState.password)
        if (userData.information.authorities.indexOf('ROLE_ADMIN') === -1) {
            alertDialog.message = '您不是管理员，无法登录'
            alertDialog.show = true
            return
        }
        store.commit('setUserInformation', userData)
        router.push('/home')
    } catch (error: any) {
        alertDialog.message = '登录失败，请检查编号和密码是否正确'
        alertDialog.show = true
    }
}
</script>

<style scoped>
.background {
    background-image: url('@/assets/background.svg');
    background-size: cover;
    background-position: center;
}

.overlay {
    height: 100%;
    background-color: rgba(0, 0, 0, .2);
}

.fixed-top-right {
    position: absolute;
    right: 0;
    top: 0;
}

.fixed-bottom-left {
    position: absolute;
    left: 0;
    bottom: 0;
}
</style>
