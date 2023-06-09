import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const { data } = await axios.get('/tasks');
  return data;
})

export const fetchTags = createAsyncThunk('tasks/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchRemoveTask = createAsyncThunk('tasks/fetchRemoveTask', async (id) =>
  axios.delete(`/tasks/${id}`),
);

export const fetchCompleteTask = createAsyncThunk('tasks/completeTask', async (id) =>
  axios.post(`/tasks/${id}/complete`),
);

export const getTaskById = (id) => axios.get(`/tasks/${id}`);

const initialState = {
  tasks: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: {
    // Получение статей
    [fetchTasks.pending]: (state) => {
      state.tasks.items = [];
      state.tasks.status = 'loading';
    },
    [fetchTasks.fulfilled]: (state, action) => {
      state.tasks.items = action.payload;
      state.tasks.status = 'loaded';
    },
    [fetchTasks.rejected]: (state) => {
      state.tasks.items = [];
      state.tasks.status = 'error';
    },

    // Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },

    // Удаление статьи
    [fetchRemoveTask.pending]: (state, action) => {
      state.tasks.items = state.tasks.items.filter((obj) => obj._id !== action.meta.arg);
    },
  },
});

export const tasksReducer = tasksSlice.reducer;
