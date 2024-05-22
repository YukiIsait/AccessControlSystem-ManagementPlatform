<template>
    <status-bar title="设备管理" search-label="搜索设备" v-model:search="search" @add="onAddDevice" @refresh="onRefresh" />
    <v-divider />
    <data-table class="fill-height-without-status-bar" :headers="headers" :search="search" :load-items="onLoadItems"
        :show-actions="true">
        <template #actions="{ item }">
            <v-icon class="me-2" size="small" @click="onEditDevice(item)">mdi-pencil</v-icon>
            <v-icon size="small" @click="onDeleteDevice(item)">mdi-delete</v-icon>
        </template>
    </data-table>
    <alert-dialog :title="alertDialog.title" :cancel-button-text="alertDialog.cancelButtonText" confirm-button-text="确定"
        v-model="alertDialog.show" :text="alertDialog.message" @confirm="onConfirm" />
    <form-dialog :title="formDialog.mode == FormMode.Add ? '添加设备' : '编辑设备'" cancel-button-text="取消"
        submit-button-text="保存" :headers="headers" v-model:items="formDialog.content" v-model="formDialog.show"
        @submit="onSubmit" />
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import StatusBar from '@/components/StatusBar.vue'
import DataTable from '@/components/DataTable.vue'
import AlertDialog from '@/components/AlertDialog.vue'
import FormDialog from '@/components/FormDialog.vue'
import { listDevices, updateDevice, addDevice, deleteDevice } from '@/network/device'
import { DeviceData } from '@/entities'
import { validate } from '@/network/authorization'
import { useStore } from '@/store'

enum FormMode {
    Add,
    Edit
}

const headers = [
    { title: '设备编号', key: 'id' },
    { title: '设备名称', key: 'name' },
    { title: '设备描述', key: 'description', nullable: true }
]

const router = useRouter()
const store = useStore()
const search = ref('')
const alertDialog = reactive({
    show: false,
    title: '',
    cancelButtonText: null as string | null,
    message: ''
})
const formDialog = reactive({
    show: false,
    mode: FormMode.Add,
    content: null as DeviceData | null
})
const showErrorDialog = (message: string) => {
    alertDialog.title = '错误'
    alertDialog.cancelButtonText = null
    alertDialog.message = message
    alertDialog.show = true
}
const showFormDialog = (mode: FormMode, content: any) => {
    formDialog.mode = mode
    formDialog.content = content
    formDialog.show = true
}
const onRefresh = () => {
    search.value = String(Date.now())
    nextTick(() => {
        search.value = ''
    })
}
const onAddDevice = () => {
    showFormDialog(FormMode.Add, {})
}
const onEditDevice = (item: DeviceData) => {
    showFormDialog(FormMode.Edit, Object.assign({}, item))
}
const onDeleteDevice = (item: DeviceData) => {
    formDialog.content = item
    alertDialog.title = '删除设备'
    alertDialog.cancelButtonText = '取消'
    alertDialog.message = `确定要删除 "${item.name}" 吗？`
    alertDialog.show = true
}
const onLoadItems = async (page: number, itemsPerPage: number, sortBy?: {
    key: string,
    order: string
}): Promise<{
    content: any[],
    totalElements: number
}> => {
    try {
        return await listDevices(page, itemsPerPage, sortBy, search.value)
    } catch (e: any) {
        showErrorDialog(e.message)
        return {
            content: [],
            totalElements: 0
        }
    }
}
const onSubmit = async () => {
    if (!formDialog.content) {
        return
    }
    if (formDialog.mode == FormMode.Add) {
        try {
            await addDevice(formDialog.content)
            onRefresh()
        } catch (e: any) {
            showErrorDialog(e.message)
        }
    } else {
        try {
            await updateDevice(formDialog.content)
            onRefresh()
        } catch (e: any) {
            showErrorDialog(e.message)
        }
    }
}
const onConfirm = async () => {
    if (formDialog.content) { // 删除
        try {
            deleteDevice(formDialog.content.id)
            onRefresh()
        } catch (e: any) {
            showErrorDialog(e.message)
        }
    } else { // 其他
        if (!await validate()) {
            store.commit('clearUserInformation')
            router.push('/login')
            return
        }
    }
}
</script>

<style scoped>
.fill-height-without-status-bar {
    height: calc(100vh - 65px) !important;
}
</style>
