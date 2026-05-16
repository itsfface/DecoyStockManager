import { create } from 'zustand';
import { axiosInstance } from '../utils/axios.js';
import toast from 'react-hot-toast';

// Helper to get today's date in YYYY-MM-DD
const getToday = () => new Date().toISOString().split('T')[0];

export const useInventoryStore = create((set) => ({
  // State
  products: [],
  selectedDate: getToday(),
  drafts: {}, // { "YYYY-MM-DD": { "SKU": quantity } }
  loading: false,
  submitting: false,

  // Actions
  setSelectedDate: (date) => set({ selectedDate: date }),

  updateDraft: (sku, quantity) => set((state) => {
    const numQty = quantity === '' ? '' : Math.max(0, parseInt(quantity, 10) || 0);

    return {
      drafts: {
        ...state.drafts,
        [state.selectedDate]: {
          ...(state.drafts[state.selectedDate] || {}),
          [sku]: numQty,
        },
      },
    };
  }),

  clearDraftsForDate: (date) => set((state) => {
    const newDrafts = { ...state.drafts };
    delete newDrafts[date];
    return { drafts: newDrafts };
  }),

  fetchProducts: async () => {
    set({ loading: true });
    try {
      // 1. We alias the axios 'data' to 'responseBody' to avoid confusion
      const { data: responseBody } = await axiosInstance.get('/inventory/get-inventory');

      // 2. Access the array sent by your backend
      const inventoryRecords = responseBody.data;

      // 3. Check if records exist, then grab the 'items' from the first record (index 0)
      if (Array.isArray(inventoryRecords) && inventoryRecords.length > 0) {
        const latestRecord = inventoryRecords[0];

        // 4. Store the items array in your state
        set({ products: latestRecord.items });
      } else {
        // Fallback if the array is empty
        set({ products: [] });
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load products.");
    } finally {
      set({ loading: false });
    }
  },

  fetchInventoryByDate: async (date) => {
    set({ loading: true });

    try {
      const { data } = await axiosInstance.get(
        `/inventory?date=${date}`
      );

      console.log("fetchInventoryByDate:", data);

      // ✅ FIX: correct path to items
      const items = data?.data?.[0]?.items || [];

      if (items.length > 0) {
        const preloadedDraft = {};

        items.forEach((item) => {
          // ✅ safe access
          const sku = item?.product?.SKU || item?.SKU;

          if (sku) {
            preloadedDraft[sku] = item.quantity || 0;
          }
        });

        set((state) => ({
          drafts: {
            ...state.drafts,
            [date]: preloadedDraft,
          },
        }));
      } else {
        // optional: clear drafts if no data
        set((state) => ({
          drafts: {
            ...state.drafts,
            [date]: {},
          },
        }));
      }
    } catch (error) {
      if (error?.response?.status !== 404) {
        toast.error(
          error?.response?.data?.message || "Error fetching history."
        );
      }
    } finally {
      set({ loading: false });
    }
  },

  submitInventory: async () => {
    // Access current state directly from the store since we aren't using 'get'
    const state = useInventoryStore.getState();
    const { products, drafts, selectedDate } = state;
    const currentDraft = drafts[selectedDate] || {};

    const items = products.map((item) => {
      const sku = item.product.SKU;

      // 👉 if edited use draft, else use existing quantity
      const quantity =
        currentDraft[sku] !== undefined
          ? Number(currentDraft[sku])
          : item.quantity;

      return {
        SKU: sku,
        quantity,
      };
    });

    set({ submitting: true });
    try {
      const { data } = await axiosInstance.post('/inventory/update-quantity', {
        date: state.selectedDate,
        items,
      });

      toast.success(data?.message || "Inventory saved successfully!");
      state.clearDraftsForDate(state.selectedDate);

      await useInventoryStore.getState().fetchInventoryByDate(state.selectedDate);

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save inventory.");
    } finally {
      set({ submitting: false });
    }
  },
}));