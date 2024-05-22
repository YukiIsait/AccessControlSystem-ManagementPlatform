<template>
    <v-app :theme="store.state.theme">
        <router-view />
    </v-app>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useStore } from '@/store'

const store = useStore()

watch(() => store.state.theme, theme => {
    window.electronApi.setNativeTheme(theme)
}, { immediate: true })
</script>
