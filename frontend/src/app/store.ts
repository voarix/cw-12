import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { usersReducer } from "../features/users/usersSlice.ts";
import { activitiesReducer } from "../features/activities/activitiesSlice.ts";
import { groupsReducer } from "../features/groups/groupsSlice.ts";
import { activitiesAdminReducer } from "../features/admin/activities/activitiesAdminSlice.ts";

const usersPersistConfig = {
  key: "store:users",
  storage,
  whitelist: ["user", "accessToken"],
};

const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, usersReducer),
  activities: activitiesReducer,
  groups: groupsReducer,
  adminActivities: activitiesAdminReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
