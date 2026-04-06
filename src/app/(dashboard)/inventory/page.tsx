'use client';

import { useState } from 'react';
import { Search, Plus, Download, Upload, Package, AlertTriangle, Barcode, MoreVertical } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface Product {
  id: string;
  name: Record<string, string>;
  sku: string;
  barcode?: string;
  category: string;
  unit_type: string;
  retail_price: number;
  wholesale_price?: number;
  wholesale_min_qty: number;
  current_stock: number;
  reorder_level: number;
  is_active: boolean;
  image_url?: string;
}

const mockProducts: Product[] = [
  { id: '1', name: { en: 'Coca Cola', ar: 'كوكا كولا', ku: 'كۆكا كۆلا' }, sku: 'CC-001', barcode: '123456789', category: 'Beverages', unit_type: 'piece', retail_price: 500, wholesale_price: 450, wholesale_min_qty: 10, current_stock: 50, reorder_level: 10, is_active: true },
  { id: '2', name: { en: 'Water Bottle', ar: 'ماء معدني', ku: 'ئاوی ئاوێنە' }, sku: 'WB-002', barcode: '123456790', category: 'Beverages', unit_type: 'piece', retail_price: 250, wholesale_price: 200, wholesale_min_qty: 20, current_stock: 200, reorder_level: 50, is_active: true },
  { id: '3', name: { en: 'Arabic Coffee', ar: 'قهوة عربية', ku: 'قه‌وى عه‌ره‌بی' }, sku: 'AC-003', barcode: '123456791', category: 'Beverages', unit_type: 'piece', retail_price: 1500, wholesale_price: 1300, wholesale_min_qty: 5, current_stock: 30, reorder_level: 5, is_active: true },
  { id: '4', name: { en: 'Labneh', ar: 'لبنة', ku: 'لێبنە' }, sku: 'LB-004', barcode: '123456792', category: 'Dairy', unit_type: 'piece', retail_price: 2000, wholesale_price: 1800, wholesale_min_qty: 6, current_stock: 15, reorder_level: 5, is_active: true },
  { id: '5', name: { en: 'Bread', ar: 'خبز', ku: 'نان' }, sku: 'BR-005', barcode: '123456793', category: 'Bakery', unit_type: 'piece', retail_price: 500, wholesale_price: 400, wholesale_min_qty: 20, current_stock: 100, reorder_level: 20, is_active: true },
  { id: '6', name: { en: 'Dates', ar: 'تمور', ku: 'خەڵوز' }, sku: 'DT-006', barcode: '123456794', category: 'Dry Goods', unit_type: 'piece', retail_price: 5000, wholesale_price: 4500, wholesale_min_qty: 5, current_stock: 25, reorder_level: 5, is_active: true },
  { id: '7', name: { en: 'Vegetable Oil', ar: 'زيت نباتي', ku: 'رووغی ئەنگار' }, sku: 'VO-007', barcode: '123456795', category: 'Oils', unit_type: 'piece', retail_price: 3500, wholesale_price: 3200, wholesale_min_qty: 6, current_stock: 40, reorder_level: 10, is_active: true },
  { id: '8', name: { en: 'Rice', ar: 'أرز', ku: 'برده' }, sku: 'RC-008', barcode: '123456796', category: 'Dry Goods', unit_type: 'piece', retail_price: 2500, wholesale_price: 2200, wholesale_min_qty: 10, current_stock: 80, reorder_level: 15, is_active: true },
];

const categories = ['All', 'Beverages', 'Dairy', 'Bakery', 'Dry Goods', 'Oils'];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    unit_type: 'piece',
    sku: '',
    barcode: '',
    retail_price: 0,
    wholesale_price: 0,
    wholesale_min_qty: 1,
    current_stock: 0,
    reorder_level: 5,
  });

  const filteredProducts = mockProducts.filter(p => {
    const matchesSearch = p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.current_stock < p.reorder_level && p.current_stock > 0;
    if (stockFilter === 'out') matchesStock = p.current_stock === 0;
    if (stockFilter === 'in') matchesStock = p.current_stock >= p.reorder_level;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = mockProducts.filter(p => p.current_stock < p.reorder_level && p.current_stock > 0).length;
  const outOfStockCount = mockProducts.filter(p => p.current_stock === 0).length;

  const cardStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
  };

  const buttonStyle = (primary = false, small = false): React.CSSProperties => ({
    padding: small ? '6px 12px' : '8px 16px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: primary ? '#6C63FF' : '#F5F6F7',
    color: primary ? 'white' : '#2F2F33',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#F5F6F7',
    borderRadius: '16px',
    border: '1px solid transparent',
    outline: 'none',
    fontSize: '14px',
  };

  const categoryButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    fontSize: '14px',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? '#6C63FF' : '#F5F6F7',
    color: isActive ? 'white' : 'rgba(47,47,51,0.6)',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Inventory</h1>
          <p style={{ color: 'rgba(47,47,51,0.6)' }}>Manage your products and stock</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button style={buttonStyle()}>
            <Download size={16} />
            Export
          </button>
          <button style={buttonStyle()}>
            <Upload size={16} />
            Import
          </button>
          <button style={buttonStyle(true)} onClick={() => setAddProductOpen(true)}>
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={32} color="#6C63FF" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{mockProducts.length}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Products</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={32} color="#27AE60" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27AE60' }}>{mockProducts.filter(p => p.is_active).length}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>In Stock</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={32} color="#F39C12" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F39C12' }}>{lowStockCount}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Low Stock</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={32} color="#E74C3C" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#E74C3C' }}>{outOfStockCount}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Out of Stock</p>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.4)' }} />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '40px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={categoryButtonStyle(selectedCategory === cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[{ value: 'all', label: 'All' }, { value: 'in', label: 'In Stock' }, { value: 'low', label: 'Low Stock' }, { value: 'out', label: 'Out of Stock' }].map(filter => (
            <button key={filter.value} onClick={() => setStockFilter(filter.value)} style={categoryButtonStyle(stockFilter === filter.value)}>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: '24px', padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F5F6F7' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Product</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>SKU</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Category</th>
                <th style={{ textAlign: 'right', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Stock</th>
                <th style={{ textAlign: 'center', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderTop: '1px solid #E0E0E0' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#6C63FF' }}>{product.name.en.charAt(0)}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500 }}>{product.name.en}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{product.unit_type}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'monospace' }}>{product.sku}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{product.category}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{formatCurrency(product.retail_price)}</p>
                    {product.wholesale_price && <p style={{ fontSize: '12px', color: '#27AE60' }}>WS: {formatCurrency(product.wholesale_price)}</p>}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: product.current_stock < product.reorder_level ? '#F39C12' : product.current_stock === 0 ? '#E74C3C' : '#2F2F33' }}>{product.current_stock}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>Reorder: {product.reorder_level}</p>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: product.current_stock === 0 ? 'rgba(231,76,60,0.1)' : product.current_stock < product.reorder_level ? 'rgba(243,156,18,0.1)' : 'rgba(39,174,96,0.1)', color: product.current_stock === 0 ? '#E74C3C' : product.current_stock < product.reorder_level ? '#F39C12' : '#27AE60' }}>
                      {product.current_stock === 0 ? 'Out' : product.current_stock < product.reorder_level ? 'Low' : 'In Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button style={{ padding: '8px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Showing {filteredProducts.length} of {mockProducts.length} products</p>
        </div>
      </div>

      {addProductOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Add New Product</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Product Name</label>
                <input style={inputStyle} placeholder="Enter product name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Category</label>
                <select style={inputStyle} value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Unit Type</label>
                <select style={inputStyle} value={newProduct.unit_type} onChange={(e) => setNewProduct({ ...newProduct, unit_type: e.target.value })}>
                  <option value="piece">Piece</option>
                  <option value="carton">Carton</option>
                  <option value="box">Box</option>
                  <option value="kg">Kg</option>
                  <option value="liter">Liter</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>SKU</label>
                <input style={inputStyle} placeholder="SKU001" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Barcode</label>
                <input style={inputStyle} placeholder="Generate or scan" value={newProduct.barcode} onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Retail Price (IQD)</label>
                <input type="number" style={inputStyle} value={newProduct.retail_price} onChange={(e) => setNewProduct({ ...newProduct, retail_price: Number(e.target.value) })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Wholesale Price (IQD)</label>
                <input type="number" style={inputStyle} value={newProduct.wholesale_price} onChange={(e) => setNewProduct({ ...newProduct, wholesale_price: Number(e.target.value) })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Current Stock</label>
                <input type="number" style={inputStyle} value={newProduct.current_stock} onChange={(e) => setNewProduct({ ...newProduct, current_stock: Number(e.target.value) })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Reorder Level</label>
                <input type="number" style={inputStyle} value={newProduct.reorder_level} onChange={(e) => setNewProduct({ ...newProduct, reorder_level: Number(e.target.value) })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button style={{ ...buttonStyle(), flex: 1 }} onClick={() => setAddProductOpen(false)}>Cancel</button>
              <button style={{ ...buttonStyle(true), flex: 1 }} onClick={() => { alert('Product added!'); setAddProductOpen(false); }}>Add Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
