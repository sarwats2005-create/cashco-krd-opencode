'use client';

import { useState } from 'react';
import { Search, Scan, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useInventoryStore } from '@/store/inventoryStore';
import { useVaultStore } from '@/store/vaultStore';
import { showToast } from '@/store/toastStore';
import { formatCurrency } from '@/utils/currency';

const categories = ['All', 'Beverages', 'Dairy', 'Bakery', 'Dry Goods', 'Oils'];

export default function POSPage() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { items: products, removeStock } = useInventoryStore();
  const { vaults, addTransaction } = useVaultStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashGiven, setCashGiven] = useState(0);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory && p.is_active;
  });

  const handleAddToCart = (product: any) => {
    if (product.current_stock < 1) { showToast('Out of stock!', 'error'); return; }
    const existing = items.find(i => i.itemId === product.id);
    if (existing && existing.quantity >= product.current_stock) { showToast('Not enough stock!', 'error'); return; }
    const isWholesale = existing && existing.quantity >= product.wholesale_min_qty;
    addItem({
      itemId: product.id, name: product.name, quantity: 1,
      unitPrice: isWholesale ? product.wholesale_price : product.retail_price,
      priceType: isWholesale ? 'wholesale' : 'retail', discount: 0,
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) { showToast('Cart is empty!', 'error'); return; }
    const activeVault = vaults.find(v => v.status === 'open');
    if (!activeVault) { showToast('No active vault! Open a vault first.', 'error'); return; }
    setCheckoutOpen(true);
    setCashGiven(total);
  };

  const confirmPayment = () => {
    const activeVault = vaults.find(v => v.status === 'open');
    if (!activeVault) return;

    items.forEach(item => {
      removeStock(item.itemId, item.quantity);
      addTransaction({
        vaultId: activeVault.id, type: 'credit', amount: item.lineTotal,
        category: 'Sales', description: `Sale: ${item.name} x${item.quantity}`,
        performedBy: 'Cashier', date: new Date().toISOString(),
      });
    });

    setLastSale({ items: [...items], total, paymentMethod, date: new Date() });
    clearCart();
    setCheckoutOpen(false);
    setReceiptOpen(true);
    showToast('Payment successful!', 'success');
  };

  const change = Math.max(0, cashGiven - total);

  const cardStyle: React.CSSProperties = { padding: '16px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', backgroundColor: '#F5F6F7', borderRadius: '16px', border: '1px solid transparent', outline: 'none', fontSize: '14px' };
  const filterBtn = (active: boolean): React.CSSProperties => ({ padding: '6px 14px', fontSize: '14px', borderRadius: '999px', border: 'none', cursor: 'pointer', backgroundColor: active ? '#6C63FF' : '#F5F6F7', color: active ? 'white' : 'rgba(47,47,51,0.6)', whiteSpace: 'nowrap' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'flex', flex: 1, gap: '24px', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}><Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.4)' }} /><input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} /></div>
              <button style={{ padding: '10px 16px', borderRadius: '14px', border: 'none', backgroundColor: '#F5F6F7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><Scan size={16} /> Scan</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>{categories.map(cat => <button key={cat} onClick={() => setSelectedCategory(cat)} style={filterBtn(selectedCategory === cat)}>{cat}</button>)}</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', marginTop: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {filteredProducts.map((product) => (
                <button key={product.id} onClick={() => handleAddToCart(product)} style={{ padding: '12px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', textAlign: 'left', border: 'none', cursor: 'pointer' }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', backgroundColor: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}><span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6C63FF' }}>{product.name.charAt(0)}</span></div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#2F2F33', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                  <p style={{ fontSize: '12px', color: product.current_stock < 10 ? '#E74C3C' : 'rgba(47,47,51,0.6)' }}>Stock: {product.current_stock}</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6C63FF', marginTop: '4px' }}>{formatCurrency(product.retail_price)}</p>
                  {product.current_stock < 10 && product.current_stock > 0 && <span style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#F39C12', color: 'white', borderRadius: '8px', fontSize: '10px', display: 'inline-block' }}>Low</span>}
                  {product.current_stock === 0 && <span style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#E74C3C', color: 'white', borderRadius: '8px', fontSize: '10px', display: 'inline-block' }}>Out</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '340px' }}>
            <div style={{ padding: '0 0 16px 0', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} color="#6C63FF" /><h2 style={{ fontSize: '16px', fontWeight: 600 }}>Order Summary</h2>
              <div style={{ marginLeft: 'auto', padding: '4px 8px', backgroundColor: '#6C63FF', color: 'white', borderRadius: '12px', fontSize: '12px' }}>{items.length}</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
              {items.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(47,47,51,0.6)' }}><ShoppingCart size={48} /><p>Cart is empty</p><p style={{ fontSize: '14px' }}>Click products to add</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map((item) => (
                    <div key={item.itemId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '14px', backgroundColor: '#F5F6F7' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#2F2F33', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#6C63FF' }}>{formatCurrency(item.lineTotal)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button onClick={() => updateQuantity(item.itemId, item.quantity - 1)} style={{ padding: '4px', borderRadius: '8px', border: 'none', backgroundColor: '#F5F6F7', cursor: 'pointer' }}><Minus size={16} /></button>
                        <span style={{ width: '32px', textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)} style={{ padding: '4px', borderRadius: '8px', border: 'none', backgroundColor: '#F5F6F7', cursor: 'pointer' }}><Plus size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 0 0 0', borderTop: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Subtotal</span><span style={{ fontWeight: 500 }}>{formatCurrency(total)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Discount</span><span style={{ fontWeight: 500, color: '#E74C3C' }}>0 IQD</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}><span>Total</span><span>{formatCurrency(total)}</span></div>
              <button style={{ width: '100%', padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: '#6C63FF', color: 'white', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }} disabled={items.length === 0} onClick={handleCheckout}>Checkout</button>
              {items.length > 0 && <button onClick={clearCart} style={{ width: '100%', textAlign: 'center', fontSize: '14px', color: '#E74C3C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear Cart</button>}
            </div>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Checkout</h2>
            <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#F5F6F7', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}><span>Total</span><span style={{ color: '#6C63FF' }}>{formatCurrency(total)}</span></div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>{['cash', 'card', 'digital', 'split'].map(method => <button key={method} onClick={() => setPaymentMethod(method)} style={{ ...filterBtn(paymentMethod === method), padding: '12px' }}>{method.charAt(0).toUpperCase() + method.slice(1)}</button>)}</div>
            </div>
            {paymentMethod === 'cash' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Cash Given</label>
                <input type="number" style={inputStyle} value={cashGiven} onChange={e => setCashGiven(Number(e.target.value))} />
                {cashGiven >= total && <p style={{ marginTop: '8px', fontSize: '14px', color: '#27AE60' }}>Change: {formatCurrency(change)}</p>}
              </div>
            )}
            <button style={{ width: '100%', padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: '#27AE60', color: 'white', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }} onClick={confirmPayment}>Confirm Payment</button>
            <button onClick={() => setCheckoutOpen(false)} style={{ width: '100%', marginTop: '8px', padding: '12px', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
          </div>
        </div>
      )}

      {receiptOpen && lastSale && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '350px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Receipt</h2>
              <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{lastSale.date.toLocaleString()}</p>
            </div>
            <div style={{ borderTop: '1px dashed #E0E0E0', borderBottom: '1px dashed #E0E0E0', padding: '12px 0', marginBottom: '12px' }}>
              {lastSale.items.map((item: any) => (
                <div key={item.itemId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px' }}>{item.name} x{item.quantity}</span>
                  <span style={{ fontSize: '14px' }}>{formatCurrency(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}><span>Total</span><span style={{ color: '#6C63FF' }}>{formatCurrency(lastSale.total)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '16px' }}><span>Payment</span><span>{lastSale.paymentMethod}</span></div>
            <button style={{ width: '100%', padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: '#6C63FF', color: 'white', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => setReceiptOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
