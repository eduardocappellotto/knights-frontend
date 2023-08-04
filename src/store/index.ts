// store/knightStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { IKnight } from '../interfaces/knight.interface';
import { ref } from 'vue';

const API_BASE_URL = 'https://knight-server-production.up.railway.app';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  count?: number;
  data?: T;
}

export const useKnightStore = defineStore('knight', () => {

  const knightsList = ref<IKnight[]>([])
  const selectedKnight = ref<IKnight>()
  const loading = ref(false)
  const error = ref('')

  async function fetchKnights(filter = "") {

    loading.value = true;
    error.value = '';

    try {
      const { data } = await axios.get<IKnight[]>(`${API_BASE_URL}/knights`, {
        params: {
          filter: filter
        }
      });
      knightsList.value = data.data;
    } catch (e) {
      error.value = 'Failed to fetch knights.';
      knightsList.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchKnightById(id: string): IKnight {

    loading.value = true;
    error.value = '';

    try {
      const { data: response } = await axios.get<ApiResponse<IKnight[]>>(`${API_BASE_URL}/knights/${id}`);
      return response.data;
    } catch (e) {
      error.value = 'Failed to fetch knights.';
      knightsList.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function createKnight(knight: IKnight) {
    loading.value = true;
    error.value = '';

    try {
      await axios.post<IKnight>(`${API_BASE_URL}/knights`, knight);
      await fetchKnights();
    } catch (e) {
      error.value = 'Failed to create knight.';
    } finally {
      loading.value = false;
    }
  };

  async function updateKnight(id: string, knight: IKnight) {
    loading.value = true;
    error.value = '';

    try {
      await axios.put<IKnight>(`${API_BASE_URL}/knights/${id}`, knight);
      await fetchKnights();
    } catch (e) {
      error.value = 'Failed to update knight.';
    } finally {
      loading.value = false;
    }
  };

  async function deleteKnight(id: string) {
    loading.value = true;
    error.value = '';

    try {
      await axios.delete<IKnight>(`${API_BASE_URL}/knights/${id}`);
      await fetchKnights();
    } catch (e) {
      error.value = 'Failed to delete knight.';
    } finally {
      loading.value = false;
    }
  }

  return { knightsList, selectedKnight, error, loading, fetchKnights, createKnight, updateKnight, deleteKnight, fetchKnightById }
})
