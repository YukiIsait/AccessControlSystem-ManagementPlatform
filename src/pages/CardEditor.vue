<template>
    <status-bar title="卡片读写" :show-search-bar="false" :show-add-button="false" @refresh="onRefresh" />
    <v-divider />
    <div class="fill-height-without-status-bar d-flex justify-center align-center">
        <v-sheet width="280" :elevation="1" rounded>
            <v-sheet class="foreground mb-2 mt-4 mx-auto" width="220" height="220" />
            <v-container>
                <v-row>
                    <v-col cols="12" class="text-center">
                        <v-chip label size="large" prepend-icon="mdi-card-bulleted"
                            :text="state.cardId ? state.cardId : '无读卡器或卡片'" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete v-model="state.id" v-model:search="state.searchId" :items="state.items"
                            item-title="id" item-value="id" prepend-inner-icon="mdi-account" label="编号"
                            variant="outlined" density="compact" no-data-text="无可用数据" hide-details auto-select-first />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete v-model="state.name" v-model:search="state.searchName" :items="state.items"
                            item-title="name" item-value="name" prepend-inner-icon="mdi-account" label="姓名"
                            variant="outlined" density="compact" no-data-text="无可用数据" hide-details auto-select-first />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-btn :disabled="!state.cardId" color="primary" variant="flat" text="读取"
                            prepend-icon="mdi-upload" width="100%" @click="onRead" />
                    </v-col>
                    <v-col cols="6">
                        <v-btn :disabled="!state.cardId" color="primary" variant="flat" text="写入"
                            prepend-icon="mdi-download" width="100%" @click="onWrite" />
                    </v-col>
                </v-row>
            </v-container>
        </v-sheet>
    </div>
    <alert-dialog :title="alertDialog.title" :text="alertDialog.message"
        :cancel-button-text="alertDialog.cancelButtonText" :confirm-button-text="alertDialog.confirmButtonText"
        v-model="alertDialog.show" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import StatusBar from '@/components/StatusBar.vue'
import AlertDialog from '@/components/AlertDialog.vue'
import { getUser, listUsers } from '@/network/user'
import { validate } from '@/network/authorization'
import { UserData } from '@/entities'

const props = defineProps<{
    id?: string
}>()

const router = useRouter()
const store = useStore()
const state = reactive({
    items: [] as UserData[],
    id: undefined as string | undefined,
    searchId: undefined as string | undefined,
    name: undefined as string | undefined,
    searchName: undefined as string | undefined,
    cardId: undefined as string | undefined
})
const alertDialog = reactive({
    show: false,
    title: '',
    message: '',
    confirmButtonText: null as string | null,
    cancelButtonText: null as string | null
})
const showLoadingDialog = (message: string) => {
    alertDialog.confirmButtonText = null
    alertDialog.cancelButtonText = null
    alertDialog.message = message
    alertDialog.title = '请稍候'
    alertDialog.show = true
}
const showErrorDialog = (message: string) => {
    alertDialog.message = message
    alertDialog.title = '错误'
    alertDialog.confirmButtonText = '确定'
    alertDialog.cancelButtonText = null
    alertDialog.show = true
}
const showSuccessDialog = (message: string) => {
    alertDialog.message = message
    alertDialog.title = '完成'
    alertDialog.confirmButtonText = '确定'
    alertDialog.cancelButtonText = null
    alertDialog.show = true
}
const loadUserById = async (id: string) => {
    try {
        const userData = await getUser(id)
        state.id = userData.id
        state.name = userData.name
    } catch (error: any) {
        showErrorDialog(error.message)
    }
}
const onRefresh = async () => {
    state.cardId = undefined
    showLoadingDialog('正在检测卡片...')
    try {
        state.cardId = await window.electronApi.checkMifareCard()
        alertDialog.show = false
    } catch (error: any) {
        showErrorDialog('未连接读卡器或未放入卡片')
    }
}
const onRead = async () => {
    showLoadingDialog('正在读取卡片...')
    try {
        const id = await window.electronApi.readMifareCard()
        await loadUserById(id)
        alertDialog.show = false
    } catch (error: any) {
        showErrorDialog(error.message)
    }
}
const onWrite = async () => {
    if (!state.id || !state.name) {
        showErrorDialog('请先设置或读取人员信息')
        return
    }
    showLoadingDialog('正在写入卡片...')
    try {
        await window.electronApi.writeMifareCard(state.id)
        showSuccessDialog('人员信息已写入卡片')
    } catch (error: any) {
        showErrorDialog(error.message)
    }
}
const onConfirm = async () => {
    if (!await validate()) {
        store.commit('clearUserInformation')
        router.push('/login')
        return
    }
}
watch(() => [state.searchId, state.searchName], async ([searchId, searchName]) => {
    try {
        state.items = (await listUsers(
            0,
            3,
            undefined,
            state.name ? state.name : searchName,
            state.id ? state.id : searchId)).content
    } catch (error: any) {
        showErrorDialog(error.message)
    }
}, { immediate: true })
props.id && loadUserById(props.id)
onRefresh()
</script>

<style scoped>
.fill-height-without-status-bar {
    height: calc(100vh - 65px) !important;
}

.foreground {
    mask-image: url('@/assets/nfc.svg');
    -webkit-mask-image: url('@/assets/nfc.svg');
    background-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}
</style>
