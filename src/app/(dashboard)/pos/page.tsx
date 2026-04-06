'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Scan, Plus, Minus, X, ShoppingCart, Trash2 } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayBadge } from '@/components/ui/clay/ClayBadge';
import { ClayModal } from '@/components/ui/clay/ClayModal';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/currency';

interface Product {
  id: string;
  name: Record<string, string>;
  image_url?: string;
  retail_price: number;
  wholesale_price?: number;
  wholesale_min_qty: number;
  current_stock: number;
  category: string;
}

const mockProducts: Product[] = [
  { id: '1', name: { en: 'Coca Cola', ar: 'كوكا كولا', ku: 'كۆكا كۆلا' }, retail_price: 500, wholesale_price: 450, wholesale_min_qty: 10, current_stock: 50, category: 'Beverages' },
  { id: '2', name: { en: 'Water Bottle', ar: 'ماء معدني', ku: 'ئاوی ئاوێنە' }, retail_price: 250, wholesale_price: 200, wholesale_min_qty: 20, current_stock: 200, category: 'Beverages' },
  { id: '3', name: { en: 'Arabic Coffee', ar: 'قهوة عربية', ku: 'قه‌وى عه‌ره‌بی' }, retail_price: 1500, wholesale_price: 1300, wholesale_min_qty: 5, current_stock: 30, category: 'Beverages' },
  { id: '4', name: { en: 'Labneh', ar: 'لبنة', ku: 'لێبنە' }, retail_price: 2000, wholesale_price: 1800, wholesale_min_qty: 6, current_stock: 15, category: 'Dairy' },
  { id: '5', name: { en: 'Bread', ar: 'خبز', ku: 'نان' }, retail_price: 500, wholesale_price: 400, wholesale_min_qty: 20, current_stock: 100, category: 'Bakery' },
  { id: '6', name: { en: 'Dates', ar: 'تمور', ku: 'خەڵوز' }, retail_price: 5000, wholesale_price: 4500, wholesale_min_qty: 5, current_stock: 25, category: 'Dry Goods' },
  { id: '7', name: { en: 'Vegetable Oil', ar: 'زيت نباتي', ku: 'رووغی ئەنگار' }, retail_price: 3500, wholesale_price: 3200, wholesale_min_qty: 6, current_stock: 40, category: 'Oils' },
  { id: '8', name: { en: 'Rice', ar: ' أرز', ku: 'برده' }, retail_price: 2500, wholesale_price: 2200, wholesale_min_qty: 10, current_stock: 80, category: 'Dry Goods' },
];

const categories = ['All', 'Beverages', 'Dairy', 'Bakery', 'Dry Goods', 'Oils'];

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCartStore();

  const filteredProducts = mockProducts.filter(p => {
    const matchesSearch = p.name.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    const isWholesale = items.find(i => i.itemId === product.id && i.quantity >= product.wholesale_min_qty);
    addItem({
      itemId: product.id,
      name: product.name.en,
      quantity: 1,
      unitPrice: isWholesale ? (product.wholesale_price || product.retail_price) : product.retail_price,
      priceType: isWholesale ? 'wholesale' : 'retail',
      discount: 0,
    });
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQty);
    }
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Product Grid - 70% */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search & Categories */}
        <ClayCard className="p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2F2F33]/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6F7] rounded-[14px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
              />
            </div>
            <ClayButton variant="ghost" size="sm" className="hidden sm:flex">
              <Scan className="w-4 h-4 mr-2" />
              Scan
            </ClayButton>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
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
        </ClayCard>

        {/* Products Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <motion.button
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddToCart(product)}
                className="text-left"
              >
                <ClayCard className="p-3 h-full flex flex-col">
                  {/* Product Image/Icon */}
                  <div className="w-full aspect-square rounded-[16px] bg-[#6C63FF]/10 flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-[#6C63FF]">
                      {product.name.en.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#2F2F33] truncate">
                      {product.name.en}
                    </p>
                    <p className="text-xs text-[#2F2F33]/60 mt-0.5">
                      Stock: {product.current_stock}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mt-2">
                    <p className="font-bold text-[#6C63FF]">
                      {formatCurrency(product.retail_price)}
                    </p>
                    {product.wholesale_price && (
                      <p className="text-xs text-[#27AE60]">
                        Wholesale: {formatCurrency(product.wholesale_price)}
                      </p>
                    )}
                  </div>

                  {/* Low Stock Warning */}
                  {product.current_stock < 10 && (
                    <ClayBadge variant="danger" size="sm" className="mt-2">
                      Low Stock
                    </ClayBadge>
                  )}
                </ClayCard>
              </motion.button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-[#2F2F33]/60">
              <Search className="w-12 h-12 mb-4" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart - 30% */}
      <ClayCard className="w-full lg:w-[340px] flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b border-[#E0E0E0]">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#6C63FF]" />
            <h2 className="font-semibold">Order Summary</h2>
            <ClayBadge variant="accent">{items.length}</ClayBadge>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          <AnimatePresence>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#2F2F33]/60">
                <ShoppingCart className="w-12 h-12 mb-2" />
                <p>Cart is empty</p>
                <p className="text-sm">Click products to add</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <motion.div
                    key={item.itemId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 p-2 rounded-[14px] bg-[#F5F6F7]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#2F2F33] truncate">
                        {item.name}
                      </p>
                      {item.priceType === 'wholesale' && (
                        <ClayBadge variant="success" size="sm">Wholesale</ClayBadge>
                      )}
                      <p className="text-sm font-medium text-[#6C63FF]">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                        className="p-1 rounded-[8px] bg-[#F5F6F7] hover:bg-[#E0E0E0]"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                        className="p-1 rounded-[8px] bg-[#F5F6F7] hover:bg-[#E0E0E0]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart Footer */}
        <div className="p-4 border-t border-[#E0E0E0] space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#2F2F33]/60">Subtotal</span>
            <span className="font-medium">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#2F2F33]/60">Discount</span>
            <span className="font-medium text-[#E74C3C]">0 IQD</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          
          <ClayButton
            variant="primary"
            className="w-full py-3"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </ClayButton>
          
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="w-full text-center text-sm text-[#E74C3C] hover:underline"
            >
              Clear Cart
            </button>
          )}
        </div>
      </ClayCard>

      {/* Checkout Modal */}
      <ClayModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title="Checkout"
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-[16px] bg-[#F5F6F7]">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#6C63FF]">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {['cash', 'card', 'digital', 'split'].map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-[14px] text-sm font-medium transition-colors ${
                    paymentMethod === method
                      ? 'bg-[#6C63FF] text-white'
                      : 'bg-[#F5F6F7] text-[#2F2F33]'
                  }`}
                >
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <ClayButton
            variant="primary"
            className="w-full py-3"
            onClick={() => {
              alert('Payment processed successfully!');
              clearCart();
              setCheckoutOpen(false);
            }}
          >
            Confirm Payment
          </ClayButton>
        </div>
      </ClayModal>
    </div>
  );
}
