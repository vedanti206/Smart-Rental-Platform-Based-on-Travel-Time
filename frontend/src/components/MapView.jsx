import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const getMarkerIcon = (commuteMins) => {
  if (!commuteMins) return createIcon('red');
  if (commuteMins <= 15) return createIcon('green');
  if (commuteMins <= 30) return createIcon('gold');
  return createIcon('orange');
};

const MapUpdater = ({ properties, workplace }) => {
  const map = useMap();
  useEffect(() => {
    if (workplace) {
      map.setView([workplace.lat, workplace.lng], 13, {
        animate: true,
        duration: 1.5
      });
    } else if (properties && properties.length > 0) {
      const validProps = properties.filter(p => p.location && p.location.coordinates);
      if (validProps.length > 0) {
        const bounds = L.latLngBounds(validProps.map(p => [p.location.coordinates[1], p.location.coordinates[0]]));
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    }
  }, [properties, workplace, map]);
  return null;
};

const MapView = ({ properties, workplace }) => {
  const defaultCenter = properties.length > 0 && properties[0].location?.coordinates
    ? [properties[0].location.coordinates[1], properties[0].location.coordinates[0]]
    : [40.7128, -74.0060];

  const center = workplace ? [workplace.lat, workplace.lng] : defaultCenter;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 z-10 relative">
      <MapContainer center={center} zoom={4} scrollWheelZoom={true} className="w-full h-full z-10">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater properties={properties} workplace={workplace} />
        
        {workplace ? (
          <Marker position={[workplace.lat, workplace.lng]} icon={createIcon('blue')}>
             <Popup>
               <div className="text-center font-bold text-blue-600">Your Workplace</div>
             </Popup>
          </Marker>
        ) : null}

        {properties.filter(p => p.location && p.location.coordinates).map(p => (
           <Marker 
              key={p._id} 
              position={[p.location.coordinates[1], p.location.coordinates[0]]}
              icon={getMarkerIcon(p.estimatedCommuteMins)}
           >
              <Popup>
                <div className="p-1 min-w-[150px] font-sans">
                  <img src={p.imageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} alt={p.name} className="w-full h-24 object-cover rounded-md mb-2" />
                  <h4 className="font-extrabold text-gray-900 leading-tight mb-1">{p.name}</h4>
                  <p className="text-gray-600 font-bold">₹{p.price.toLocaleString('en-IN')}<span className="text-xs text-gray-400 font-medium">/mo</span></p>
                  {p.estimatedCommuteMins && <p className="text-[#00b574] font-extrabold text-xs mt-2 bg-green-50 px-2 py-1 rounded inline-block">⏱ Commute: {p.estimatedCommuteMins} min</p>}
                </div>
              </Popup>
           </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200 shadow-md pointer-events-none">
         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Commute Times</h4>
         <div className="space-y-1.5">
           <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div><span className="text-xs font-medium text-gray-700">Under 15 mins</span></div>
           <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div><span className="text-xs font-medium text-gray-700">15 - 30 mins</span></div>
           <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div><span className="text-xs font-medium text-gray-700">Over 30 mins</span></div>
           <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div><span className="text-xs font-medium text-gray-700">Workplace Target</span></div>
         </div>
      </div>
    </div>
  );
};

export default MapView;
