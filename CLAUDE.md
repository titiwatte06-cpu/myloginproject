# CLAUDE.md

คำแนะนำสำหรับ Claude Code เวลาทำงานในโปรเจคนี้

## โปรเจคนี้คืออะไร

**Marketplace อสังหาริมทรัพย์** สำหรับขาย/ให้เช่าบ้าน คอนโด ทาวน์เฮาส์ และที่ดิน โดยให้ผู้ใช้ติดต่อกันโดยตรง (ไม่ผ่านนายหน้า) แต่มีระบบส่วนกลางคอยดูแลความปลอดภัยและความน่าเชื่อถือของประกาศ

โครงสร้างเป็น monorepo แยก frontend และ backend:

```
loginweb/
├── frontend/my-project/   React 19 + Vite + Tailwind CSS
└── backend/               Node.js + Express 5 + MongoDB/Mongoose
```

## คำสั่งที่ใช้บ่อย

**Frontend** (`cd frontend/my-project`):
- `npm run dev` — รัน dev server (Vite)
- `npm run build` — build สำหรับ production
- `npm run lint` — รัน ESLint

**Backend** (`cd backend`):
- `npm run dev` — รัน server แบบ watch mode (`node --env-file=.env --watch src/server.js`)
- `npm start` — รัน server ปกติ

## Frontend — โครงสร้างไฟล์ (`frontend/my-project/src/`)

| ไฟล์/โฟลเดอร์ | หน้าที่ |
|---|---|
| `App.jsx` | Root component — จัดการ routing หลัก (manual `pushState`, ไม่ใช้ React Router) |
| `main.jsx` | Entry point |
| `pages/AuthPage.jsx` | หน้า login/signup (email-password + OAuth: Google, Facebook, GitHub) |
| `pages/ChangePasswordPage.jsx` | หน้าเปลี่ยนรหัสผ่าน |
| `pages/HomePage.jsx` | หน้าแรก/landing |
| `pages/SearchPage.jsx`, `pages/SearchPageWithDB.jsx` | หน้าค้นหา/filter ประกาศ — **มี 2 ไฟล์ที่ดูซ้ำซ้อนกัน ควรเช็คว่าตัวไหนยังใช้งานจริงแล้วลบตัวที่ไม่ใช้ทิ้ง** |
| `pages/PropertyPage.jsx` | หน้ารายละเอียดประกาศ |
| `pages/ProfilePage.jsx` | หน้าโปรไฟล์ผู้ใช้ |
| `pages/ReviewsPage.jsx` | หน้ารีวิว (ปัจจุบันเก็บใน localStorage ฝั่ง frontend เท่านั้น ยังไม่เชื่อม backend) |
| `pages/AppLayout.jsx` | Layout หลัก (navigation, theme toggle light/dark, logout) |
| `components/PostPropertyForm.jsx` | ฟอร์มลงประกาศขาย/ให้เช่า |
| `components/MyListings.jsx` | จัดการประกาศของผู้ใช้เอง |
| `components/PropertyDetail.jsx` | แสดงรายละเอียดประกาศแบบเต็ม |
| `components/PropertyManagement.jsx` | จัดการประกาศ (แก้ไข/ลบ) |
| `services/propertyApi.js` | HTTP client เรียก backend property API |
| `config/api.js` | export `apiUrl` จาก `VITE_API_URL` |
| `utils/validators.js` | `validateEmail`, `validatePassword` |
| `utils/routing.js` | helper สำหรับ manual routing: `navigate`, `getTokenFromUrl`, `appRoutes` |
| `styles/authStyles.js`, `styles/realEstate.css` | สไตล์หน้า auth และหน้าหลัก |
| `icon/Icon.jsx` | SVG icons (Google, Facebook, GitHub, Logo) |
| `../firebase/firebase.js` | ตั้งค่า Firebase Auth (Google OAuth provider) |

## Backend — โครงสร้างไฟล์ (`backend/`)

| ไฟล์/โฟลเดอร์ | หน้าที่ |
|---|---|
| `src/server.js` | Express app entry — route สมัคร/ล็อกอิน, profile, `/me` |
| `src/property.routes.js` | CRUD ประกาศอสังหาฯ (`/api/properties/*`) |
| `src/oauth.routes.js` | OAuth 2.0 flow (Google, Facebook, GitHub) |
| `src/password.routes.js` | เปลี่ยนรหัสผ่าน |
| `src/auth-utils.js` | สร้าง/จัดการ JWT token |
| `authmiddleware/auth.js` | Middleware ตรวจสอบ JWT (จาก cookie หรือ `Authorization: Bearer`) |
| `data/user.schema.js`, `data/user.model.js` | Mongoose schema/model ของ User |
| `data/property.schema.js`, `data/property.model.js` | Mongoose schema/model ของ Property |
| `mongodb/connectDB.js` | เชื่อมต่อ MongoDB Atlas |

## ฟีเจอร์ที่ต้องมี (ตามที่กำหนดไว้สำหรับโปรเจคนี้)

1. **หน้า Authentication** — ระบบสมัคร/เข้าสู่ระบบ (มีอยู่แล้ว: email-password + OAuth ผ่าน `pages/AuthPage.jsx` และ backend `/register`, `/login`, `/auth/:provider`)
2. **ระบบคุยกับผู้ใช้คนอื่น (chat/messaging)** — **ยังไม่มี** ต้องสร้างใหม่ทั้ง frontend (หน้าแชท, รายการบทสนทนา) และ backend (schema ข้อความ, API ส่ง/รับข้อความ, อาจพิจารณา WebSocket สำหรับ real-time)
3. **โพสต์/ลบประกาศขายบ้านได้เอง** — มีโครงอยู่แล้ว (`PostPropertyForm.jsx`, `MyListings.jsx`, backend `POST/PUT/DELETE /api/properties/:id` พร้อมตรวจสอบว่าเป็นเจ้าของประกาศ)

## ข้อควรระวัง / สิ่งที่รู้อยู่แล้ว

- **`backend/.env` และ `frontend/my-project/.env` ถูก commit เข้า git ไปแล้ว** มี MongoDB connection string และ JWT `SECRET_KEY` อยู่ในนั้น — ต้อง rotate credentials และเพิ่มใน `.gitignore` ก่อนทำงานต่อ (ถือว่ารั่วแล้ว)
- Frontend ใช้ manual routing ด้วย `window.history.pushState` ไม่ได้ใช้ React Router — ถ้าจะเพิ่มหน้าใหม่ ให้ทำตาม pattern เดิมใน `App.jsx` + `utils/routing.js`
- ไม่มี state management library (ใช้ React hooks ล้วน)
- `apiUrl` ถูกประกาศซ้ำในหลายไฟล์ (`AppLayout.jsx`, `ProfilePage.jsx`, `PropertyPage.jsx`, `services/propertyApi.js`) — ไฟล์ใหม่ควร import จาก `config/api.js` แทนการประกาศซ้ำ
- Reviews ระบบปัจจุบันเก็บใน localStorage เท่านั้น (มี backend route `/api/properties/:id/reviews` แล้วแต่ frontend ยังไม่เชื่อม)
