<template>
    <v-dialog persistent max-width="435" :model-value="props.modelValue"
        @update:model-value="emit('update:modelValue', $event)">
        <v-card :title="props.title" :text="props.text" prepend-icon="mdi-alert"
            :class="(!props.cancelButtonText && !props.confirmButtonText) ? 'pb-3' : ''">
            <template #actions v-if="props.cancelButtonText || props.confirmButtonText">
                <v-spacer />
                <v-btn v-if="props.cancelButtonText" prepend-icon="mdi-close-thick"
                    :text="props.cancelButtonText ? props.cancelButtonText : ''"
                    @click="emit('update:modelValue', false)" />
                <v-btn v-if="props.confirmButtonText" prepend-icon="mdi-check-bold"
                    :text="props.confirmButtonText ? props.confirmButtonText : ''" @click="onConfirm" />
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    title?: string,
    text: string,
    cancelButtonText?: string | null,
    confirmButtonText?: string | null,
    modelValue: boolean
}>(), {
    title: '提示',
    cancelButtonText: '取消',
    confirmButtonText: '确定'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void,
    (e: 'confirm'): void,
}>()

const onConfirm = () => {
    emit('confirm')
    emit('update:modelValue', false)
}
</script>
