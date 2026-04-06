'use client';

import { useState } from 'react';
import { Search, Scan, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
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
    const existingItem = items.find(i => i.itemId === product.id);
    const isWholesale = existingItem && existingItem.quantity >= product.wholesale_min_qty;
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

  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    height: 'calc(100vh - 140px)',
  };

  const searchCardStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px 10px 40px',
    backgroundColor: '#F5F6F7',
    borderRadius: '14px',
    border: '1px solid transparent',
    outline: 'none',
    fontSize: '14px',
  };

  const categoryButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 16px',
    fontSize: '14px',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? '#6C63FF' : '#F5F6F7',
    color: isActive ? 'white' : 'rgba(47,47,51,0.6)',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  });

  const productGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    overflowY: 'auto',
    flex: 1,
  };

  const productCardStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    cursor: 'pointer',
    border: 'none',
  };

  const cartStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '340px',
  };

  const cartItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '14px',
    backgroundColor: '#F5F6F7',
  };

  const primaryButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#6C63FF',
    color: 'white',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', flex: 1, gap: '24px', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={searchCardStyle}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.4)' }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={searchInputStyle}
                />
              </div>
              <button style={{ padding: '10px 16px', borderRadius: '14px', border: 'none', backgroundColor: '#F5F6F7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <Scan size={16} />
                Scan
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={categoryButtonStyle(selectedCategory === cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginTop: '16px' }}>
            <div style={productGridStyle}>
              {filteredProducts.map((product) => (
                <button key={product.id} onClick={() => handleAddToCart(product)} style={productCardStyle}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', backgroundColor: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6C63FF' }}>{product.name.en.charAt(0)}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#2F2F33', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name.en}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>Stock: {product.current_stock}</p>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6C63FF' }}>{formatCurrency(product.retail_price)}</p>
                  </div>
                  {product.current_stock < 10 && (
                    <div style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#E74C3C', color: 'white', borderRadius: '8px', fontSize: '10px', display: 'inline-block' }}>Low Stock</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={cartStyle}>
            <div style={{ padding: '0 0 16px 0', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} color="#6C63FF" />
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Order Summary</h2>
              <div style={{ marginLeft: 'auto', padding: '4px 8px', backgroundColor: '#6C63FF', color: 'white', borderRadius: '12px', fontSize: '12px' }}>{items.length}</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
              {items.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(47,47,51,0.6)' }}>
                  <ShoppingCart size={48} />
                  <p>Cart is empty</p>
                  <p style={{ fontSize: '14px' }}>Click products to add</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map((item) => (
                    <div key={item.itemId} style={cartItemStyle}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#2F2F33', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#6C63FF' }}>{formatCurrency(item.lineTotal)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)} style={{ padding: '4px', borderRadius: '8px', border: 'none', backgroundColor: '#F5F6F7', cursor: 'pointer' }}>
                          <Minus size={16} />
                        </button>
                        <span style={{ width: '32px', textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)} style={{ padding: '4px', borderRadius: '8px', border: 'none', backgroundColor: '#F5F6F7', cursor: 'pointer' }}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: '16px 0 0 0', borderTop: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Subtotal</span>
                <span style={{ fontWeight: 500 }}>{formatCurrency(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Discount</span>
                <span style={{ fontWeight: 500, color: '#E74C3C' }}>0 IQD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              
              <button style={primaryButtonStyle} disabled={items.length === 0} onClick={() => setCheckoutOpen(true)}>
                Checkout
              </button>
              
              {items.length > 0 && (
                <button onClick={clearCart} style={{ width: '100%', textAlign: 'center', fontSize: '14px', color: '#E74C3C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Checkout</h2>
            <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#F5F6F7', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: '#6C63FF' }}>{formatCurrency(total)}</span>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {['cash', 'card', 'digital', 'split'].map(method => (
                  <button key={method} onClick={() => setPaymentMethod(method)} style={{ ...categoryButtonStyle(paymentMethod === method), padding: '12px' }}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button style={primaryButtonStyle} onClick={() => { alert('Payment processed!'); clearCart(); setCheckoutOpen(false); }}>
              Confirm Payment
            </button>
            <button onClick={() => setCheckoutOpen(false)} style={{ width: '100%', marginTop: '8px', padding: '12px', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
