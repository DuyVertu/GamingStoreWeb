import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      toggleItem: (product) => {
        const { items } = get()
        const exists = items.find(item => item.id === product.id)
        
        if (exists) {
          set({ items: items.filter(item => item.id !== product.id) })
        } else {
          set({ items: [...items, product] })
        }
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId)
      },
      
      clearWishlist: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
