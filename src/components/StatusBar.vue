<template>
    <v-toolbar>
        <v-toolbar-title>{{ props.title }}</v-toolbar-title>
        <v-spacer />
        <v-text-field v-if="props.showSearchBar" class="me-3" density="compact" prepend-inner-icon="mdi-magnify"
            variant="solo-filled" flat hide-details single-line :label="props.searchLabel" :model-value="props.search"
            @update:model-value="emit('update:search', $event)" />
        <v-btn v-if="props.showRefreshButton" icon @click="emit('refresh')">
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn v-if="props.showAddButton" icon @click="emit('add')">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    title: string,
    searchLabel?: string,
    search?: any,
    showSearchBar?: boolean,
    showRefreshButton?: boolean,
    showAddButton?: boolean
}>(), {
    searchLabel: 'Search',
    search: '',
    showSearchBar: true,
    showRefreshButton: true,
    showAddButton: true
})

const emit = defineEmits<{
    (e: 'update:search', value: any): void,
    (e: 'refresh'): void,
    (e: 'add'): void
}>()
</script>
