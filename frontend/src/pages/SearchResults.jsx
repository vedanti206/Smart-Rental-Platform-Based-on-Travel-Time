import { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, Map, IndianRupee } from 'lucide-react';

const SearchResults = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  
  const [filters, setFilters] = useState({
    workLat: '',
    workLng: '',
    maxCommute: 30,
    budget: ''
  });

  const [workplace, setWorkplace] = useState(null);
  const [sortBy, setSortBy] = useState('price_asc');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (queryStr = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/properties${queryStr}`);
      setProperties(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    let queryParams = [];
    if (filters.budget) queryParams.push(`budget=${filters.budget}`);
    if (filters.workLat && filters.workLng) {
      queryParams.push(`lat=${filters.workLat}`);
      queryParams.push(`lng=${filters.workLng}`);
      queryParams.push(`maxCommute=${filters.maxCommute}`);
      
      setWorkplace({ lat: Number(filters.workLat), lng: Number(filters.workLng) });
    } else {
      setWorkplace(null);
    }

    const queryStr = queryParams.length ? `?${queryParams.join('&')}` : '';
    fetchProperties(queryStr);
  };

  const sortedProperties = [...properties].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'commute_asc') return (a.estimatedCommuteMins || Infinity) - (b.estimatedCommuteMins || Infinity);
    if (sortBy === 'facility_desc') return (b.facilityScore || 0) - (a.facilityScore || 0);
    return 0;
  });

  return (
    <div className="flex h-[calc(100vh-73px)] bg-[#f7f8f9] overflow-hidden">
      
      {/* Filters Sidebar (Hidden on mobile by default) */}
      <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block shrink-0 p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2" /> Filters
          </h2>
          <button onClick={() => { setFilters({ workLat: '', workLng: '', maxCommute: 30, budget: '' }); setWorkplace(null); fetchProperties(); }} className="text-sm font-medium text-[#FF5A5F] hover:text-[#d4484d]">Reset</button>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Workplace Location</label>
            <div className="space-y-3">
              <input type="number" step="any" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
                placeholder="Latitude (e.g. 40.71)" value={filters.workLat} onChange={e => setFilters({...filters, workLat: e.target.value})} />
              <input type="number" step="any" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
                placeholder="Longitude (e.g. -74.00)" value={filters.workLng} onChange={e => setFilters({...filters, workLng: e.target.value})} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-900">Max Commute Time</label>
              <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">{filters.maxCommute}m</span>
            </div>
            <input type="range" min="5" max="120" step="5" className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
              value={filters.maxCommute} onChange={e => setFilters({...filters, maxCommute: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Max Budget (₹)</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-black transition-all">
              <span className="text-gray-500 mr-2 font-medium">₹</span>
              <input type="number" className="bg-transparent w-full text-sm outline-none" 
                placeholder="Any" value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 mt-4 flex items-center justify-center">
            <Search className="h-4 w-4 mr-2" /> Show Results
          </button>
        </form>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f7f8f9]">
        
        {/* Mobile Header / Filter Toggle */}
        <div className="lg:hidden p-4 bg-white border-b border-gray-200 flex justify-between items-center z-10">
          <h1 className="font-bold text-lg text-gray-900">{properties.length} homes found</h1>
          <button onClick={() => setShowMapModal(!showMapModal)} className="flex items-center text-sm font-medium px-4 py-2 bg-gray-100 rounded-full">
            <Map className="h-4 w-4 mr-1"/> Map
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Scrollable Grid */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${showMapModal ? 'hidden lg:block' : 'block'}`}>
            <div className="hidden lg:flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Accommodation Results</h1>
                <p className="text-gray-500 mt-2 font-medium">{properties.length} properties matched your criteria</p>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent font-bold border-none text-gray-900 text-sm focus:ring-0 cursor-pointer outline-none pl-1"
                >
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="commute_asc">Fastest Commute</option>
                  <option value="facility_desc">Best Facilities</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {sortedProperties.map(p => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No matches found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>

          {/* Sticky Map */}
          <div className={`w-full lg:w-[45%] xl:w-[40%] bg-white lg:border-l border-gray-200 flex-shrink-0 relative ${showMapModal ? 'block absolute inset-0 z-20' : 'hidden lg:block'}`}>
             {showMapModal && (
               <button onClick={() => setShowMapModal(false)} className="absolute top-4 left-4 z-[100] bg-white text-black px-4 py-2 font-bold shadow-lg rounded-full lg:hidden">
                 &times; Close Map
               </button>
             )}
             <MapView properties={properties} workplace={workplace} />
          </div>

        </div>
      </div>

    </div>
  );
};

export default SearchResults;
