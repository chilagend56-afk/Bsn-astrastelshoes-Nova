import React, { useState, useEffect } from 'react';
import { 
  Users, ShoppingBag, Package, TrendingUp, Bell, Search, 
  Menu, Shield, LogOut, ChevronRight, CheckCircle2, XCircle, Plus, Edit, Trash2,
  BarChart3, Settings, ClipboardList, HelpCircle, ShieldAlert
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';



export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  
  // Mobile responsive sidebar toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Real data state
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  // Search/Filters
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersFilter, setOrdersFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Platform configs
  const [systemSettings, setSystemSettings] = useState({
    commission: 5,
    maintenanceMode: false,
    siteName: 'Bsn-astrastelshoes',
    tagline: 'Feel Good. Spend Smart.',
    contactEmail: 'Astrastelshoes01@gmail.com',
    whatsappNumber: '+2349155410448',
    deliveryCost: 1500,
    logoUrl: '',
    currency: '₦',
    taxRate: 7.5,
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    aboutUsText: ''
  });

  // Add/Edit Product State for Admin
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'Heels',
    price: 0,
    originalPrice: 0,
    image: '',
    specs: '',
    note: ''
  });
  const [productSearch, setProductSearch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Set up real-time sync with firestore
  const fetchData = async () => {
    try {
      const { data: pData } = await supabase.from('products').select('*');
      if (pData) {
        setProductsCount(pData.length);
        setProducts(pData);
      }
      
      const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (oData) {
        setOrdersCount(oData.length);
        setAllOrders(oData);
        setRecentOrders(oData.slice(0, 5));
      }

      const { data: sData } = await supabase.from('settings').select('*').eq('id', 'system_config').single();
      if (sData) {
        setSystemSettings({
          ...systemSettings,
          siteName: sData.site_name || '',
          deliveryCost: sData.delivery_cost || 0,
          contactEmail: sData.contact_email || '',
          whatsappNumber: sData.whatsapp_number || '',
          deliveryLocation: sData.delivery_location || '',
          maintenanceMode: sData.maintenance_mode || false,
          logoUrl: sData.logo_url || '',
          tagline: sData.tagline || ''
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProductRating = async (productId: string) => {
    const newRating = window.prompt("Enter new product rating (e.g., 4.5):");
    if (newRating) {
      const parsedRating = parseFloat(newRating);
      if (!isNaN(parsedRating)) {
        try {
          await supabase.from('products').update({ rating: parsedRating }).eq('id', productId); fetchData();
        } catch (err) {
          console.error("Error updating rating:", err);
          alert("Failed to update rating.");
        }
      }
    }
  };

  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPassword) return;
    try {
      const { error } = await supabase.auth.updateUser({ password: newAdminPassword });
      if (error) throw error;
      alert('Password updated successfully!');
      setNewAdminPassword('');
    } catch (error: any) {
      if (error.message && error.message.includes('requires-recent-login')) {
         alert("For security reasons, please log out and log back in before changing your password.");
      } else {
         alert("Error updating password: " + error.message);
      }
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: '',
      category: 'Heels',
      price: 0,
      image: '',
      specs: '',
      note: ''
    });
    setShowProductForm(true);
  };

  const handleOpenEditProduct = (product: any) => {
    setEditingProduct(product);
                          setProductForm({
                            name: product.name || '',
                            brand: product.brand || '',
                            category: product.category || 'Heels',
                            price: product.price || 0,
                            originalPrice: product.original_price || product.originalPrice || 0,
                            image: product.image || '',
                            specs: product.specs || '',
                            note: product.note || ''
                          });
    setShowProductForm(true);
  };

  const handleSaveProductAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productPayload = {
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        price: Number(productForm.price),
        original_price: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        image: productForm.image,
        specs: productForm.specs,
        // updated_at: new Date().toISOString() // removed as column doesn't exist
      };

      if (editingProduct) {
        // Update product
        await supabase.from('products').update(productPayload).eq('id', editingProduct.id); fetchData();
        alert('Product updated successfully!');
      } else {
        // Create product
        await supabase.from('products').insert([productPayload]); fetchData();
        alert('Product added successfully!');
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error saving product as admin:", err);
      alert("Error saving product");
    }
  };

  const handleDeleteProductAdmin = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await supabase.from('products').delete().eq('id', id); fetchData();
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId); fetchData();
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await supabase.from('orders').delete().eq('id', orderId); fetchData();
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('settings').upsert({ 
        id: 'system_config', 
        site_name: systemSettings.siteName,
        delivery_cost: systemSettings.deliveryCost,
        contact_email: systemSettings.contactEmail,
        whatsapp_number: systemSettings.whatsappNumber,
        delivery_location: systemSettings.deliveryLocation,
        maintenance_mode: systemSettings.maintenanceMode,
        logo_url: systemSettings.logoUrl,
        tagline: systemSettings.tagline
      }); fetchData();
      alert('System configuration saved successfully!');
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings");
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const stats = [
    { label: 'Total Products', value: productsCount, icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Total Orders', value: ordersCount, icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Total Visitors', value: '1,234', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Logo />
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-gray-500 hover:text-dark hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <XCircle size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:block w-full md:w-64 bg-white border-r border-gray-100 flex flex-col md:min-h-screen sticky md:top-0 z-40 shrink-0
      `}>
        <div className="hidden md:flex p-6 border-b border-gray-100 items-center justify-between">
          <Logo />
        </div>
        
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Menu</div>
          
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { 
                  setActiveTab(tab.id); 
                  setShowProductForm(false);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left ${
                  activeTab === tab.id && !showProductForm
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:h-screen md:overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-4 px-4 md:px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-dark capitalize">
            {showProductForm ? (editingProduct ? 'Edit Product' : 'Add Product') : `Admin ${activeTab}`}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-primary transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-sm text-sm md:text-base">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-dark leading-tight">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          
          {showProductForm ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-2xl mx-auto">
               <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
               <form onSubmit={handleSaveProductAdmin} className="space-y-4 text-left">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Brand (Optional)</label>
                      <input type="text" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary bg-white">
                        <option>Heels</option>
                        <option>Flats</option>
                        <option>Sandals</option>
                        <option>All Shoes</option>
                      </select>
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
                      <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Original Price (Optional)</label>
                      <input type="number" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: Number(e.target.value)})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary" />
                   </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <div className="mt-1 flex items-center gap-4">
                      {productForm.image ? (
                        <img src={productForm.image} alt="Preview" className="w-12 h-12 rounded object-cover border" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert('File is too large. Max 5MB allowed.');
                              return;
                            }
                            try {
                              setUploadingImage(true);
                              
                              const fileExt = file.name.split('.').pop() || 'png';
                              const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
                              const filePath = `${fileName}`;

                              const { error: uploadError } = await supabase.storage
                                .from('product-images')
                                .upload(filePath, file, {
                                  cacheControl: '3600',
                                  upsert: false
                                });

                              if (uploadError) {
                                console.error('Supabase storage upload error:', uploadError);
                                alert('Failed to upload image: ' + uploadError.message);
                                return;
                              }

                              const { data } = supabase.storage
                                .from('product-images')
                                .getPublicUrl(filePath);

                              if (data?.publicUrl) {
                                setProductForm(prev => ({ ...prev, image: data.publicUrl }));
                              } else {
                                alert('Could not retrieve public image URL.');
                              }
                            } catch (err) {
                              console.error('Image upload failed:', err);
                              alert('Image upload failed');
                            } finally {
                              setUploadingImage(false);
                            }
                          }
                        }}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Key Specs (Optional, e.g. 256GB / 8GB RAM)</label>
                    <input type="text" value={productForm.specs} onChange={e => setProductForm({...productForm, specs: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Short Note (Optional)</label>
                    <textarea rows={2} value={productForm.note} onChange={e => setProductForm({...productForm, note: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary resize-none" placeholder="Add a short note about this product" />
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setShowProductForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                 </div>
               </form>
            </div>
          ) : activeTab === 'dashboard' ? (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 text-left">
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-dark">{stat.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 md:p-6 text-left">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-dark">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm font-medium text-primary hover:text-primary-light flex items-center gap-1">
                      View All <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  {/* Desktop view for orders table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-gray-500 border-b border-gray-100">
                        <tr>
                          <th className="pb-3 font-medium">Order ID</th>
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Total</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="py-4 font-medium text-dark">#{order.id.substring(0,8).toUpperCase()}</td>
                            <td className="py-4 text-gray-600">{order.customerName}</td>
                            <td className="py-4 font-medium text-dark">{formatCurrency(order.total)}</td>
                            <td className="py-4">
                              <span className="px-3 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full flex items-center gap-1 w-max">
                                <CheckCircle2 size={12} /> {order.status}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={4} className="py-4 text-center text-gray-500">No recent orders.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile responsive cards for orders */}
                  <div className="block md:hidden space-y-4">
                    {recentOrders.length > 0 ? recentOrders.map((order) => (
                      <div key={order.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-dark text-sm">#{order.id.substring(0,8).toUpperCase()}</span>
                          <span className="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full font-medium">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                          <div><strong>Customer:</strong> {order.customerName}</div>
                          <div><strong>Total:</strong> {formatCurrency(order.total)}</div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-sm text-gray-500 py-4">No recent orders.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'products' ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 text-left">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:border-primary focus-within:bg-white transition-all w-full sm:w-64">
                  <Search size={16} className="text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="bg-transparent border-none outline-none ml-2 text-sm w-full" 
                  />
                </div>
                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                  <button onClick={async () => {
                    if (window.confirm('This will replace all products with the default shoe products. Proceed?')) {
                      const { mockProducts } = await import('../data/mock');
                      let count = 0;
                      try {
                        const { data: allProducts } = await supabase.from('products').select('id');
                        if (allProducts && allProducts.length > 0) {
                           await supabase.from('products').delete().in('id', allProducts.map(p => p.id));
                        }
                        
                        for (const p of mockProducts) {
                          await supabase.from('products').insert([{ name: p.name || '', brand: p.brand || '', category: p.category || '', price: p.price || 0, original_price: p.originalPrice || null, image: p.image || '', specs: p.specs || '', tag: p.tag || null, rating: p.rating || 0 }]);
                          count++;
                        }
                        alert(`Successfully added ${count} shoe products!`);
                        fetchData();
                      } catch (e: any) {
                        console.error(e);
                        alert(`Error: ${e.message}`);
                      }
                    }
                  }} className="flex items-center gap-1.5 text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Load Demo Products
                  </button>
                  <button onClick={handleOpenAddProduct} className="flex items-center gap-1.5 text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors">
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>

              {/* Desktop Products Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="py-4 px-6 font-medium">Product</th>
                      <th className="py-4 px-6 font-medium">Category</th>
                      <th className="py-4 px-6 font-medium">Price</th>
                      <th className="py-4 px-6 font-medium">Rating</th>
                      <th className="py-4 px-6 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.brand?.toLowerCase().includes(productSearch.toLowerCase())).length > 0 ? (
                      products
                        .filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.brand?.toLowerCase().includes(productSearch.toLowerCase()))
                        .map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                                  <img src={product.image} alt="" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                  <p className="font-semibold text-dark line-clamp-1">{product.name}</p>
                                  <p className="text-xs text-gray-500">{product.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-gray-600">{product.category}</td>
                            <td className="py-4 px-6 font-medium text-dark">{formatCurrency(product.price)}</td>
                            <td className="py-4 px-6">
                              <button onClick={() => handleUpdateProductRating(product.id)} className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1">
                                {product.rating || '0'} ★
                              </button>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleOpenEditProduct(product)}
                                  className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProductAdmin(product.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr><td colSpan={6} className="py-8 text-center text-gray-500">No products match your search.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Products Cards */}
              <div className="block md:hidden space-y-4">
                {products.filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.brand?.toLowerCase().includes(productSearch.toLowerCase())).length > 0 ? (
                  products
                    .filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.brand?.toLowerCase().includes(productSearch.toLowerCase()))
                    .map((product) => (
                      <div key={product.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-white border border-gray-100 p-1 rounded-lg shrink-0 flex items-center justify-center">
                            <img src={product.image} alt="" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-dark text-sm truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.brand} • {product.category}</p>
                            <p className="text-sm font-semibold text-primary mt-1">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateProductRating(product.id)} className="text-orange-500 hover:text-orange-600 font-bold text-xs">
                              {product.rating || '0'} ★
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleOpenEditProduct(product)}
                              className="p-1.5 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProductAdmin(product.id)}
                              className="p-1.5 text-red-600 bg-white border border-gray-200 rounded-md hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-sm text-gray-500 py-4">No products found.</p>
                )}
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            <div className="space-y-6 text-left">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-dark">All Orders</h2>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:border-primary focus-within:bg-white transition-all w-full sm:w-64">
                      <Search size={16} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search customer, ID, phone..." 
                        value={ordersSearch}
                        onChange={e => setOrdersSearch(e.target.value)}
                        className="bg-transparent border-none outline-none ml-2 text-sm w-full" 
                      />
                    </div>
                    
                    {/* Status Filter Dropdown */}
                    <select
                      value={ordersFilter}
                      onChange={e => setOrdersFilter(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 bg-white text-sm focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready for Delivery">Ready for Delivery</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Filter & Search Logic */}
                {(() => {
                  const filteredOrders = allOrders.filter(order => {
                    const matchesSearch = 
                      order.customerName?.toLowerCase().includes(ordersSearch.toLowerCase()) ||
                      order.id?.toLowerCase().includes(ordersSearch.toLowerCase()) ||
                      order.customerPhone?.includes(ordersSearch);
                    const matchesFilter = ordersFilter === 'all' || order.status === ordersFilter;
                    return matchesSearch && matchesFilter;
                  });

                  return (
                    <>
                      {/* Desktop Orders Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                            <tr>
                              <th className="py-4 px-6 font-medium">Order ID</th>
                              <th className="py-4 px-6 font-medium">Customer</th>
                              <th className="py-4 px-6 font-medium">Date</th>
                              <th className="py-4 px-6 font-medium">Items</th>
                              <th className="py-4 px-6 font-medium">Total</th>
                              <th className="py-4 px-6 font-medium">Status</th>
                              <th className="py-4 px-6 font-medium text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length > 0 ? (
                              filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="py-4 px-6">
                                    <button
                                      onClick={() => setSelectedOrder(order)}
                                      className="font-bold text-primary hover:underline"
                                    >
                                      #{order.orderNumber || order.id.substring(0, 8).toUpperCase()}
                                    </button>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="font-semibold text-dark">{order.customerName}</div>
                                    <div className="text-xs text-gray-400">{order.customerPhone || 'No Phone'}</div>
                                  </td>
                                  <td className="py-4 px-6 text-gray-500 text-xs">
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                  </td>
                                  <td className="py-4 px-6 text-gray-600 font-medium">
                                    {order.items?.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0) || 0} items
                                  </td>
                                  <td className="py-4 px-6 font-bold text-dark">{formatCurrency(order.total)}</td>
                                  <td className="py-4 px-6">
                                    <select
                                      value={order.status || 'Pending'}
                                      onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                      className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none focus:ring-2 focus:ring-primary ${
                                        order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                                        'bg-amber-50 text-amber-700'
                                      }`}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Confirmed">Confirmed</option>
                                      <option value="Preparing">Preparing</option>
                                      <option value="Ready for Delivery">Ready for Delivery</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </td>
                                  <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-dark rounded-lg text-xs font-medium transition-colors"
                                      >
                                        Details
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Order"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-500">
                                  No orders match your search filters.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Orders Card View */}
                      <div className="block md:hidden space-y-4">
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map(order => (
                            <div key={order.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
                              <div className="flex justify-between items-center">
                                <button 
                                  onClick={() => setSelectedOrder(order)}
                                  className="font-bold text-primary hover:underline text-sm"
                                >
                                  #{order.orderNumber || order.id.substring(0, 8).toUpperCase()}
                                </button>
                                <select
                                  value={order.status || 'Pending'}
                                  onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className={`px-2 py-0.5 rounded text-xs font-semibold border-none cursor-pointer focus:ring-2 focus:ring-primary ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Preparing">Preparing</option>
                                  <option value="Ready for Delivery">Ready for Delivery</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div><strong>Customer:</strong> {order.customerName} ({order.customerPhone || 'N/A'})</div>
                                <div><strong>Total:</strong> <span className="font-semibold text-primary">{formatCurrency(order.total)}</span></div>
                                <div><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</div>
                                <div><strong>Items:</strong> {order.items?.length || 0} types</div>
                              </div>
                              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200/50">
                                <button 
                                  onClick={() => setSelectedOrder(order)}
                                  className="px-3 py-1 bg-white border border-gray-200 text-dark rounded-md text-xs font-medium"
                                >
                                  Details
                                </button>
                                <button 
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1 text-red-600 bg-white border border-gray-200 rounded-md"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-sm text-gray-500 py-4">No orders found matching the filter.</p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Order Details Modal Overlay */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-dark/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <XCircle size={24} />
                    </button>

                    <h3 className="text-2xl font-bold text-dark mb-6">
                      Order Details #{selectedOrder.orderNumber || selectedOrder.id.substring(0, 8).toUpperCase()}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-2">Customer Details</h4>
                        <p className="font-bold text-dark text-base">{selectedOrder.customerName}</p>
                        <p className="text-sm text-gray-600 mt-1">📞 {selectedOrder.customerPhone || 'N/A'}</p>
                        <p className="text-xs text-gray-400 mt-2">Ordered on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</p>
                        {selectedOrder.deliveryAddress && (
                          <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-600">
                            <strong>Address:</strong> {selectedOrder.deliveryAddress}
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-2">Order Status</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <select
                            value={selectedOrder.status || 'Pending'}
                            onChange={e => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary w-full"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready for Delivery">Ready for Delivery</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        {selectedOrder.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200 flex-1">
                            <span className="block text-xs font-bold text-gray-400 mb-1">Customer Notes</span>
                            <p className="text-sm text-gray-700 italic">"{selectedOrder.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 mb-6">
                      <h4 className="font-bold text-sm text-dark mb-4">Ordered Items</h4>
                      <div className="space-y-4">
                        {selectedOrder.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between gap-4 p-2 bg-gray-50/50 rounded-xl border border-gray-100">
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-dark text-sm truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} • {formatCurrency(item.price)} each</p>
                            </div>
                            <div className="font-semibold text-dark text-sm shrink-0">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-sm">Grand Total</span>
                        <p className="text-2xl font-black text-primary leading-tight">{formatCurrency(selectedOrder.total)}</p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            handleDeleteOrder(selectedOrder.id);
                            setSelectedOrder(null);
                          }}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          Delete Order
                        </button>
                        <button 
                          onClick={() => setSelectedOrder(null)}
                          className="px-5 py-2 bg-dark text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'analytics' ? (
            <div className="space-y-8 text-left">
              {/* Analytics Top Stats Card Row */}
              {(() => {
                const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                const completedCount = allOrders.filter(o => o.status?.toLowerCase() === 'delivered').length;
                const pendingCount = allOrders.filter(o => o.status?.toLowerCase() === 'pending').length;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Revenue</span>
                      <p className="text-2xl font-black text-dark">{formatCurrency(totalRevenue)}</p>
                      <p className="text-xs text-green-500 font-semibold mt-2">All integrated sales</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Completed Sales</span>
                      <p className="text-2xl font-black text-green-600">{completedCount}</p>
                      <p className="text-xs text-gray-500 mt-2">{((completedCount / (allOrders.length || 1)) * 100).toFixed(0)}% completion rate</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Pending Orders</span>
                      <p className="text-2xl font-black text-amber-500">{pendingCount}</p>
                      <p className="text-xs text-gray-500 mt-2">Requires verification</p>
                    </div>
                  </div>
                );
              })()}

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Sales Monthly Trend Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-lg text-dark mb-4">Marketplace Performance Trend</h3>
                  
                  {/* Custom Responsive SVG Line Chart */}
                  <div className="h-64 w-full relative flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 500 200">
                      {/* background grid */}
                      <line x1="50" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="50" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="50" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="50" y1="170" x2="480" y2="170" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Line Path */}
                      <path 
                        d="M 50,150 L 120,130 L 190,160 L 260,90 L 330,110 L 400,60 L 480,40" 
                        fill="none" 
                        stroke="#6D28D9" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                      />
                      
                      {/* Gradient area under line */}
                      <path 
                        d="M 50,150 L 120,130 L 190,160 L 260,90 L 330,110 L 400,60 L 480,40 L 480,170 L 50,170 Z" 
                        fill="url(#violetGrad)" 
                        opacity="0.1" 
                      />

                      {/* Data dots */}
                      <circle cx="50" cy="150" r="5" fill="#6D28D9" />
                      <circle cx="120" cy="130" r="5" fill="#6D28D9" />
                      <circle cx="190" cy="160" r="5" fill="#6D28D9" />
                      <circle cx="260" cy="90" r="5" fill="#6D28D9" />
                      <circle cx="330" cy="110" r="5" fill="#6D28D9" />
                      <circle cx="400" cy="60" r="5" fill="#6D28D9" />
                      <circle cx="480" cy="40" r="5" fill="#6D28D9" />

                      <defs>
                        <linearGradient id="violetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#6D28D9" />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </linearGradient>
                      </defs>

                      {/* Axis labels */}
                      <text x="50" y="190" fontSize="10" fill="#94a3b8" textAnchor="middle">Jan</text>
                      <text x="120" y="190" fontSize="10" fill="#94a3b8" textAnchor="middle">Feb</text>
                      <text x="190" y="190" fontSize="10" fill="#94a3b8" textAnchor="middle">Mar</text>
                      <text x="260" y="190" fontSize="10" fill="#94a3b8" textAnchor="middle">Apr</text>
                      <text x="330" y="190" fontSize="10" fill="#94a3b8" textAnchor="middle">May</text>
                      <text x="400" y="190" fontSize="10" fill="#94a3b8" textAnchor="middle">Jun</text>
                      <text x="480" y="190" fontSize="10" fill="#94a3b8" textAnchor="middle">Jul</text>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">Historical transaction aggregates over active period</p>
                </div>
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl mx-auto text-left">
              <h2 className="text-2xl font-bold mb-2 text-dark">Platform Settings</h2>
              <p className="text-sm text-gray-500 mb-8">Manage site-wide configurations, fees, and operational preferences.</p>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Platform Name</label>
                    <input 
                      type="text" 
                      required 
                      value={systemSettings.siteName} 
                      onChange={e => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Platform Tagline</label>
                    <input 
                      type="text" 
                      value={systemSettings.tagline} 
                      onChange={e => setSystemSettings({...systemSettings, tagline: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Platform Logo</label>
                    <div className="flex items-center gap-4">
                      {systemSettings.logoUrl ? (
                        <img src={systemSettings.logoUrl} alt="Logo preview" className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400">
                          {systemSettings.siteName?.charAt(0) || 'N'}
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert('File is too large. Max 5MB allowed.');
                              return;
                            }
                            try {
                              const fileExt = file.name.split('.').pop() || 'png';
                              const fileName = `logo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
                              const filePath = `${fileName}`;

                              const { error: uploadError } = await supabase.storage
                                .from('product-images')
                                .upload(filePath, file, {
                                  cacheControl: '3600',
                                  upsert: false
                                });

                              if (uploadError) {
                                alert('Failed to upload logo: ' + uploadError.message);
                                return;
                              }

                              const { data } = supabase.storage
                                .from('product-images')
                                .getPublicUrl(filePath);

                              if (data?.publicUrl) {
                                setSystemSettings(prev => ({ ...prev, logoUrl: data.publicUrl }));
                              }
                            } catch (err) {
                              console.error('Logo upload failed:', err);
                            }
                          }
                        }}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Support Contact Email</label>
                    <input 
                      type="email" 
                      required 
                      value={systemSettings.contactEmail} 
                      onChange={e => setSystemSettings({...systemSettings, contactEmail: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={systemSettings.whatsappNumber || ''} 
                      onChange={e => setSystemSettings({...systemSettings, whatsappNumber: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Free Delivery Location</label>
                    <input 
                      type="text" 
                      value={systemSettings.deliveryLocation || ''} 
                      onChange={e => setSystemSettings({...systemSettings, deliveryLocation: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      placeholder="e.g., Port Harcourt"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base Delivery Fee</label>
                    <input 
                      type="number" 
                      required 
                      value={systemSettings.deliveryCost} 
                      onChange={e => setSystemSettings({...systemSettings, deliveryCost: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.1"
                      value={systemSettings.taxRate} 
                      onChange={e => setSystemSettings({...systemSettings, taxRate: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>
                
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">About Us Text</label>
                   <textarea
                     rows={3}
                     value={systemSettings.aboutUsText}
                     onChange={e => setSystemSettings({...systemSettings, aboutUsText: e.target.value})}
                     className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                     placeholder="Brief description about the platform..."
                   />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                    <input 
                      type="url" 
                      value={systemSettings.facebookUrl} 
                      onChange={e => setSystemSettings({...systemSettings, facebookUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter URL</label>
                    <input 
                      type="url" 
                      value={systemSettings.twitterUrl} 
                      onChange={e => setSystemSettings({...systemSettings, twitterUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                    <input 
                      type="url" 
                      value={systemSettings.instagramUrl} 
                      onChange={e => setSystemSettings({...systemSettings, instagramUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-dark">System Maintenance Mode</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Locks catalog orders and displays temporary maintenance splash screen.</p>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                      className={`w-12 h-6 rounded-full p-0.5 transition-all focus:outline-none flex items-center ${
                        systemSettings.maintenanceMode ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-lg text-dark mb-4">Change Admin Password</h3>
                <form onSubmit={handleUpdateAdminPassword} className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input 
                      type="password" 
                      required 
                      minLength={6}
                      value={newAdminPassword}
                      onChange={e => setNewAdminPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      placeholder="Enter new password"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-dark text-white font-medium rounded-xl hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left">
               <h2 className="text-xl font-bold text-gray-400">Content for {activeTab} coming soon...</h2>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
