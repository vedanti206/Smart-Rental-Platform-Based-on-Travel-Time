const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const users = [
    {
        name: 'John Broker',
        email: 'broker@example.com',
        password: 'password123',
        role: 'owner'
    },
    {
        name: 'Jane Renter',
        email: 'renter@example.com',
        password: 'password123',
        role: 'user'
    }
];

const mockProperties = (ownerId) => [
    {
        owner: ownerId,
        name: 'Modern Downtown Loft',
        price: 125000,
        propertyType: 'Apartment',
        location: {
            type: 'Point',
            coordinates: [-74.006, 40.7128]
        },
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        distances: { hospital: 1200, school: 800, transport: 200, market: 500 }
    },
    {
        owner: ownerId,
        name: 'Lakeside Villa',
        price: 285000,
        propertyType: 'Villa',
        location: {
            type: 'Point',
            coordinates: [-120.00, 39.00]
        },
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        distances: { hospital: 4000, school: 3000, transport: 1500, market: 1200 }
    },
    {
        owner: ownerId,
        name: 'Urban Penthouse',
        price: 350000,
        propertyType: 'Apartment',
        location: {
            type: 'Point',
            coordinates: [-0.1276, 51.5074]
        },
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        distances: { hospital: 500, school: 1000, transport: 100, market: 300 }
    },
    {
        owner: ownerId,
        name: 'Cozy Suburb House',
        price: 85000,
        propertyType: 'House',
        location: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610]
        },
        imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        distances: { hospital: 2500, school: 1800, transport: 800, market: 1500 }
    },
    {
        owner: ownerId,
        name: 'Minimalist Studio',
        price: 45000,
        propertyType: 'Studio',
        location: {
            type: 'Point',
            coordinates: [-74.001, 40.7100]
        },
        imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        distances: { hospital: 1000, school: 2000, transport: 50, market: 100 }
    }
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Property.deleteMany();

        const createdUsers = await User.insertMany(users);
        const ownerId = createdUsers[0]._id; // John Broker

        const properties = mockProperties(ownerId);
        await Property.insertMany(properties);

        console.log('Dummy Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }
};

importData();
