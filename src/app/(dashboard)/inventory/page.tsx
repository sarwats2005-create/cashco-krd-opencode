'use client';

import { useState } from 'react';
import { Search, Plus, Download, Package, AlertTriangle, Trash2, Edit2 } from 'lucide-react';
import { useInventoryStore } from '@/store/inventoryStore';
import { showToast } from '@/store/toastStore';
import { formatCurrency } from '@/utils/currency';

const categories = ['All', 'Beverages', 'Dairy', 'Bakery', 'Dry Goods', 'Oils'];

export default function InventoryPage() {
  const { items, addItem, updateItem, deleteItem } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [form, setForm] = useState({
    name: '', category: 'Beverages', unit_type: 'piece', sku: '', barcode: '',
    retail_price: 0, wholesale_price: 0, wholesale_min_qty: 1, current_stock: 0, reorder_level: 5,
  });

  const filteredItems = items.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.current_stock < p.reorder_level && p.current_stock > 0;
    if (stockFilter === 'out') matchesStock = p.current_stock === 0;
    if (stockFilter === 'in') matchesStock = p.current_stock >= p.reorder_level;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = items.filter(p => p.current_stock < p.reorder_level && p.current_stock > 0).length;
  const outOfStockCount = items.filter(p => p.current_stock === 0).length;

  const handleAdd = () => {
    if (!form.name || !form.sku) { showToast('Please fill in required fields', 'error'); return; }
    addItem({ ...form, is_active: true });
    showToast('Product added successfully!', 'success');
    setAddModalOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedItem) return;
    updateItem(selectedItem.id, form);
    showToast('Product updated!', 'success');
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    deleteItem(selectedItem.id);
    showToast('Product deleted!', 'success');
    setDeleteModalOpen(false);
  };

  const openEdit = (item: any) => {
    setSelectedItem(item);
    setForm({ name: item.name, category: item.category, unit_type: item.unit_type, sku: item.sku, barcode: item.barcode, retail_price: item.retail_price, wholesale_price: item.wholesale_price, wholesale_min_qty: item.wholesale_min_qty, current_stock: item.current_stock, reorder_level: item.reorder_level });
    setEditModalOpen(true);
  };

  const openDelete = (item: any) => { setSelectedItem(item); setDeleteModalOpen(true); };
  const resetForm = () => setForm({ name: '', category: 'Beverages', unit_type: 'piece', sku: '', barcode: '', retail_price: 0, wholesale_price: 0, wholesale_min_qty: 1, current_stock: 0, reorder_level: 5 });

  const cardStyle: React.CSSProperties = { padding: '16px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', backgroundColor: '#F5F6F7', borderRadius: '16px', border: '1px solid transparent', outline: 'none', fontSize: '14px' };
  const btn = (primary = false): React.CSSProperties => ({ padding: '10px 16px', borderRadius: '14px', border: 'none', backgroundColor: primary ? '#6C63FF' : '#F5F6F7', color: primary ? 'white' : '#2F2F33', fontSize: '14px', fontWeight: 500, cursor: 'pointer' });
  const filterBtn = (active: boolean): React.CSSProperties => ({ padding: '6px 14px', fontSize: '14px', borderRadius: '999px', border: 'none', cursor: 'pointer', backgroundColor: active ? '#6C63FF' : '#F5F6F7', color: active ? 'white' : 'rgba(47,47,51,0.6)', whiteSpace: 'nowrap' });

  const Modal = ({ open, onClose, title, children }: any) => open ? (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>{title}</h2>
        {children}
      </div>
    </div>
  ) : null;

  const Field = ({ label, children }: any) => <div style={{ marginBottom: '12px' }}><label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>{label}</label>{children}</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div><h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Inventory</h1><p style={{ color: 'rgba(47,47,51,0.6)' }}>Manage your products and stock</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={btn()} onClick={() => { const csv = items.map(i => `${i.name},${i.sku},${i.category},${i.retail_price},${i.current_stock}`).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'inventory.csv'; a.click(); showToast('Exported!', 'success'); }}><Download size={16} /> Export</button>
          <button style={btn(true)} onClick={() => { resetForm(); setAddModalOpen(true); }}><Plus size={16} /> Add Product</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><Package size={32} color="#6C63FF" /><div><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{items.length}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Products</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><Package size={32} color="#27AE60" /><div><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27AE60' }}>{items.filter(p => p.is_active).length}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>In Stock</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><AlertTriangle size={32} color="#F39C12" /><div><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F39C12' }}>{lowStockCount}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Low Stock</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><AlertTriangle size={32} color="#E74C3C" /><div><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#E74C3C' }}>{outOfStockCount}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Out of Stock</p></div></div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}><Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.4)' }} /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} /></div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>{categories.map(cat => <button key={cat} onClick={() => setSelectedCategory(cat)} style={filterBtn(selectedCategory === cat)}>{cat}</button>)}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{[{ v: 'all', l: 'All' }, { v: 'in', l: 'In Stock' }, { v: 'low', l: 'Low Stock' }, { v: 'out', l: 'Out of Stock' }].map(f => <button key={f.v} onClick={() => setStockFilter(f.v)} style={filterBtn(stockFilter === f.v)}>{f.l}</button>)}</div>
      </div>

      <div style={{ ...cardStyle, marginTop: '24px', padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F5F6F7' }}><tr><th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Product</th><th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>SKU</th><th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Category</th><th style={{ textAlign: 'right', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Price</th><th style={{ textAlign: 'right', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Stock</th><th style={{ textAlign: 'center', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Status</th><th style={{ textAlign: 'center', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Actions</th></tr></thead>
            <tbody>{filteredItems.map((product) => (
              <tr key={product.id} style={{ borderTop: '1px solid #E0E0E0' }}>
                <td style={{ padding: '16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontWeight: 'bold', color: '#6C63FF' }}>{product.name.charAt(0)}</span></div><div><p style={{ fontSize: '14px', fontWeight: 500 }}>{product.name}</p><p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{product.unit_type}</p></div></div></td>
                <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'monospace' }}>{product.sku}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{product.category}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}><p style={{ fontSize: '14px', fontWeight: 500 }}>{formatCurrency(product.retail_price)}</p>{product.wholesale_price > 0 && <p style={{ fontSize: '12px', color: '#27AE60' }}>WS: {formatCurrency(product.wholesale_price)}</p>}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}><p style={{ fontSize: '14px', fontWeight: 500, color: product.current_stock < product.reorder_level ? '#F39C12' : product.current_stock === 0 ? '#E74C3C' : '#2F2F33' }}>{product.current_stock}</p><p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>Reorder: {product.reorder_level}</p></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: product.current_stock === 0 ? 'rgba(231,76,60,0.1)' : product.current_stock < product.reorder_level ? 'rgba(243,156,18,0.1)' : 'rgba(39,174,96,0.1)', color: product.current_stock === 0 ? '#E74C3C' : product.current_stock < product.reorder_level ? '#F39C12' : '#27AE60' }}>{product.current_stock === 0 ? 'Out' : product.current_stock < product.reorder_level ? 'Low' : 'In Stock'}</span></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}><button onClick={() => openEdit(product)} style={{ padding: '8px', borderRadius: '10px', border: 'none', backgroundColor: '#F5F6F7', cursor: 'pointer' }}><Edit2 size={16} /></button><button onClick={() => openDelete(product)} style={{ padding: '8px', borderRadius: '10px', border: 'none', backgroundColor: 'rgba(231,76,60,0.1)', cursor: 'pointer' }}><Trash2 size={16} color="#E74C3C" /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #E0E0E0' }}><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Showing {filteredItems.length} of {items.length} products</p></div>
      </div>

      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Product">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <Field label="Product Name *"><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="SKU *"><input style={inputStyle} value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></Field>
          <Field label="Category"><select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
          <Field label="Barcode"><input style={inputStyle} value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} /></Field>
          <Field label="Retail Price"><input type="number" style={inputStyle} value={form.retail_price} onChange={e => setForm({ ...form, retail_price: Number(e.target.value) })} /></Field>
          <Field label="Wholesale Price"><input type="number" style={inputStyle} value={form.wholesale_price} onChange={e => setForm({ ...form, wholesale_price: Number(e.target.value) })} /></Field>
          <Field label="Current Stock"><input type="number" style={inputStyle} value={form.current_stock} onChange={e => setForm({ ...form, current_stock: Number(e.target.value) })} /></Field>
          <Field label="Reorder Level"><input type="number" style={inputStyle} value={form.reorder_level} onChange={e => setForm({ ...form, reorder_level: Number(e.target.value) })} /></Field>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}><button style={{ ...btn(), flex: 1 }} onClick={() => setAddModalOpen(false)}>Cancel</button><button style={{ ...btn(true), flex: 1 }} onClick={handleAdd}>Add Product</button></div>
      </Modal>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Product">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <Field label="Product Name"><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Category"><select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
          <Field label="Retail Price"><input type="number" style={inputStyle} value={form.retail_price} onChange={e => setForm({ ...form, retail_price: Number(e.target.value) })} /></Field>
          <Field label="Wholesale Price"><input type="number" style={inputStyle} value={form.wholesale_price} onChange={e => setForm({ ...form, wholesale_price: Number(e.target.value) })} /></Field>
          <Field label="Current Stock"><input type="number" style={inputStyle} value={form.current_stock} onChange={e => setForm({ ...form, current_stock: Number(e.target.value) })} /></Field>
          <Field label="Reorder Level"><input type="number" style={inputStyle} value={form.reorder_level} onChange={e => setForm({ ...form, reorder_level: Number(e.target.value) })} /></Field>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}><button style={{ ...btn(), flex: 1 }} onClick={() => setEditModalOpen(false)}>Cancel</button><button style={{ ...btn(true), flex: 1 }} onClick={handleEdit}>Save Changes</button></div>
      </Modal>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Product">
        <p style={{ marginBottom: '16px', color: 'rgba(47,47,51,0.6)' }}>Are you sure you want to delete <strong>{selectedItem?.name}</strong>?</p>
        <div style={{ display: 'flex', gap: '8px' }}><button style={{ ...btn(), flex: 1 }} onClick={() => setDeleteModalOpen(false)}>Cancel</button><button style={{ ...btn(true), flex: 1, backgroundColor: '#E74C3C' }} onClick={handleDelete}>Delete</button></div>
      </Modal>
    </div>
  );
}
