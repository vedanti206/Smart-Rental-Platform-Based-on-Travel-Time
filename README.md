# CommuteNest – Smart Rental Platform Based on Travel Time

CommuteNest is a smart rental platform where users can find properties based on their daily commute time rather than just location. The application provides intelligent property insights including a facility score, an AI-based commute traffic predictor, and a comprehensive cost calculator to help users make informed rental decisions.

## 🎯 Features

### For Users (Renters)
- **Commute-Based Search:** Search properties based on workplace location, maximum commute time, and budget.
- **Interactive Map:** Visually browse properties and your workplace on an integrated map.
- **Property Cards:** Detailed property view with:
  - **Facility Score:** Rated 0-10 based on proximity to hospitals, schools, transport, and markets.
  - **Cost Calculator:** Predicts total monthly cost = Rent + Travel Cost (based on distance) + Estimated Utilities.
  - **Traffic Prediction:** Estimates "Light", "Moderate", or "Heavy" traffic based on distance and calculated travel time.

### For Owners (Brokers)
- **Property Management:** Dedicated dashboard to add new property listings.
- **Detailed Listings:** Provide property name, price, geo-coordinates, and property type.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Lucide Icons, Google Maps React API.
- **Backend:** Node.js, Express.js, JWT Authentication.
- **Database:** MongoDB (Mongoose ORM).

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository_url>
cd CommuteNest
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/commutenest
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm start
# OR for development
node server.js
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd CommuteNest/frontend
npm install
```

**Google Maps API Key Setup:**
To enable the interactive map, open `frontend/src/components/MapView.jsx` and add your Google Maps API key to the `MOCK_API_KEY` configuration variable. 
*Note: The application has a graceful fallback placeholder map if no key is provided, allowing you to develop without incurring billing API costs.*

Start the frontend development server:
```bash
npm run dev
```

## 🎮 How to Use the Demo

1. **Register an Account:** Go to `http://localhost:3000/register` and create an account. Choose whether you want to be a `User` (Renter) or `Owner` (Broker).
2. **List a Property (Owner):** Log in as an Owner, navigate to the **Dashboard**, and click **Add Property**. Enter the property details and latitude/longitude (e.g., Lat: 40.7128, Lng: -74.0060).
3. **Search for Properties (User):** Log in as a User, navigate to **Find Homes** (`/search`). Enter your workplace coordinates, adjust the maximum commute time slider, and enter a budget. Click **Apply Filters** to see matched properties dynamically calculated by proximity.

## 📂 Project Structure

```text
CommuteNest/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # JWT Auth Middleware
│   ├── models/          # User and Property Mongoose Schemas (w/ Facility Calc logic)
│   ├── routes/          # Express API Routes (Auth, Properties)
│   └── server.js        # Main Node/Express Application
└── frontend/
    ├── public/          # Static files
    ├── src/
    │   ├── components/  # Reusable UI (Navbar, PropertyCard, MapView)
    │   ├── pages/       # Next/React Views (Home, Login, Register, Dashboard, SearchResults)
    │   ├── utils/       # Utility calculations (Cost, Commute Predictor)
    │   ├── App.jsx      # Top-level Routing
    │   └── main.jsx     # Vite/React entry
    ├── package.json     # Frontend dependencies
    ├── tailwind.config.js # Tailwind CSS configuration
    └── vite.config.js   # Vite Builder configuration
```

---
*Built as a smart solution for modern renters and forward-thinking property brokers.*
