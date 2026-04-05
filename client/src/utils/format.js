/**
 * Format số tiền sang định dạng VNĐ
 * Ví dụ: 1500000 → "1.500.000 ₫"
 */
export const formatVND = (amount) => {
  if (amount == null || isNaN(amount)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(Math.round(amount))
}

/**
 * Hằng số tỷ giá USD → VNĐ
 * 1 USD ≈ 25,000 VNĐ (có thể cập nhật sau)
 */
export const USD_TO_VND = 25000
