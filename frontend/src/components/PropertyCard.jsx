import { MapPin, Clock, Star } from 'lucide-react';
import { calculateTotalCost } from '../utils/calculations';

const PropertyCard = ({ property }) => {
  const { 
    name, price, propertyType, facilityScore, 
    estimatedCommuteMins, distanceKm, owner 
  } = property;

  const costData = distanceKm ? calculateTotalCost(price, distanceKm) : null;
  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Top Image Section */}
      <div className="relative">
        <img src={property.imageUrl || defaultImage} alt={name} className="w-full h-56 object-cover" />
        <div className="absolute top-4 left-4">
          <span className="bg-[#a3e635] text-green-900 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            {propertyType}
          </span>
        </div>
        <button className="absolute top-4 right-4 h-8 w-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:text-red-500 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      <div className="p-5">
        {/* Price & Title */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">₹{price.toLocaleString()}</h2>
          <p className="text-sm font-medium text-gray-500 mt-1 line-clamp-1">{name}</p>
        </div>

        {/* Stats Row */}
        {distanceKm && (
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600 font-medium">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              <span>{Math.round(distanceKm)} km</span>
            </div>
            <div className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              <Clock className="w-4 h-4 mr-1" />
              <span>{estimatedCommuteMins} min</span>
            </div>
            {facilityScore > 0 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                <span>{facilityScore}/10</span>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="my-4 border-t border-gray-100"></div>

        {/* Footer info: Owner & Total Cost */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
               {owner?.name ? owner.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <span className="text-xs font-medium text-gray-600">{owner?.name || 'Verified Agent'}</span>
          </div>
          
          {costData && (
            <span className="text-xs font-bold text-gray-900">
              Total ₹{costData.total.toLocaleString()} /mo
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
