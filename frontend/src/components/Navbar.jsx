import { Link, useLocation } from 'react-router-dom';
import { Home, LogOut, Grid, Search, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // If on dashboard, we might want a different top bar, but let's keep a unified sleek topnav
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-[#FF5A5F] p-1.5 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">CommuteNest</span>
            </Link>
            
            {/* Nav Links Desktop */}
            <div className="hidden md:flex space-x-8">
              <Link to="/" className={`font-medium text-sm transition-colors ${location.pathname === '/' ? 'text-[#FF5A5F]' : 'text-gray-500 hover:text-gray-900'}`}>Home</Link>
              <Link to="/search" className={`font-medium text-sm transition-colors ${location.pathname === '/search' ? 'text-[#FF5A5F]' : 'text-gray-500 hover:text-gray-900'}`}>Search Properties</Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                {role === 'owner' && (
                  <Link to="/dashboard" className="hidden sm:flex items-center space-x-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors border border-gray-200">
                    <Grid className="h-4 w-4 text-gray-500" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{role}</p>
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-[#FF5A5F] transition-colors ml-4 p-2 rounded-full hover:bg-red-50">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Log in</Link>
                <Link to="/register" className="bg-[#FF5A5F] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#e0484d] transition-colors shadow-sm shadow-red-200">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
