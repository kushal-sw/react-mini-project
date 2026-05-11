import { create } from "zustand";

export const useShoppingStore = create((set) => ({
  items: {}, // Grouped items from plan: { Produce: [...], Protein: [...], ... }
  customItems: [], // Array of manually added items
  checkedIds: [], // Array of IDs of checked items

  setItems: (groupedItems) => set({ items: groupedItems }),

  addCustomItem: (name) =>
    set((state) => ({
      customItems: [
        ...state.customItems,
        { id: `custom-${Date.now()}`, name, amount: null, unit: "" },
      ],
    })),

  removeItem: (id) =>
    set((state) => {
      // Find and remove in custom items
      const newCustom = state.customItems.filter((i) => i.id !== id);
      // Find and remove in generated items
      const newItems = { ...state.items };
      for (const cat in newItems) {
        newItems[cat] = newItems[cat].filter((i) => i.id !== id);
      }
      return { customItems: newCustom, items: newItems };
    }),

  toggleCheck: (id) =>
    set((state) => ({
      checkedIds: state.checkedIds.includes(id)
        ? state.checkedIds.filter((cid) => cid !== id)
        : [...state.checkedIds, id],
    })),

  clearAll: () => set({ items: {}, customItems: [], checkedIds: [] }),
}));
