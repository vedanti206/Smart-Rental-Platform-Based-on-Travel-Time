const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all properties (with filtering)
// @route   GET /api/properties
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { budget, lat, lng, maxCommute } = req.query;

        let query = {};

        if (budget) {
            query.price = { $lte: Number(budget) };
        }

        let properties = await Property.find(query).populate('owner', 'name email');

        if (lat && lng && maxCommute) {
            properties = properties.filter(prop => {
                if (!prop.location || !prop.location.coordinates) return false;
                
                const propLat = prop.location.coordinates[1];
                const propLng = prop.location.coordinates[0];

                const R = 6371; // km
                const dLat = (propLat - lat) * Math.PI / 180;
                const dLng = (propLng - lng) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                          Math.cos(lat * Math.PI / 180) * Math.cos(propLat * Math.PI / 180) *
                          Math.sin(dLng/2) * Math.sin(dLng/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distanceKm = R * c;

                const timeMins = (distanceKm / 30) * 60; // Assume 30km/h speed

                prop._doc.estimatedCommuteMins = Math.round(timeMins);
                prop._doc.distanceKm = distanceKm.toFixed(2);

                return timeMins <= Number(maxCommute);
            });
        }

        res.status(200).json({ success: true, count: properties.length, data: properties });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }
        res.status(200).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Owner only)
router.post('/', protect, authorize('owner'), async (req, res) => {
    try {
        req.body.owner = req.user.id;

        if (req.body.lat && req.body.lng) {
            req.body.location = {
                type: 'Point',
                coordinates: [req.body.lng, req.body.lat]
            };
        }

        const property = await Property.create(req.body);
        res.status(201).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner restrict)
router.put('/:id', protect, authorize('owner'), async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        if (property.owner.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this property' });
        }

        if (req.body.lat && req.body.lng) {
            req.body.location = {
                type: 'Point',
                coordinates: [req.body.lng, req.body.lat]
            };
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner restrict)
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        if (property.owner.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this property' });
        }

        await property.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
