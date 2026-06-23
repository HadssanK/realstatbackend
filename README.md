# 🏠 RealState API

> A powerful, production-ready **Real Estate Backend** built with Node.js, Express, MongoDB & Cloudinary.  
> Handles everything from property listings to admin controls — clean, fast, and fully documented.

---

## ✨ What's Inside?

| Feature | Status |
|---------|--------|
| 🔐 JWT Authentication (Register/Login/Logout) | ✅ Done |
| 🏘️ Property Listings with Image Upload | ✅ Done |
| 🔍 Search & Filter Properties | ✅ Done |
| ✅ Admin Approval Workflow | ✅ Done |
| ⭐ Featured Listings | ✅ Done |
| 👥 User Management (Block/Unblock/Promote) | ✅ Done |
| 📊 Platform Statistics Dashboard | ✅ Done |
| 🗂️ Category Management | ✅ Done |
| 🛡️ Role-Based Access Control | ✅ Done |
| ☁️ Cloudinary Image Storage | ✅ Done |

---

## 🛠️ Tech Stack

```
Backend    → Node.js + Express.js
Database   → MongoDB (Mongoose)
Auth       → JWT (JSON Web Tokens)
Images     → Cloudinary + Multer
Security   → bcrypt password hashing
Runtime    → ES Modules (import/export)
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
cd server
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/realstate
PORT=3000
JWT_SECRET=your_super_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Create First Admin

```bash
node utils/createAdmin.js
```

This creates:
- **Email:** admin@realstate.com
- **Password:** Admin@123

### 4. Start the Server

```bash
npm run dev       # Development (nodemon)
```

Server runs at → `http://localhost:3000`

---

## 📁 Project Structure

```
server/
├── config/
│   ├── db.js               # MongoDB connection
│   └── cloudnary.js        # Cloudinary setup
├── controllers/
│   ├── authController.js   # Register, Login, Logout
│   ├── propertyController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   ├── roleMiddleware.js   # Role-based access
│   └── uploadMiddleware.js # Multer file upload
├── models/
│   ├── register.js         # User model
│   ├── Property.js         # Property model
│   ├── Category.js         # Category model
│   └── Inquiry.js          # Inquiry model
├── routes/
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── generateToken.js
│   └── createAdmin.js      # One-time admin seed
├── .env
└── server.js
```

---

## 📡 API Reference

> Base URL: `http://localhost:3000/api`

---

### 🔐 Auth Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Create new account |
| POST | `/auth/login` | Public | Login & get token |
| POST | `/auth/logout` | 🔒 Token | Logout |
| GET | `/auth/me` | 🔒 Token | Get current user |

#### Register Body
```json
{
  "name": "Hassan Ali",
  "email": "hassan@gmail.com",
  "password": "123456",
  "phoneNumber": 3001234567
}
```

#### Login Body
```json
{
  "email": "hassan@gmail.com",
  "password": "123456"
}
```

---

### 🏘️ Property Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/properties` | Public | All approved properties |
| GET | `/properties/featured` | Public | Featured listings (homepage) |
| GET | `/properties/:id` | Public | Single property detail |
| GET | `/properties/user/my-properties` | 🔒 Token | My own listings |
| POST | `/properties` | 🔒 Token | Create new listing |
| PUT | `/properties/:id` | 🔒 Owner/Admin | Update listing |
| DELETE | `/properties/:id` | 🔒 Owner/Admin | Delete listing |

#### Create Property (form-data)

| Field | Type | Required | Example |
|-------|------|----------|---------|
| title | Text | ✅ | Dream Villa Lahore |
| description | Text | ✅ | Beautiful 3 bed villa |
| price | Text | ✅ | 15000000 |
| propertyType | Text | ✅ | Villa / House / Apartment / Plot / Commercial |
| listingType | Text | ✅ | Sale / Rent |
| bedrooms | Text | ✅ | 3 |
| bathrooms | Text | ✅ | 2 |
| area | Text | ✅ | 2000 |
| address | Text | ✅ | 12 Garden Town |
| city | Text | ✅ | Lahore |
| country | Text | ✅ | Pakistan |
| lat | Text | ❌ | 31.5204 |
| lng | Text | ❌ | 74.3587 |
| parking | Text | ❌ | true / false |
| pool | Text | ❌ | true / false |
| gym | Text | ❌ | true / false |
| garden | Text | ❌ | true / false |
| security | Text | ❌ | true / false |
| elevator | Text | ❌ | true / false |
| status | Text | ❌ | Available / Sold / Rented |
| images | File | ✅ | Max 10 images, 10MB each |

#### Filter Properties (Query Params)
```
/api/properties?city=Lahore&listingType=Sale&propertyType=Villa&minPrice=5000000&maxPrice=30000000&bedrooms=3&page=1&limit=10
```

---

### 🛡️ Admin — Property Workflow

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/properties/admin/pending` | All pending properties |
| PATCH | `/properties/admin/:id/approve` | Approve listing |
| PATCH | `/properties/admin/:id/reject` | Reject with reason |
| PATCH | `/properties/admin/:id/featured` | Toggle featured on/off |

#### Reject Body
```json
{
  "reason": "Images are not clear enough"
}
```

---

### 👥 Admin — User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | All users (paginated) |
| GET | `/admin/users/:id` | Single user |
| PATCH | `/admin/users/:id/block` | Block / Unblock toggle |
| PATCH | `/admin/users/:id/promote` | Promote to Agent |
| DELETE | `/admin/users/:id` | Delete user |

#### Filter Users (Query Params)
```
/api/admin/users?role=agent&isBlocked=false&page=1&limit=10
```

---

### 📊 Admin — Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Full platform statistics |

#### Stats Response
```json
{
  "users": { "total": 50, "agents": 10, "buyers": 39, "blocked": 1 },
  "properties": { "total": 100, "pending": 5, "approved": 90, "rejected": 5, "featured": 8 },
  "inquiries": { "total": 200 }
}
```

---

### 🗂️ Categories

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/categories` | Public | All active categories |
| GET | `/admin/categories` | 🔒 Admin | All categories |
| POST | `/admin/categories` | 🔒 Admin | Create category |
| PUT | `/admin/categories/:id` | 🔒 Admin | Update category |
| DELETE | `/admin/categories/:id` | 🔒 Admin | Delete category |

#### Create Category Body
```json
{
  "name": "Villa",
  "description": "Luxury villa properties"
}
```

---

## 👤 User Roles

| Role | Can Do |
|------|--------|
| **Buyer** (default) | Browse properties, send inquiries |
| **Agent** | Everything + create/edit/delete own listings |
| **Admin** | Full platform control |

> ⚠️ Role cannot be set during registration — prevents privilege escalation.  
> Admin is assigned directly via DB or `createAdmin.js` script.

---

## 🔒 Authentication

All protected routes require:

```
Authorization: Bearer <your_jwt_token>
```

Token is returned on login and expires in **7 days**.

---

## 📬 Postman Collection

Import `RealState_API.postman_collection.json` into Postman.

**Set these variables in the collection:**

| Variable | Where to get it |
|----------|----------------|
| `token` | Login response → copy `token` |
| `admin_token` | Admin login response → copy `token` |
| `property_id` | Create/Get property → copy `_id` |
| `user_id` | Get users → copy any `_id` |
| `category_id` | Create category → copy `_id` |

---

## ⚙️ Environment Variables Reference

| Key | Description |
|-----|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default: 3000) |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for emails |
| `EMAIL_PASS` | Gmail App Password (not real password) |

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| bcrypt | Password hashing |
| jsonwebtoken | JWT auth |
| cloudinary | Image cloud storage |
| multer | File upload handling |
| dotenv | Environment variables |
| nodemailer | Email sending |
| nodemon | Dev auto-restart |

---

## 🧑‍💻 Author

Built with ❤️ by **Hassan**

---

> 💡 **Tip:** Use the Postman collection to test all APIs in order — Register → Login → Create Property → Admin Approve → View Featured.
