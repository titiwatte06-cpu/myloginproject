import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pricePerUnit: {
        type: Number,
        default: 0
    },
    area: {
        type: Number,
        required: true
    },
    propertyType: {
        type: String,
        enum: ['House', 'Condo', 'Townhouse', 'Land'],
        required: true
    },
    bedrooms: {
        type: Number,
        default: 0
    },
    bathrooms: {
        type: Number,
        default: 0
    },
    location: {
        address: String,
        district: String,
        province: String,
        zipcode: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    images: [
        {
            url: String,
            alt: String
        }
    ],
    amenities: [String],
    features: [String],
    status: {
        type: String,
        enum: ['active', 'sold', 'rented', 'inactive'],
        default: 'active'
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: String,
    ownerPhone: String,
    ownerEmail: String,
    reviews: [
        {
            userId: mongoose.Schema.Types.ObjectId,
            userName: String,
            rating: Number,
            comment: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    viewCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default propertySchema;
