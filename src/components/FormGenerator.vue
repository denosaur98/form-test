<template>
  <div class="form-generator">
    <h2 v-if="config.title" class="form-title">{{ config.title }}</h2>
    <form @submit.prevent="handleSubmit" class="form-container">
      <FormField
        v-for="field in config.fields"
        :key="field.id"
        :field="field"
        v-model="formData[field.name]"
        @validate="(isValid) => handleValidation(field.name, isValid)"
      >
        <template #[`field.${field.name}`]="{ field: slotField, value, update }">
          <slot :name="`field.${slotField.name}`" :field="slotField" :value="value" :update="update">
          </slot>
        </template>
        <template #[`label.${field.name}`]="{ field: slotField }">
          <slot :name="`label.${slotField.name}`" :field="slotField">
            {{ slotField.label }}
          </slot>
        </template>
      </FormField>
      <div class="form-actions">
        <slot name="actions" :submit="handleSubmit" :cancel="handleCancel" :isValid="formValid">
          <button
            type="submit"
            :disabled="!formValid || isLoading"
            class="btn btn-primary"
          >
            <span v-if="isLoading">Загрузка...</span>
            <span v-else>{{ config.submitText || 'Сохранить' }}</span>
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="btn btn-secondary"
            :disabled="isLoading"
          >
            {{ config.cancelText || 'Отмена' }}
          </button>
        </slot>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import FormField from './FormField.vue';
import type { FormConfig, FormData } from '../types/form';

interface Props {
  config: FormConfig
  initialData?: FormData
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'submit': [data: FormData]
  'cancel': []
  'update:modelValue': [data: FormData]
}>()

const isLoading = ref<boolean>(false)
const formData = reactive<FormData>({})
const fieldValidity = reactive<Record<string, boolean>>({})

function initializeForm() {
  props.config.fields.forEach(field => {
    if (props.initialData && props.initialData[field.name] !== undefined) {
      formData[field.name] = props.initialData[field.name]
    } else {
      switch (field.type) {
        case 'checkbox':
          formData[field.name] = false
          break;
        case 'select':
          formData[field.name] = ''
          break;
        default:
          formData[field.name] = ''
      }
    }
    fieldValidity[field.name] = !field.required
  })
}

const formValid = computed(() => {
  return Object.values(fieldValidity).every(valid => valid)
})

function handleValidation(fieldName: string, isValid: boolean) {
  fieldValidity[fieldName] = isValid
}

async function handleSubmit() {
  if (!formValid.value) return
  
  isLoading.value = true
  
  try {
    emit('submit', { ...formData })
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

function clearForm() {
  props.config.fields.forEach(field => {
    if (props.initialData && props.initialData[field.name] !== undefined) {
      formData[field.name] = props.initialData[field.name]
    } else {
      switch (field.type) {
        case 'checkbox':
          formData[field.name] = false
          break;
        case 'select':
          formData[field.name] = ''
          break;
        default:
          formData[field.name] = ''
      }
    }
    fieldValidity[field.name] = !field.required
  })
  
  emit('cancel')
}

function handleCancel() {
  props.config.fields.forEach(field => {
    if (props.initialData && props.initialData[field.name] !== undefined) {
      formData[field.name] = props.initialData[field.name]
    } else {
      switch (field.type) {
        case 'checkbox':
          formData[field.name] = false
          break;
        case 'select':
          formData[field.name] = ''
          break;
        default:
          formData[field.name] = ''
      }
    }
    fieldValidity[field.name] = !field.required
  })
  
  emit('cancel')
  initializeForm()
}

watch(() => props.initialData, () => {
  initializeForm()
}, { deep: true, immediate: true })

</script>

<style scoped lang="scss">
.form-generator {
  width: 70%;
  padding: 2rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 767px) {
    width: 100%;
    padding: 1rem;
  }
}

.form-title {
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
  font-size: 1.75rem;

  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &-primary {
    background-color: #007bff;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #0056b3;
    }
  }
  
  &-secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #545b62;
    }
  }
}
</style>