import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const { items } = get()
        const productId = product._id || product.id
        const existingItem = items.find(item => (item._id || item.id) === productId)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              (item._id || item.id) === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },
      
      removeItem: (targetId) => {
        set({ items: get().items.filter(item => (item._id || item.id) !== targetId) })
      },
      
      updateQuantity: (targetId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(targetId)
        } else {
          set({
            items: get().items.map(item =>
              (item._id || item.id) === targetId ? { ...item, quantity } : item
            )
          })
        }
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.salePrice || item.price
          return total + (price * item.quantity)
        }, 0)
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
