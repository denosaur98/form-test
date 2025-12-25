import { createStore } from 'vuex';
import type { FormData } from '../types/form';

export interface FormsState {
  formsData: Record<string, FormData>;
  submittedForms: Array<{
    id: string;
    data: FormData;
    timestamp: number;
  }>;
}

export default createStore({
	state: () => ({
    formsData: {},
    submittedForms: []
  }),

	mutations: {
    SET_FORM_DATA(state: any, { formId, data }: FormData) {
      state.formsData[formId] = { ...data };
    },
    
    ADD_SUBMITTED_FORM(state: any, { formId, data }: FormData) {
      state.submittedForms.push({
        id: formId,
        data: { ...data },
        timestamp: Date.now(),
      });
    },
    
    CLEAR_FORM_DATA(state: any, formId: string) {
      delete state.formsData[formId];
    },
  },

	actions: {
    saveFormData({ commit }: any, { formId, data }: FormData) {
      commit('SET_FORM_DATA', { formId, data });
      commit('ADD_SUBMITTED_FORM', { formId, data });
    },
    
    clearFormData({ commit }: any, formId: string) {
      commit('CLEAR_FORM_DATA', formId);
    },
  }
})