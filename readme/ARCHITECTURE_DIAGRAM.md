# 🏗️ System Architecture & Data Flow

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   App.jsx (Router)                         │ │
│  │  /home → HomePage                                         │ │
│  │  /search → SearchPageWithDB (Database-driven)             │ │
│  │  /properties → PropertyPage (Dashboard)                   │ │
│  │  /profile → ProfilePage                                   │ │
│  │  /reviews → ReviewsPage                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↑ ↓                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            Components & Pages                              │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │ PropertyPage (Auth wrapper)                        │   │ │
│  │  │   └→ PropertyManagement (Container)                │   │ │
│  │  │        ├→ MyListings (Dashboard)                   │   │ │
│  │  │        ├→ PostPropertyForm (Create/Edit)          │   │ │
│  │  │        └→ PropertyDetail (View + Reviews)         │   │ │
│  │  └────────────────────────────────────────────────────┘   │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │ SearchPageWithDB                                   │   │ │
│  │  │   ├→ Filters (Type, Price, Sort)                   │   │ │
│  │  │   ├→ Property Cards (Grid)                         │   │ │
│  │  │   └→ PropertyDetail (on click)                     │   │ │
│  │  └────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↑ ↓                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            API Service Layer                               │ │
│  │  propertyApi.js                                           │ │
│  │  ├→ fetchProperties()                                    │ │
│  │  ├→ fetchPropertyById()                                 │ │
│  │  ├→ createProperty()                                    │ │
│  │  ├→ updateProperty()                                    │ │
│  │  ├→ deleteProperty()                                    │ │
│  │  ├→ fetchUserProperties()                               │ │
│  │  └→ addReview()                                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
  │
  │ HTTP + Cookies (JWT Auth)
  │
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Express)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  server.js (Main)                                        │   │
│  │  ├→ Auth Middleware                                      │   │
│  │  ├→ CORS Config                                          │   │
│  │  ├→ OAuth Routes (Google, Facebook, GitHub)             │   │
│  │  ├→ Password Routes (Reset, Change)                     │   │
│  │  └→ Property Routes ✨ NEW                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  property.routes.js (7 Endpoints)                        │   │
│  │  ├→ POST   /api/properties           (Create)            │   │
│  │  ├→ GET    /api/properties           (List All)          │   │
│  │  ├→ GET    /api/properties/:id       (Get Single)        │   │
│  │  ├→ GET    /api/user/properties      (User's List)       │   │
│  │  ├→ PUT    /api/properties/:id       (Update)            │   │
│  │  ├→ DELETE /api/properties/:id       (Delete)            │   │
│  │  └→ POST   /api/properties/:id/reviews (Review)          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Models & Schema                                         │   │
│  │  ├→ property.model.js (Mongoose)                         │   │
│  │  └→ property.schema.js (MongoDB Schema)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Database Connection                                     │   │
│  │  connectDB.js (MongoDB)                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
  │
  │ Mongoose ODM
  │
┌─────────────────────────────────────────────────────────────────┐
│                 MongoDB Database                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Collection: "properties"                                │   │
│  │  ├→ _id (ObjectId)                                       │   │
│  │  ├→ title, description                                   │   │
│  │  ├→ price, pricePerUnit, area                            │   │
│  │  ├→ propertyType (House/Condo/Townhouse/Land)           │   │
│  │  ├→ bedrooms, bathrooms                                  │   │
│  │  ├→ location (address, district, province, zipcode)     │   │
│  │  ├→ images (array with url, alt)                         │   │
│  │  ├→ amenities, features (arrays)                         │   │
│  │  ├→ ownerId (ref to User)                                │   │
│  │  ├→ status (active/sold/rented/inactive)                 │   │
│  │  ├→ reviews (array with userId, rating, comment, date)  │   │
│  │  ├→ viewCount                                            │   │
│  │  ├→ createdAt, updatedAt                                 │   │
│  │  └→ isFeatured                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Collection: "users"                                     │   │
│  │  └→ (existing, used for ownership)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagram

```
┌──────────────┐
│   Start      │
│  (Not Auth)  │
└──────┬───────┘
       │
       ├─────→ /search ─────→ SearchPageWithDB
       │                     ├→ Browse properties
       │                     ├→ View details
       │                     └→ (Can't post/edit)
       │
       ├─────→ LOGIN/REGISTER
       │
       └─────→ /properties ─→ PropertyPage (Auth Check)
                              ├→ ✓ Logged In
                              └→ PropertyManagement
                                  │
                                  ├→ View "MyListings"
                                  │  ├─ Click Title → PropertyDetail
                                  │  ├─ Click Edit → PostPropertyForm
                                  │  └─ Click Delete → Confirm → Delete
                                  │
                                  ├→ Click "Post New" → PostPropertyForm
                                  │  ├─ Fill form
                                  │  ├─ Add images
                                  │  ├─ Add amenities
                                  │  └─ Submit → Create Property
                                  │
                                  └→ View Property Details
                                     ├─ Gallery
                                     ├─ Info
                                     ├─ Reviews
                                     └─ Add Review
```

---

## Data Model

### Property Schema

```javascript
{
  _id: ObjectId,

  // Basic Info
  title: String (required),
  description: String (required),

  // Pricing
  price: Number (required),
  pricePerUnit: Number,

  // Size
  area: Number (required, sqm),

  // Type
  propertyType: "House|Condo|Townhouse|Land",

  // Rooms
  bedrooms: Number,
  bathrooms: Number,

  // Location
  location: {
    address: String,
    district: String,
    province: String,
    zipcode: String,
    coordinates: { latitude, longitude }
  },

  // Media
  images: [{
    url: String,
    alt: String
  }],

  // Features
  amenities: [String],  // Pool, Gym, etc
  features: [String],   // Near BTS, etc

  // Ownership
  ownerId: ObjectId (ref: User),
  ownerName: String,
  ownerEmail: String,
  ownerPhone: String,

  // Status
  status: "active|sold|rented|inactive",
  isFeatured: Boolean,

  // Reviews
  reviews: [{
    userId: ObjectId,
    userName: String,
    rating: Number (1-5),
    comment: String,
    createdAt: Date
  }],

  // Metrics
  viewCount: Number,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Request/Response Flow

### Example: Create Property

```
Client Request:
┌─────────────────────────┐
│ POST /api/properties    │
│ Headers: {              │
│   Content-Type: json    │
│   Cookie: jwt_token     │
│ }                       │
│ Body: {                 │
│   title, description,   │
│   price, area, ...      │
│ }                       │
└────────┬────────────────┘
         │
         ↓ Middleware
┌─────────────────────────┐
│ authUser (verify JWT)   │
│ → req.user.id extracted │
└────────┬────────────────┘
         │
         ↓ Route Handler
┌─────────────────────────┐
│ Create Property object  │
│ Set ownerId = req.user  │
│ Validate fields         │
│ Save to MongoDB         │
└────────┬────────────────┘
         │
         ↓ Response
┌─────────────────────────┐
│ Status: 201             │
│ Body: {                 │
│   property: { ... }     │
│ }                       │
└─────────────────────────┘
         │
         ↓ Client
┌─────────────────────────┐
│ Update component state  │
│ Show success message    │
│ Redirect to listings    │
└─────────────────────────┘
```

---

## State Management

### PropertyManagement (Parent State)

```javascript
const [view, setView] = useState("listings");
// 'listings' | 'post' | 'edit' | 'detail'

const [selectedProperty, setSelectedProperty] = useState(null);
// Current property for edit/view

// Routes between views:
// listings → post (new)
// listings → edit (existing)
// listings → detail (view only)
// any → listings (back)
```

### PostPropertyForm (Local State)

```javascript
const [formData, setFormData] = useState({
  title,
  description,
  price,
  area,
  propertyType,
  bedrooms,
  bathrooms,
  location,
  images,
  amenities,
  features,
  ownerPhone,
});

const [amenityInput, setAmenityInput] = useState("");
const [featureInput, setFeatureInput] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

### MyListings (Local State)

```javascript
const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [deleteConfirm, setDeleteConfirm] = useState(null);
// null | propertyId
```

---

## Authentication Flow

```
1. User Logs In
   ├→ Credentials sent to /auth endpoint
   ├→ Password hashed & verified
   └→ JWT created & sent as HTTP-only cookie

2. User Accesses /properties
   ├→ PropertyPage checks auth (fetches /api/user/properties)
   ├→ Cookie sent with request
   ├→ Backend verifies JWT in middleware
   └→ ✓ Access granted OR ✗ Redirect to login

3. User Creates Property
   ├→ PostPropertyForm submits POST /api/properties
   ├→ Cookie sent automatically
   ├→ Backend verifies JWT
   ├→ authUser middleware extracts req.user.id
   ├→ Property saved with ownerId = req.user.id
   └→ Response sent back

4. User Edits Property
   ├→ PUT /api/properties/:id
   ├→ Backend checks: property.ownerId === req.user.id
   ├→ ✓ Owner → Update allowed
   └→ ✗ Not owner → Return 403 Forbidden

5. User Deletes Property
   ├→ DELETE /api/properties/:id
   ├→ Backend checks: property.ownerId === req.user.id
   ├→ ✓ Owner → Delete allowed
   └→ ✗ Not owner → Return 403 Forbidden
```

---

## Component Hierarchy

```
App
├── HomePage
├── SearchPageWithDB
│   └── PropertyDetail (on click)
├── PropertyPage
│   └── PropertyManagement
│       ├── MyListings
│       │   ├── Property Cards
│       │   └── PropertyDetail (on view)
│       ├── PostPropertyForm
│       │   ├── Image Upload
│       │   ├── Amenity Tags
│       │   └── Feature Tags
│       └── PropertyDetail
│           ├── Image Gallery
│           ├── Property Info
│           └── Review Form
├── ProfilePage
└── ReviewsPage
```

---

## Filter & Sort Logic

### SearchPageWithDB Filtering

```javascript
// Build filter object
let filter = { status: "active" };

if (propertyType !== "all") filter.propertyType = propertyType;

if (minPrice) filter.price.$gte = minPrice;

if (maxPrice) filter.price.$lte = maxPrice;

// Build sort object
let sortOption = {};
switch (sortBy) {
  case "newest":
    sortOption = { createdAt: -1 };
  case "priceLow":
    sortOption = { price: 1 };
  case "priceHigh":
    sortOption = { price: -1 };
  case "featured":
    filter.isFeatured = true;
    sortOption = { createdAt: -1 };
  default:
    sortOption = { isFeatured: -1, createdAt: -1 };
}

// Query with mongoose
Property.find(filter).sort(sortOption);
```

---

## Error Handling

```
┌────────────────────────────────────────┐
│      User Action (Create/Edit)         │
└────────┬─────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│ Validation (Client-side)               │
│ ├→ Required fields present?            │
│ ├→ Price is number?                    │
│ └→ Show error if validation fails      │
└────────┬─────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│ API Request                            │
│ ├→ Try/catch block                     │
│ ├→ Await response                      │
│ └→ Check response.ok                   │
└────────┬─────────────────────────────────┘
         │
         ├─→ Success (200-201)
         │   └→ Update state
         │   └→ Show success
         │
         └─→ Error (400-500)
             ├→ Parse error message
             ├→ Display to user
             └→ Log in console
```

This architecture ensures:
✅ Separation of concerns
✅ Reusable components
✅ Scalable backend
✅ Secure ownership
✅ Clean data flow
