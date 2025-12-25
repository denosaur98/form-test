export type FieldType = 'input' | 'select' | 'checkbox' | 'textarea';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => boolean;
  };
  errorMessage?: string;
}

export interface FormConfig {
  id: string;
  title: string;
  fields: FormField[];
  submitText?: string;
  cancelText?: string;
}

export interface FormData {
  [key: string]: any;
}