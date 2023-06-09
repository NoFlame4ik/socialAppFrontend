import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import { tasksReducer } from './slices/tasks';
import { authReducer } from './slices/auth';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
  },
  // Disable serializable check
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
