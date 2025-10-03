import { authApi } from "@/hooks/useAuth";
import { notesApi } from "@/hooks/useNotes";
import authSlice from "@/slice/authSlice"; 
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    authSlice: authSlice,        
    [authApi.reducerPath]: authApi.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, notesApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
