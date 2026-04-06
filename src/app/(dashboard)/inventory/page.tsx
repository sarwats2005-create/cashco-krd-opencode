'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Download, Upload, Filter, MoreVertical, Package, AlertTriangle, Barcode } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayBadge } from '@/components/ui/clay/ClayBadge';
import { ClayModal } from '@/components/ui/clay/ClayModal';
import { ClayInput } from '@/components/ui/clay/ClayInput';
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
const units = ['piece', 'carton', 'box', 'kg', 'liter'];

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
    const matchesSearch = p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.current_stock < p.reorder_level && p.current_stock > 0;
    if (stockFilter === 'out') matchesStock = p.current_stock === 0;
    if (stockFilter === 'in') matchesStock = p.current_stock >= p.reorder_level;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = mockProducts.filter(p => p.current_stock < p.reorder_level && p.current_stock > 0).length;
  const outOfStockCount = mockProducts.filter(p => p.current_stock === 0).length;

  const handleAddProduct = () => {
    setAddProductOpen(false);
    setNewProduct({
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
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F2F33]">Inventory</h1>
          <p className="text-[#2F2F33]/60">Manage your products and stock</p>
        </div>
        <div className="flex gap-2">
          <ClayButton variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </ClayButton>
          <ClayButton variant="ghost" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </ClayButton>
          <ClayButton variant="primary" size="sm" onClick={() => setAddProductOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </ClayButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ClayCard className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-[#6C63FF]" />
            <div>
              <p className="text-2xl font-bold">{mockProducts.length}</p>
              <p className="text-sm text-[#2F2F33]/60">Total Products</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-[#27AE60]" />
            <div>
              <p className="text-2xl font-bold text-[#27AE60]">{mockProducts.filter(p => p.is_active).length}</p>
              <p className="text-sm text-[#2F2F33]/60">In Stock</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-[#F39C12]" />
            <div>
              <p className="text-2xl font-bold text-[#F39C12]">{lowStockCount}</p>
              <p className="text-sm text-[#2F2F33]/60">Low Stock</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-[#E74C3C]" />
            <div>
              <p className="text-2xl font-bold text-[#E74C3C]">{outOfStockCount}</p>
              <p className="text-sm text-[#2F2F33]/60">Out of Stock</p>
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Filters */}
      <ClayCard className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2F2F33]/40" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6F7] rounded-[14px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-sm rounded-[999px] whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#F5F6F7] text-[#2F2F33]/60 hover:bg-[#E0E0E0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'in', label: 'In Stock' },
              { value: 'low', label: 'Low Stock' },
              { value: 'out', label: 'Out of Stock' },
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setStockFilter(filter.value)}
                className={`px-3 py-1.5 text-sm rounded-[10px] whitespace-nowrap transition-colors ${
                  stockFilter === filter.value
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#F5F6F7] text-[#2F2F33]/60'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </ClayCard>

      {/* Products Table */}
      <ClayCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F6F7]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#2F2F33]/60">Product</th>
                <th className="text-left p-4 text-sm font-medium text-[#2F2F33]/60">SKU</th>
                <th className="text-left p-4 text-sm font-medium text-[#2F2F33]/60">Category</th>
                <th className="text-right p-4 text-sm font-medium text-[#2F2F33]/60">Price</th>
                <th className="text-right p-4 text-sm font-medium text-[#2F2F33]/60">Stock</th>
                <th className="text-center p-4 text-sm font-medium text-[#2F2F33]/60">Status</th>
                <th className="text-center p-4 text-sm font-medium text-[#2F2F33]/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-[#E0E0E0] hover:bg-[#F5F6F7]/50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-[#6C63FF]/10 flex items-center justify-center">
                        <span className="font-bold text-[#6C63FF]">{product.name.en.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name.en}</p>
                        <p className="text-xs text-[#2F2F33]/60">{product.unit_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono">{product.sku}</td>
                  <td className="p-4 text-sm">{product.category}</td>
                  <td className="p-4 text-right">
                    <p className="font-medium text-sm">{formatCurrency(product.retail_price)}</p>
                    {product.wholesale_price && (
                      <p className="text-xs text-[#27AE60]">WS: {formatCurrency(product.wholesale_price)}</p>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <p className={`font-medium text-sm ${product.current_stock < product.reorder_level ? 'text-[#F39C12]' : ''} ${product.current_stock === 0 ? 'text-[#E74C3C]' : ''}`}>
                      {product.current_stock}
                    </p>
                    <p className="text-xs text-[#2F2F33]/60">Reorder: {product.reorder_level}</p>
                  </td>
                  <td className="p-4 text-center">
                    {product.current_stock === 0 ? (
                      <ClayBadge variant="danger">Out</ClayBadge>
                    ) : product.current_stock < product.reorder_level ? (
                      <ClayBadge variant="warning">Low</ClayBadge>
                    ) : (
                      <ClayBadge variant="success">In Stock</ClayBadge>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-2 rounded-[10px] hover:bg-[#F5F6F7]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[#2F2F33]/60">
            <Package className="w-12 h-12 mb-4" />
            <p>No products found</p>
          </div>
        )}

        <div className="p-4 border-t border-[#E0E0E0] flex justify-between items-center">
          <p className="text-sm text-[#2F2F33]/60">
            Showing {filteredProducts.length} of {mockProducts.length} products
          </p>
        </div>
      </ClayCard>

      {/* Add Product Modal */}
      <ClayModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        title="Add New Product"
        className="w-full max-w-lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Product Name</label>
              <ClayInput
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
              >
                <option value="">Select category</option>
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Unit Type</label>
              <select
                value={newProduct.unit_type}
                onChange={(e) => setNewProduct({ ...newProduct, unit_type: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">SKU</label>
              <ClayInput
                placeholder="SKU001"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Barcode</label>
              <ClayInput
                placeholder="Generate or scan"
                value={newProduct.barcode}
                onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Retail Price (IQD)</label>
              <ClayInput
                type="number"
                placeholder="0"
                value={newProduct.retail_price}
                onChange={(e) => setNewProduct({ ...newProduct, retail_price: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Wholesale Price (IQD)</label>
              <ClayInput
                type="number"
                placeholder="0"
                value={newProduct.wholesale_price}
                onChange={(e) => setNewProduct({ ...newProduct, wholesale_price: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Current Stock</label>
              <ClayInput
                type="number"
                placeholder="0"
                value={newProduct.current_stock}
                onChange={(e) => setNewProduct({ ...newProduct, current_stock: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reorder Level</label>
              <ClayInput
                type="number"
                placeholder="5"
                value={newProduct.reorder_level}
                onChange={(e) => setNewProduct({ ...newProduct, reorder_level: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <ClayButton
              variant="ghost"
              className="flex-1"
              onClick={() => setAddProductOpen(false)}
            >
              Cancel
            </ClayButton>
            <ClayButton
              variant="primary"
              className="flex-1"
              onClick={handleAddProduct}
            >
              Add Product
            </ClayButton>
          </div>
        </div>
      </ClayModal>
    </div>
  );
}
