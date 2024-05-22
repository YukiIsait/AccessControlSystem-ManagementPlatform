<template>
    <v-data-table-server
        fixed-header no-data-text="无可用数据" items-per-page-text="每页数量"
        loading-text="加载中..." :page-text="'当前页 {0} 至 {1} 条，共 {2} 条'"
        :items-per-page-options="itemsPerPageItems" :search="props.search"
        :loading="state.loading" :items="state.items"
        :items-length="state.itemsLength" :headers="headers"
        :items-per-page="9" @update:options="loadItems">
        <template #item.actions="{ item }">
            <slot name="actions" :item="item" />
        </template>
    </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

const itemsPerPageItems = [
    { value: 9, title: '9' },
    { value: 18, title: '18' },
    { value: 36, title: '36' },
    { value: 72, title: '72' },
    { value: 100, title: '100' }
]

const props = withDefaults(defineProps<{
    headers: any[]
    search: string,
    loadItems: (page: number, itemsPerPage: number, sortBy?: {
        key: string,
        order: string
    }) => Promise<{
        content: any[],
        totalElements: number
    }>,
    showActions?: boolean
}>(), {
    showActions: false
})

const state = reactive({
    items: [] as any[],
    itemsLength: 0,
    loading: true
})

const headers = computed(() => props.showActions ? props.headers.concat({
    title: '操作',
    key: 'actions',
    sortable: false
}) : props.headers)

const loadItems = (options: any) => {
    state.loading = true
    props.loadItems(options.page - 1, options.itemsPerPage, options.sortBy.length ? {
        key: options.sortBy[0].key,
        order: options.sortBy[0].order
    } : undefined).then(data => {
        state.items = data.content
        state.itemsLength = data.totalElements
        state.loading = false
    })
}
</script>
