import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationState {
  items: NotificationItem[];
}

const initialState: NotificationState = { items: [] };

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      state.items.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.read = true;
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});


export const { addNotification, markAsRead, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;