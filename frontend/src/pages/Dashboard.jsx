import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { 
  Building, LayoutDashboard, BarChart2, IndianRupee, 
  Settings, HelpCircle, LogOut, Plus, Search, Bell, X, Home 
} from 'lucide-react';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', price: '', propertyType: 'Apartment', lat: '', lng: ''
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || role !== 'owner') {
      navigate('/');
      return;
    }
    fetchProperties();
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get('/api/properties');
      const myProps = res.data.data.filter(p => (p.owner && p.owner._id === user.id) || p.owner === user.id);
      setProperties(myProps);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/properties', {
        ...formData,
        price: Number(formData.price),
        lat: Number(formData.lat),
        lng: Number(formData.lng)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ name: '', price: '', propertyType: 'Apartment', lat: '', lng: '' });
      fetchProperties();
    } catch (err) {
      alert('Error creating property: ' + (err.response?.data?.error || err.message));
    }
  };

  const activeProperties = properties.length;
  const totalValue = properties.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="flex h-screen bg-[#f4f7fe] overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col hidden md:flex shrink-0">
        <div className="h-24 flex items-center px-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-[#00b574] p-2 rounded-xl mr-3 shadow-sm">
             <Building className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">RealEstate<span className="text-[#00b574]">Pro</span></span>
        </div>
        
        <div className="px-5 py-6 flex-1 overflow-y-auto space-y-8">
          <div>
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Menu</p>
            <nav className="space-y-1.5">
              <button disabled className="w-full flex items-center space-x-4 px-4 py-3.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl font-semibold transition-all">
                <LayoutDashboard className="h-5 w-5" /> <span>Dashboard</span>
              </button>
              <button className="w-full flex items-center space-x-4 px-4 py-3.5 bg-[#00b574]/10 text-[#00b574] rounded-2xl font-bold transition-all shadow-sm">
                <Building className="h-5 w-5" /> <span>Properties</span>
              </button>
              <button disabled className="w-full flex items-center space-x-4 px-4 py-3.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl font-semibold transition-all">
                <BarChart2 className="h-5 w-5" /> <span>Analytics</span>
              </button>
              <button disabled className="w-full flex items-center space-x-4 px-4 py-3.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl font-semibold transition-all">
                <IndianRupee className="h-5 w-5" /> <span>Financial</span>
              </button>
            </nav>
          </div>
          
          <div>
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">General</p>
            <nav className="space-y-1.5">
              <button disabled className="w-full flex items-center space-x-4 px-4 py-3.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl font-semibold transition-all">
                <Settings className="h-5 w-5" /> <span>Settings</span>
              </button>
              <button disabled className="w-full flex items-center space-x-4 px-4 py-3.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl font-semibold transition-all">
                <HelpCircle className="h-5 w-5" /> <span>Help</span>
              </button>
              <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full flex items-center space-x-4 px-4 py-3.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl font-bold transition-all">
                <LogOut className="h-5 w-5" /> <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="p-5 m-5 bg-gradient-to-br from-[#f8f9fa] to-white rounded-[24px] border border-gray-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00b574]/5 rounded-full -mr-12 -mt-12"></div>
          <h4 className="font-extrabold text-gray-900 mb-1.5 text-lg relative z-10">Upgrade to Pro</h4>
          <p className="text-sm font-medium text-gray-500 mb-5 relative z-10 leading-snug">Unlock advanced analytics and manage unlimited properties</p>
          <button className="w-full bg-[#00b574] text-white py-3 rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg hover:bg-[#009b63] transition-all transform hover:-translate-y-0.5 relative z-10">Upgrade Now</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f4f7fe]">
        
        {/* Top Navbar */}
        <header className="h-24 bg-[#f4f7fe] flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight">Properties</h1>
            <p className="text-base text-gray-500 font-medium mt-1">Manage and view all your property listings</p>
          </div>
          
          <div className="flex items-center space-x-5">
            <div className="relative hidden xl:block rounded-2xl px-5 py-3.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#00b574] transition-all border border-gray-100">
              <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input type="text" placeholder="Search by property, location, or client" className="pl-8 bg-transparent outline-none text-sm font-medium w-80 text-gray-700 placeholder-gray-400" />
            </div>
            
            <button onClick={() => setShowModal(true)} className="flex items-center bg-[#00b574] text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-[#00a368] transition-all transform hover:-translate-y-0.5">
              <Plus className="h-5 w-5 mr-2" /> Add Property
            </button>
            
            <div className="relative p-3.5 rounded-2xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="absolute top-3 right-3 h-2.5 w-2.5 bg-[#FF5A5F] rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex items-center space-x-3 pl-4">
              <div className="h-12 w-12 rounded-2xl bg-[#eff3f8] flex items-center justify-center text-indigo-700 font-extrabold text-lg">
                 {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="hidden 2xl:block ml-2">
                 <p className="text-sm font-extrabold text-gray-900">{user.name}</p>
                 <p className="text-xs font-bold text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          
          {/* Properties Grid */}
          <div className="flex justify-between items-center mb-8 mt-4">
             <div className="flex space-x-2 bg-white p-1 rounded-full shadow-sm border border-gray-100">
               <button className="px-6 py-2 bg-emerald-50 text-[#00b574] rounded-full text-sm font-bold shadow-sm">All</button>
               <button className="px-6 py-2 bg-transparent text-gray-500 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">For Sale</button>
               <button className="px-6 py-2 bg-transparent text-gray-500 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">For Rent</button>
               <button className="px-6 py-2 bg-transparent text-gray-500 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">Sold</button>
             </div>
             
             <button className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
               <SlidersHorizontal className="h-4 w-4 mr-2" /> More Filters
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-2">
               <div className="flex items-center space-x-3 text-gray-500 text-sm font-bold">
                 <div className="bg-orange-100 p-2 rounded-lg"><IndianRupee className="h-4 w-4 text-orange-600"/></div>
                 <span>Total Portfolio Value</span>
               </div>
               <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">₹{totalValue.toLocaleString('en-IN')}</h3>
               <p className="text-xs font-medium text-gray-400">Across {activeProperties} properties</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-2">
               <div className="flex items-center space-x-3 text-gray-500 text-sm font-bold">
                 <div className="bg-blue-100 p-2 rounded-lg"><Home className="h-4 w-4 text-blue-600"/></div>
                 <span>Total Properties</span>
               </div>
               <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{activeProperties}</h3>
               <p className="text-xs font-medium text-gray-400">Currently listed</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-2">
               <div className="flex items-center space-x-3 text-gray-500 text-sm font-bold">
                 <div className="bg-green-100 p-2 rounded-lg"><BarChart2 className="h-4 w-4 text-green-600"/></div>
                 <span>Avg. Price per Property</span>
               </div>
               <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">₹{(totalValue / activeProperties || 0).toLocaleString('en-IN')}</h3>
               <p className="text-xs font-medium text-gray-400">Based on listed properties</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-2">
               <div className="flex items-center space-x-3 text-gray-500 text-sm font-bold">
                 <div className="bg-purple-100 p-2 rounded-lg"><LayoutDashboard className="h-4 w-4 text-purple-600"/></div>
                 <span>Property Types</span>
               </div>
               <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">5</h3>
               <p className="text-xs font-medium text-gray-400">Different types available</p>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-dashed border-gray-300 flex flex-col items-center justify-center py-32 text-center shadow-sm">
              <div className="bg-gray-50 p-6 rounded-full mb-6">
                 <Building className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">No properties found</h3>
              <p className="text-gray-500 mt-3 max-w-sm text-base font-medium">Get started by adding your first property to track its performance and reach renters.</p>
              <button onClick={() => setShowModal(true)} className="mt-8 px-8 py-3.5 bg-[#00b574] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#009b63] transition-all transform hover:-translate-y-1">
                Add New Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </main>

      {/* Add Property Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Add New Listing</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 bg-white p-2 border border-gray-200 rounded-full shadow-sm transition-all"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Property Name/Title</label>
                  <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#00b574] focus:border-transparent outline-none transition-all" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Modern Downtown Loft" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Monthly Rent (₹)</label>
                  <input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#00b574] focus:border-transparent outline-none transition-all" 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 1250000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Property Type</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#00b574] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                    value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})}>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Latitude</label>
                  <input required type="number" step="any" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#00b574] focus:border-transparent outline-none transition-all" 
                    value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} placeholder="e.g. 40.712" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Longitude</label>
                  <input required type="number" step="any" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#00b574] focus:border-transparent outline-none transition-all" 
                    value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} placeholder="e.g. -74.006" />
                </div>
              </div>
              
              <div className="pt-4 mt-8 flex justify-end space-x-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3.5 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition">Cancel</button>
                <button type="submit" className="px-10 py-3.5 bg-[#00b574] text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:bg-[#009b63] transition-all transform hover:-translate-y-0.5">Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
