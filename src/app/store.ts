import { configureStore } from '@reduxjs/toolkit'
import { websocketApi } from '../features/websocket/websocketApi'

export const store = configureStore({
  reducer: {
    [websocketApi.reducerPath]: websocketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
