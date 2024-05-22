<template>
    <v-dialog persistent max-width="400" :model-value="props.modelValue"
        @update:model-value="emit('update:modelValue', $event)">
        <v-form v-model="verified" @submit.prevent="onSubmit">
            <v-card prepend-icon="mdi-pencil" :title="props.title">
                <template #actions>
                    <v-spacer />
                    <v-btn prepend-icon="mdi-close-thick" :text="props.cancelButtonText"
                        @click="emit('update:modelValue', false)" />
                    <v-btn prepend-icon="mdi-content-save" :text="props.submitButtonText" :disabled="!verified"
                        type="submit" />
                </template>
                <v-sheet class="px-6 pt-4">
                    <v-text-field class="pt-2" density="compact" variant="outlined" v-for="header in props.headers"
                        :key="header.key" :label="header.title" :rules="header.nullable ? undefined : rules"
                        v-model="items[header.key]" :messages="header.nullable ? undefined : '必填项'" />
                </v-sheet>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
    title: string,
    headers: { title: string, key: string, nullable?: boolean }[],
    items: any,
    cancelButtonText?: string,
    submitButtonText?: string,
    modelValue: boolean
}>(), {
    cancelButtonText: '取消',
    submitButtonText: '保存'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void,
    (e: 'submit'): void,
}>()

const rules = [
    (value: any) => !!value || '值不可为空'
]
const verified = ref(false)
const onSubmit = () => {
    if (!verified.value) return
    emit('submit')
    emit('update:modelValue', false)
}
</script>
