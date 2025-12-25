<template>
  <div class="contact-form-page">
    <FormGenerator
      :config="formConfig"
      :initial-data="initialData"
      @submit="handleSubmit"
      @cancel="handleCancel"
    >
      <template #field.email="{ field, value, update }">
        <div class="custom-email-field">
          <input
            :id="field.id"
            type="email"
            :value="value"
            @input="(e) => update((e.target as HTMLInputElement).value)"
            placeholder="Введите ваш email"
            class="custom-input"
          />
          <span class="email-hint">@example.com</span>
        </div>
      </template>
      <template #actions="{ submit, cancel, isValid }">
        <div class="custom-actions">
          <button
            @click="submit"
            :disabled="!isValid"
            class="custom-submit-btn"
          >
            Отправить сообщение
          </button>
          <button
            @click="cancel"
            class="custom-cancel-btn"
          >
            Очистить форму
          </button>
        </div>
      </template>
    </FormGenerator>
    <div v-if="submittedData" class="submission-result">
      <h3>Отправленные данные:</h3>
      <pre>{{ submittedData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormGenerator from '../components/FormGenerator.vue';
import type { FormConfig } from '../types/form';

const submittedData = ref<any>(null)

const formConfig: FormConfig = {
  id: 'contact',
  title: 'Форма обратной связи',
  fields: [
    {
      id: 'name',
      name: 'name',
      label: 'Имя',
      type: 'input',
      required: true,
      placeholder: 'Введите ваше имя',
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email',
      type: 'input',
      required: true,
      placeholder: 'email@example.com',
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      errorMessage: 'Введите корректный email',
    },
    {
      id: 'subject',
      name: 'subject',
      label: 'Тема',
      type: 'select',
      required: true,
      options: [
        { label: 'Вопрос', value: 'question' },
        { label: 'Предложение', value: 'suggestion' },
        { label: 'Другое', value: 'other' },
      ],
    },
    {
      id: 'message',
      name: 'message',
      label: 'Сообщение',
      type: 'textarea',
      required: true,
      placeholder: 'Введите ваше сообщение...',
      validation: {
        minLength: 10,
        maxLength: 1000
      }
    },
    {
      id: 'newsletter',
      name: 'newsletter',
      label: 'Подписаться на рассылку',
      type: 'checkbox'
    }
  ],
  submitText: 'Отправить',
  cancelText: 'Очистить'
}

const initialData = {
  newsletter: true,
}

function handleSubmit(data: any) {
  submittedData.value = data
  
  setTimeout(() => {
    alert('Форма успешно отправлена!')
  }, 500)
}

function handleCancel() {
  location.reload()
}
</script>

<style scoped lang="scss">
.contact-form-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 3rem 3rem;

  @media (max-width: 767px) {
    padding: 0 1rem;
  }
}

.custom-email-field {
  display: flex;
  align-items: center;
  
  .custom-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem 0 0 0.25rem;
    border-right: none;
  }
  
  .email-hint {
    padding: 0.5rem 0.75rem;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 0 0.25rem 0.25rem 0;
    color: #666;
  }
}

.custom-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  .custom-submit-btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  .custom-cancel-btn {
    padding: 0.75rem 1.5rem;
    background-color: transparent;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    
    &:hover {
      background-color: #f8f9fa;
    }
  }
}

.submission-result {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border-left: 4px solid #007bff;
  
  h3 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  pre {
    background-color: white;
    padding: 1rem;
    border-radius: 0.25rem;
    overflow-x: auto;
  }
}
</style>