import { Link } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-white text-gray-900 px-4">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
          Find Your Perfect Home <br/> Based on Commute Time
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Stop guessing your daily travel time. CommuteNest calculates your commute, estimates monthly costs, and scores neighborhood facilities.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
          <Link to="/search" className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Searching
          </Link>
          <Link to="/register" className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-50 transition-all shadow-md">
            List a Property
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto pb-16">
        {[
          { icon: Clock, title: "Smart Commute", desc: "Predict travel time to work." },
          { icon: IndianRupee, title: "Cost Calculator", desc: "Estimate total rent + travel savings." },
          { icon: Star, title: "Facility Score", desc: "0-10 score for nearby amenities." },
          { icon: MapPin, title: "Interactive Maps", desc: "View everything visually." },
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center transform transition duration-500 hover:scale-105">
            <div className="p-4 bg-indigo-100 rounded-full mb-4 text-primary">
              <feature.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
