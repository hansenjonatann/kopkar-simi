import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Example: inside item type
interface Item {
  id: string;
  name: string;
  price: number; // base price (wholesale or retail)
  priceRetail: number;
  priceWholesale: number;
  quantity: number;
  unitType: "retail" | "wholesale";
}

interface ItemsState {
  items: Item[];
}

const initialState: ItemsState = {
  items: [],
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateUnitType: (
      state,
      action: PayloadAction<{ id: string; unitType: "retail" | "wholesale" }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.unitType = action.payload.unitType;
        item.price =
          action.payload.unitType === "retail"
            ? item.priceRetail
            : item.priceWholesale;
      }
    },
  },
});

export const { addItem, updateItemQuantity, removeItem, updateUnitType } =
  itemsSlice.actions;
export default itemsSlice.reducer;
