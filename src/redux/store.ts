import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/placeholder'; // Ajustado para o caminho correto

const store = configureStore({
  reducer: rootReducer,
});

export default store;
