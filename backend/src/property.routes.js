import express from 'express';
import Property from '../data/property.model.js';
import User from '../data/user.model.js';
import { authUser } from '../authmiddleware/auth.js';

const router = express.Router();

// ============ CREATE Property ============
router.post('/api/properties', authUser, async (req, res) => {
    try {
        const { title, description, price, pricePerUnit, area, propertyType, bedrooms, bathrooms, location, images, amenities, features, ownerPhone } = req.body;
        
        // Validate required fields
        if (!title || !description || !price || !area || !propertyType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userId = req.user.id;
        const ownerName = req.user.name || req.user.firstName || req.user.username;
        const ownerEmail = req.user.email;

        const newProperty = new Property({
            title,
            description,
            price,
            pricePerUnit: pricePerUnit || 0,
            area,
            propertyType,
            bedrooms: bedrooms || 0,
            bathrooms: bathrooms || 0,
            location,
            images: images || [],
            amenities: amenities || [],
            features: features || [],
            ownerId: userId,
            ownerName,
            ownerEmail,
            ownerPhone: ownerPhone || ''
        });

        await newProperty.save();
        res.status(201).json({ 
            message: 'Property created successfully', 
            property: newProperty 
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Error creating property', error: error.message });
    }
});

// ============ GET All Properties ============
router.get('/api/properties', async (req, res) => {
    try {
        const { propertyType, minPrice, maxPrice, sortBy, status } = req.query;
        
        let filter = { status: status || 'active' };

        if (propertyType && propertyType !== 'all') {
            filter.propertyType = propertyType;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        let sortOption = {};
        switch(sortBy) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'priceHigh':
                sortOption = { price: -1 };
                break;
            case 'priceLow':
                sortOption = { price: 1 };
                break;
            case 'featured':
                filter.isFeatured = true;
                sortOption = { createdAt: -1 };
                break;
            default:
                sortOption = { isFeatured: -1, createdAt: -1 };
        }

        const properties = await Property.find(filter)
            .sort(sortOption)
            .populate('ownerId', 'name email avatar username firstName lastName')
            .lean();

        res.json({ 
            success: true,
            count: properties.length,
            properties 
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ success: false, message: 'Error fetching properties' });
    }
});

// ============ GET Single Property ============
router.get('/api/properties/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        ).populate('ownerId', 'name email avatar username firstName lastName');

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.json({ success: true, property });
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ message: 'Error fetching property' });
    }
});

// ============ UPDATE Property ============
router.put('/api/properties/:id', authUser, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user is the owner
        if (property.ownerId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only edit your own listings' });
        }

        // Update allowed fields
        const allowedUpdates = ['title', 'description', 'price', 'pricePerUnit', 'area', 'bedrooms', 'bathrooms', 'location', 'images', 'amenities', 'features', 'status', 'ownerPhone'];
        
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                property[field] = req.body[field];
            }
        });

        property.updatedAt = new Date();
        await property.save();

        res.json({ 
            message: 'Property updated successfully', 
            property 
        });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Error updating property', error: error.message });
    }
});

// ============ DELETE Property ============
router.delete('/api/properties/:id', authUser, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user is the owner
        if (property.ownerId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own listings' });
        }

        await Property.findByIdAndDelete(id);

        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Error deleting property' });
    }
});

// ============ GET User's Properties ============
router.get('/api/user/properties', authUser, async (req, res) => {
    try {
        const userId = req.user.id;

        const properties = await Property.find({ ownerId: userId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({ 
            success: true,
            count: properties.length,
            properties 
        });
    } catch (error) {
        console.error('Error fetching user properties:', error);
        res.status(500).json({ message: 'Error fetching properties' });
    }
});

// ============ GET Properties by Username (public) ============
router.get('/api/users/:username/properties', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).select('_id');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const properties = await Property.find({ ownerId: user._id, status: 'active' })
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            count: properties.length,
            properties
        });
    } catch (error) {
        console.error('Error fetching user properties:', error);
        res.status(500).json({ message: 'Error fetching properties' });
    }
});

// ============ ADD Review to Property ============
router.post('/api/properties/:id/reviews', authUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;
        const userName = req.user.name || req.user.firstName || req.user.username;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user already reviewed this property
        const existingReview = property.reviews.find(r => r.userId.toString() === userId);
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this property' });
        }

        property.reviews.push({
            userId,
            userName,
            rating,
            comment: comment || '',
            createdAt: new Date()
        });

        await property.save();

        res.status(201).json({ 
            message: 'Review added successfully',
            property 
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review' });
    }
});

export default router;
