# Attaa (عطاء) — 100% Free Community Donation & Gifting Platform

> **"And whatever good you put forward for yourselves, you will find it with Allah. It is better and greater in reward."**  
> *(Surah Al-Muzzammil 73:20)*

**Attaa (عطاء)** is a full-stack, non-profit, community-driven donation web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS**. 

The platform allows community members to give away items they no longer need (clothes, furniture, appliances, electronics, baby gear, books) for **FREE** to people in need, preventing waste, protecting the environment, and fostering social solidarity.

---

## 🚫 CRITICAL PLATFORM RULE: Zero-Commerce Policy
**Absolutely NO buying, selling, or monetary transactions are permitted.** Everything listed on Attaa is a gift given **Fi Sabilillah (في سبيل الله)**. Users may not ask for delivery fees, deposits, or trade-ins. A built-in reporting system allows moderators to swiftly ban fraudulent listings.

---

## ✨ Key Features & Highlights

### 1. 🛡️ Trust, Safety & Ethics
* **Prominent Safety Disclaimers**: Clarifies at every step that all items are 100% free gifts.
* **Listing Reporting System**: Allows community members to report items for commercial selling, money requests, scams, or inaccurate photos.
* **Mandatory Fi Sabilillah Checkbox**: Donators explicitly agree that their item is 100% free before publishing.

### 2. 📱 Ultra-Accessible UI/UX
* **Designed for all age groups & digital literacy levels** (senior citizens and young users alike).
* **Large touch targets & high-contrast typography** (minimum 44px buttons, high contrast ratios).
* **Live Visual Badges**:
  * 🟢 **Available** (Ready for pickup)
  * 🟡 **Reserved** (Pending community member pickup)
  * ⚪ **Given Away** (Successfully donated Fi Sabilillah)
* **Single-Click WhatsApp & Phone Calling**:
  * Direct WhatsApp integration (`wa.me`) with courteous, pre-filled community greeting in English & Arabic.
  * Direct phone calling button (`tel:`) for immediate verbal coordination.

### 3. 🔍 Smart Discovery & Browsing
* Real-time search across titles, descriptions, cities, and neighborhoods.
* Filter pills by Category: *Clothing, Furniture & Home, Electronics, Books, Kids & Toys, Appliances, Others*.
* City filter dropdown (Casablanca, Rabat, Marrakech, Tangier, etc.).
* Condition filters (*New, Excellent, Good, Needs Minor Repair*).

### 4. 🖼️ Resilient Dual-Mode Image Uploads
* Supports **Cloudinary Cloud Storage** when API keys are configured.
* **Automatic Local Disk Fallback** to `./backend/uploads` when Cloudinary keys are absent, ensuring developers can test and run the app immediately out of the box without signing up for third-party services!

### 5. 👤 Simple Profile & Item Management
* Streamlined registration with Phone/Email + City.
* "My Posted Items" dashboard allowing donators to change item statuses or delete items once gifted.

---

## 🏗️ Project Architecture

```
attaa/
├── backend/
│   ├── config/
│   │   ├── db.js             # MongoDB connection logic
│   │   └── cloudinary.js     # Cloudinary configuration & fallback checker
│   ├── controllers/
│   │   ├── authController.js   # Register, Login (Phone/Email), Profile
│   │   ├── itemController.js   # CRUD, Status updates, filtering & search
│   │   └── reportController.js # Safety reporting & moderation
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT token verification
│   │   └── uploadMiddleware.js # Multer multipart storage (Cloudinary / Disk)
│   ├── models/
│   │   ├── User.js           # User schema with bcrypt password hashing
│   │   ├── Item.js           # Item schema with categories, condition & status
│   │   └── Report.js         # Report schema for fraud prevention
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth endpoints
│   │   ├── itemRoutes.js     # /api/items endpoints
│   │   └── reportRoutes.js   # /api/reports endpoints
│   ├── uploads/              # Local image storage folder (auto-created)
│   ├── .env.example          # Sample environment variables
│   ├── seed.js               # Initial sample data (furniture, clothes, appliances)
│   ├── package.json
│   └── server.js             # Express app entry point & static file serving
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive header & auth actions
│   │   │   ├── Footer.jsx           # Mission statement & spiritual quotes
│   │   │   ├── SafetyBanner.jsx     # High-contrast 100% free guarantee banner
│   │   │   ├── FilterBar.jsx        # Search bar, category pills & city filters
│   │   │   ├── ItemCard.jsx         # Card with status badge & time ago
│   │   │   ├── ItemGrid.jsx         # Responsive grid with skeleton loaders
│   │   │   ├── CreateItemModal.jsx  # Ultra-simple posting form with photo preview
│   │   │   ├── ItemDetailsModal.jsx # Large photo view, WhatsApp CTA, owner controls
│   │   │   ├── AuthModal.jsx        # Login & registration dialog
│   │   │   ├── MyItemsModal.jsx     # Donator's listing management
│   │   │   └── ReportModal.jsx      # Safe reporting modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global user state & JWT handling
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with auth interceptors
│   │   ├── App.jsx                  # Main page layout & coordination
│   │   ├── index.css                # Tailwind CSS layers & accessible styling
│   │   └── main.jsx                 # React root render
│   ├── index.html                   # HTML template with Google Fonts (Cairo & Inter)
│   ├── tailwind.config.js
│   ├── vite.config.js               # Vite proxy to backend API & uploaded images
│   ├── package.json
│   └── .env.example
├── package.json                     # Root orchestrator scripts
└── README.md
```

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
1. **Node.js** (v18+ recommended)
2. **MongoDB** (Local MongoDB instance or a free MongoDB Atlas connection URI)

---

### Step 1: Clone or Navigate to the Project
```bash
cd attaa
```

### Step 2: Configure Environment Variables

#### Backend `.env`
Create or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/attaa_db
JWT_SECRET=attaa_super_secret_jwt_key_2026_community
JWT_EXPIRE=30d

# Cloudinary (Optional: If empty, local disk storage /uploads is used automatically)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Frontend `.env`
Create or edit `frontend/.env`:
```env
VITE_API_URL=/api
```

---

### Step 3: Seed Sample Community Listings (Optional)
To populate your database with realistic sample items (dining table, washing machine, kids books, winter coats) across various cities:
```bash
npm run seed
```

---

### Step 4: Run the Application

#### Terminal 1 — Start the Backend Server:
```bash
cd backend
npm run dev
```
*API will start on `http://localhost:5000`*

#### Terminal 2 — Start the Frontend Development Server:
```bash
cd frontend
npm run dev
```
*Frontend will be accessible at `http://localhost:3000`*

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (Name, Phone, City, Password) |
| `POST` | `/api/auth/login` | Public | Login via Phone OR Email + Password |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user details |

### 📦 Item Listings (`/api/items`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/items` | Public | Filtered search (`search`, `category`, `city`, `condition`, `status`, `page`) |
| `GET` | `/api/items/:id` | Public | Get single item details (increments view count) |
| `POST` | `/api/items` | Private | Create new free item listing (Multipart form with images) |
| `PUT` | `/api/items/:id/status` | Private (Owner) | Update status (`Available`, `Reserved`, `Donated`) |
| `DELETE` | `/api/items/:id` | Private (Owner) | Remove item listing |
| `GET` | `/api/items/user/my-items` | Private | List all items posted by the logged-in user |

### 🚨 Moderation & Safety (`/api/reports`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/reports` | Public | Report an item listing for commercial sale, fraud, or abuse |
| `GET` | `/api/reports` | Private (Admin) | Review community reports |

---

## 💡 WhatsApp Integration Details
When a user clicks **"Contact via WhatsApp"** on any item, it triggers:
```javascript
const whatsappMessage = encodeURIComponent(
  `Salam Alaykum! I saw your free listing for "${item.title}" on the Attaa community platform. Is it still available? JazakAllah Khair!`
);
const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;
```
This reduces friction, prevents misunderstandings, and maintains a polite community tone.

---

## ⚖️ License
Distributed under the **MIT License**. Free for non-profit and community benefit.
