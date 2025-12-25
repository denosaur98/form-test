<template>
  <div class="form-field" :class="{ 'has-error': error }">
    <label :for="field.id" class="form-label">
      {{ field.label }}
      <span v-if="field.required" class="required">*</span>
    </label>
    <slot name="field" :field="field" :value="value" :update="updateValue">
      <component
        :is="getFieldComponent"
        :id="field.id"
        v-model="localValue"
        v-bind="getFieldAttributes"
        @input="handleInput"
        @change="handleChange"
      >
        <template v-if="field.type === 'select' && field.options">
          <option value="" disabled>{{ field.placeholder || 'Выберите опцию' }}</option>
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </template>
      </component>
    </slot>
    <Transition name="fade">
      <div v-if="error" class="error-message">{{ error }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FormField } from '../types/form';

interface Props {
  field: FormField
  modelValue: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'validate': [isValid: boolean]
}>()

const localValue = ref(props.modelValue)
const error = ref<string>('')

const getFieldComponent = computed(() => {
  const components: Record<string, string> = {
    input: 'input',
    select: 'select',
    checkbox: 'input',
    textarea: 'textarea',
  }
  return components[props.field.type]
})
const getFieldAttributes = computed(() => {
  const attrs: any = {
    class: 'form-control',
    placeholder: props.field.placeholder,
    disabled: props.field.disabled,
    readonly: props.field.readonly
  }

  if (props.field.type === 'checkbox') {
    attrs.type = 'checkbox'
  } else if (props.field.type === 'input') {
    attrs.type = 'text'
  }

  return attrs
})

function updateValue(newValue: any) {
  localValue.value = newValue
  handleInput({ target: { value: newValue } })
}

function validate(value: any): boolean {
  error.value = ''

  if (props.field.required && (value === undefined || value === null || value === '')) {
    error.value = 'Это поле обязательно для заполнения'
    return false
  }

  if (props.field.validation) {
    const { validation } = props.field
    
    if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      error.value = props.field.errorMessage || 'Неверный формат'
      return false
    }
    
    if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
      error.value = `Минимальная длина: ${validation.minLength} символов`
      return false
    }
    
    if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
      error.value = `Максимальная длина: ${validation.maxLength} символов`
      return false
    }
    
    if (validation.custom && !validation.custom(value)) {
      error.value = props.field.errorMessage || 'Неверное значение'
      return false
    }
  }

  return true
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value: any
  
  if (props.field.type === 'checkbox') {
    value = target.checked
  } else {
    value = target.value
  }

  localValue.value = value
  const isValid = validate(value)
  emit('update:modelValue', value)
  emit('validate', isValid)
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.field.type === 'checkbox' ? target.checked : target.value
  validate(value)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
  validate(newValue)
})

watch(() => props.field, () => {
  validate(localValue.value)
}, { deep: true })
</script>

<style scoped lang="scss">
.form-field {
  min-height: 92px;
  
  &.has-error {
    .form-control {
      border-color: #dc3545;
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  
  .required {
    color: #dc3545;
  }
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
  
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  &[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
  }
  
  &[disabled],
  &[readonly] {
    background-color: #e9ecef;
    opacity: 1;
  }
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

select.form-control {
  height: 38px;
}
</style>