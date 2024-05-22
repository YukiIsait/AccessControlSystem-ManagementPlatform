<template>
    <v-navigation-drawer permanent width="250">
        <template #prepend>
            <v-list-item lines="two" prepend-icon="mdi-card-account-details" subtitle="管理员"
                :title="store.state.information.name">
                <template #append>
                    <v-btn variant="text" size="small" icon="mdi-logout" @click="onLogout" />
                </template>
            </v-list-item>
        </template>
        <template #append>
            <v-list density="compact" nav v-model:selected="theme">
                <v-list-item title="暗色模式" value="dark" prepend-icon="mdi-brightness-4" />
                <v-list-item title="亮色模式" value="light" prepend-icon="mdi-brightness-7" />
            </v-list>
        </template>
        <v-divider />
        <v-list density="compact" nav v-model:selected="navigation">
            <v-list-item title="人员管理" value="user-manager" prepend-icon="mdi-account" />
            <v-list-item title="设备管理" value="device-manager" prepend-icon="mdi-smoke-detector" />
            <v-list-item title="权限管理" value="access-info-manager" prepend-icon="mdi-shield-lock-open" />
            <v-list-item title="卡片读写" value="card-editor" prepend-icon="mdi-card-bulleted-settings" />
        </v-list>
    </v-navigation-drawer>
    <v-main>
        <router-view />
    </v-main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'

const store = useStore()
const router = useRouter()

const theme = computed({
    get: () => [store.state.theme],
    set: value => { store.commit('setTheme', value[0]) }
})
const navigation = computed({
    get: () => [router.currentRoute.value.name] as string[],
    set: (value: string[]) => { router.push({ name: value[0] }) }
})
const onLogout = () => {
    store.commit('clearUserInformation')
    router.push('/login')
}
</script>
