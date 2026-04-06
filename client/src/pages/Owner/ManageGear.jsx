import { useState, useEffect } from 'react'
import { categories } from '../../data/products'
import { formatVND } from '../../utils/format'
import api from '../../services/api'
import './ManageGear.css'

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  salePrice: '',
  category: '',
  brand: '',
  image: '',
  stock: '',
}

function ManageGear() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(emptyProduct)
  const [isLoading, setIsLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null) // { id, name }

  // 1. Lấy danh sách sản phẩm từ CSDL khi load trang
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/products')
      setProducts(res.data.data) // Theo API trả về { success: true, data: [...] }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData(emptyProduct)
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice || '',
      category: product.category,
      brand: product.brand,
      image: product.image,
      stock: product.stock,
    })
    setShowModal(true)
  }

  // 3. Gọi API Xóa Sản phẩm
  const handleDelete = async (productId) => {
    try {
      console.log('Deleting product:', productId)
      await api.delete(`/products/${productId}`)
      setProducts(products.filter((p) => p._id !== productId))
      setConfirmDelete(null)
    } catch (error) {
      console.error('Lỗi khi xóa:', error.response || error)
      alert('Xóa thất bại: ' + (error.response?.data?.message || error.message))
      setConfirmDelete(null)
    }
  }

  // 2. Gọi API Lưu Hoặc Sửa
  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
    }

    try {
      if (editingProduct) {
        // Cập nhật (PUT)
        const res = await api.put(`/products/${editingProduct._id}`, submitData)
        setProducts(products.map((p) => (p._id === editingProduct._id ? res.data.data : p)))
      } else {
        // Thêm mới (POST)
        const res = await api.post('/products', submitData)
        setProducts([res.data.data, ...products])
      }
      setShowModal(false)
    } catch (error) {
      console.error('Lỗi khi lưu:', error)
      alert('Không thể lưu sản phẩm. Vui lòng thử lại!')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="manage-gear">
      {/* Toolbar */}
      <div className="manage-gear-toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="🔍 Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>
          ➕ Thêm sản phẩm
        </button>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6">
                  <div className="table-empty">
                    <div className="table-empty-icon">⏳</div>
                    <p>Đang tải dữ liệu từ máy chủ...</p>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="table-empty">
                    <div className="table-empty-icon">📦</div>
                    <p>Không tìm thấy sản phẩm nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="table-product">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="table-product-img"
                      />
                      <div>
                        <div className="table-product-name">{product.name}</div>
                        <div className="table-product-brand">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">
                      {categories.find((c) => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td>
                    <span className="table-price">
                      {formatVND(product.salePrice || product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="table-price-sale">{formatVND(product.price)}</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`stock-badge ${product.stock <= 10 ? 'stock-low' : 'stock-ok'}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    ⭐ {product.rating || 0} ({product.reviewCount || 0})
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn"
                        title="Sửa"
                        onClick={() => handleEdit(product)}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        title="Xóa"
                        onClick={() => setConfirmDelete({ id: product._id, name: product.name })}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal ... (Giữ nguyên y hệt Form trước đây, chỉ thay cơ chế call api) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? '✏️ Sửa sản phẩm (DB)' : '➕ Thêm sản phẩm mới (DB)'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Logitech G Pro X Superlight 2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-input"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết sản phẩm..."
                    rows="3"
                    style={{ resize: 'vertical', minHeight: '80px' }}
                    required
                  />
                </div>

                <div className="modal-row">
                  <div className="form-group">
                    <label className="form-label">Giá (VNĐ)</label>
                    <input
                      type="number"
                      className="form-input"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="vd: 1500000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giá sale (VNĐ)</label>
                    <input
                      type="number"
                      className="form-input"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      placeholder="Để trống nếu không sale"
                    />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="form-group">
                    <label className="form-label">Danh mục</label>
                    <select
                      className="form-input"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thương hiệu</label>
                    <input
                      type="text"
                      className="form-input"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="VD: Logitech"
                      required
                    />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="form-group">
                    <label className="form-label">Link ảnh (URL)</label>
                    <input
                      type="text"
                      className="form-input"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tồn kho</label>
                    <input
                      type="number"
                      className="form-input"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingProduct ? 'Cập nhật' : 'Lưu Tới Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">🗑️ Xác nhận xóa</h3>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                Bạn có chắc muốn xóa sản phẩm <strong style={{ color: '#fff' }}>"{confirmDelete.name}"</strong>?
              </p>
              <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '8px' }}>
                ⚠️ Hành động này không thể hoàn tác!
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#ef4444', color: '#fff' }}
                onClick={() => handleDelete(confirmDelete.id)}
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageGear
