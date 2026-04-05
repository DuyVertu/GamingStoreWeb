// Mock users for frontend testing
export const mockUsers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'user@gmail.com',
    password: '123456',
    phone: '0901234567',
    role: 'user',
    createdAt: '2025-12-15T10:30:00Z',
    addresses: [
      {
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Nguyễn Huệ',
        city: 'TP.HCM',
        zipCode: '70000',
        isDefault: true
      }
    ]
  },
  {
    id: '2',
    name: 'Trần Gaming Owner',
    email: 'owner@gmail.com',
    password: '123456',
    phone: '0912345678',
    role: 'owner',
    createdAt: '2025-11-01T08:00:00Z',
    addresses: [
      {
        fullName: 'Trần Gaming Owner',
        phone: '0912345678',
        address: '456 Lê Lợi',
        city: 'TP.HCM',
        zipCode: '70000',
        isDefault: true
      }
    ]
  }
];

// Mock customers for owner management page
export const mockCustomers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'user@gmail.com',
    phone: '0901234567',
    role: 'user',
    createdAt: '2025-12-15T10:30:00Z',
    totalOrders: 5,
    totalSpent: 1250
  },
  {
    id: '3',
    name: 'Lê Thị B',
    email: 'lethib@gmail.com',
    phone: '0923456789',
    role: 'user',
    createdAt: '2026-01-05T14:20:00Z',
    totalOrders: 3,
    totalSpent: 890
  },
  {
    id: '4',
    name: 'Phạm Minh C',
    email: 'phammc@gmail.com',
    phone: '0934567890',
    role: 'user',
    createdAt: '2026-01-20T09:15:00Z',
    totalOrders: 8,
    totalSpent: 3200
  },
  {
    id: '5',
    name: 'Hoàng Đức D',
    email: 'hoangdd@gmail.com',
    phone: '0945678901',
    role: 'user',
    createdAt: '2026-02-10T16:45:00Z',
    totalOrders: 1,
    totalSpent: 199
  },
  {
    id: '6',
    name: 'Vũ Thanh E',
    email: 'vuthe@gmail.com',
    phone: '0956789012',
    role: 'user',
    createdAt: '2026-02-28T11:00:00Z',
    totalOrders: 12,
    totalSpent: 5600
  },
  {
    id: '7',
    name: 'Đặng Quốc F',
    email: 'dangqf@gmail.com',
    phone: '0967890123',
    role: 'user',
    createdAt: '2026-03-05T08:30:00Z',
    totalOrders: 0,
    totalSpent: 0
  }
];

export default mockUsers;
