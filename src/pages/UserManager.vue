<template>
    <status-bar title="人员管理" search-label="搜索人员" v-model:search="search" @add="onAddUser" @refresh="onRefresh" />
    <v-divider />
    <data-table class="fill-height-without-status-bar" :headers="headers" :search="search" :load-items="onLoadItems"
        :show-actions="true">
        <template #actions="{ item }">
            <v-icon class="me-2" size="small"
                @click="onRouteToCardEditorWithUser(item)">mdi-card-bulleted-settings</v-icon>
            <v-icon class="me-2" size="small" @click="onEditUser(item)">mdi-pencil</v-icon>
            <v-icon size="small" @click="onDeleteUser(item)">mdi-delete</v-icon>
        </template>
    </data-table>
    <alert-dialog :title="alertDialog.title" :cancel-button-text="alertDialog.cancelButtonText" confirm-button-text="确定"
        v-model="alertDialog.show" :text="alertDialog.message" @confirm="onConfirm" />
    <form-dialog :title="formDialog.mode == FormMode.Add ? '添加人员' : '编辑人员'" cancel-button-text="取消"
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
import { listUsers, updateUser, addUser, deleteUser } from '@/network/user'
import { UserData } from '@/entities'
import { validate } from '@/network/authorization'
import { useStore } from '@/store'

enum FormMode {
    Add,
    Edit
}

const headers = [
    { title: '编号', key: 'id' },
    { title: '姓名', key: 'name' },
    { title: '密码', key: 'password', nullable: true },
    { title: '性别', key: 'gender', nullable: true },
    { title: '权限', key: 'authorities' },
    { title: '手机', key: 'phone', nullable: true },
    { title: '备注', key: 'description', nullable: true }
]

const store = useStore()
const router = useRouter()
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
    content: null as UserData | null
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
const onAddUser = () => {
    showFormDialog(FormMode.Add, {})
}
const onEditUser = (item: UserData) => {
    showFormDialog(FormMode.Edit, Object.assign({}, item, { password: '' }))
}
const onRouteToCardEditorWithUser = (item: UserData) => {
    router.push({ name: 'card-editor', params: { id: item.id } })
}
const onDeleteUser = (item: UserData) => {
    formDialog.content = item
    alertDialog.title = '删除人员'
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
        const data = await listUsers(page, itemsPerPage, sortBy, search.value)
        return {
            content: data.content.map((item: UserData) => {
                item.authorities = replaceAuthorities(item.authorities)
                item.password = '••••••'
                return item
            }),
            totalElements: data.totalElements
        }
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
    formDialog.content.authorities = replaceAuthoritiesReverse(formDialog.content.authorities)
    if (formDialog.mode == FormMode.Add) {
        try {
            await addUser(formDialog.content)
            onRefresh()
        } catch (e: any) {
            showErrorDialog(e.message)
        }
    } else {
        try {
            await updateUser(formDialog.content)
            onRefresh()
        } catch (e: any) {
            showErrorDialog(e.message)
        }
    }
}
const onConfirm = async () => {
    if (formDialog.content) { // 删除
        try {
            deleteUser(formDialog.content.id)
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
const replaceAuthorities = (authorities: string) => {
    return authorities
        .replace(',', '，')
        .replace('ROLE_USER', '用户')
        .replace('ROLE_ADMIN', '管理员')
        .replace('ROLE_MAINTAINER', '维护员')
}
const replaceAuthoritiesReverse = (authorities: string) => {
    return authorities
        .replace('，', ',')
        .replace('用户', 'ROLE_USER')
        .replace('管理员', 'ROLE_ADMIN')
        .replace('维护员', 'ROLE_MAINTAINER')
}
</script>

<style scoped>
.fill-height-without-status-bar {
    height: calc(100vh - 65px) !important;
}
</style>
