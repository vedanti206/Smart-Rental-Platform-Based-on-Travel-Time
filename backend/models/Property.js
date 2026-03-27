const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    propertyType: {
        type: String,
        enum: ['Flat', 'Apartment', 'House', 'Villa', 'Studio'],
        required: true
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        formattedAddress: String
    },
    // Distances for facility score (in meters)
    distances: {
        hospital: { type: Number, default: 2000 },
        school: { type: Number, default: 1500 },
        transport: { type: Number, default: 500 },
        market: { type: Number, default: 1000 }
    },
    facilityScore: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Middleware to calculate facility score before saving
PropertySchema.pre('save', function(next) {
    // Basic score calculation out of 10
    // Shorter distances = higher score
    
    // Max distances to consider for a zero score
    const MAX_DIST_HOSPITAL = 5000;
    const MAX_DIST_SCHOOL = 5000;
    const MAX_DIST_TRANSPORT = 3000;
    const MAX_DIST_MARKET = 3000;

    const normalize = (dist, max) => Math.max(0, 10 - (dist / max) * 10);

    const scores = [
        normalize(this.distances.hospital, MAX_DIST_HOSPITAL),
        normalize(this.distances.school, MAX_DIST_SCHOOL),
        normalize(this.distances.transport, MAX_DIST_TRANSPORT),
        normalize(this.distances.market, MAX_DIST_MARKET)
    ];

    // Average the scores to get out of 10
    const total = scores.reduce((acc, curr) => acc + curr, 0);
    this.facilityScore = +(total / scores.length).toFixed(1);

    next();
});

module.exports = mongoose.model('Property', PropertySchema);
