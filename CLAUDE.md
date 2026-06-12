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
| `App.jsx` | Root component — จัดการ routing หลักด้วย **React Router (`Routes`/`Route`)** (`utils/routing.js` เหลือแค่ `appRoutes` ใช้เช็ค layout class) |
| `main.jsx` | Entry point |
| `pages/AuthPage.jsx` | หน้า login/signup (email-password + OAuth: Google, Facebook, GitHub) |
| `pages/ChangePasswordPage.jsx` | หน้าเปลี่ยนรหัสผ่าน |
| `pages/HomePage.jsx` | หน้าแรก/landing |
| `pages/SearchPage.jsx`, `pages/SearchPageWithDB.jsx` | หน้าค้นหา/filter ประกาศ — **มี 2 ไฟล์ที่ดูซ้ำซ้อนกัน ควรเช็คว่าตัวไหนยังใช้งานจริงแล้วลบตัวที่ไม่ใช้ทิ้ง** |
| `pages/PropertyPage.jsx` | หน้ารายการประกาศของฉัน (`/my-listings`) |
| `pages/PropertyDetailPage.jsx` | หน้ารายละเอียดประกาศ (`/property/:id`) |
| `pages/ProfilePage.jsx` | หน้าโปรไฟล์ผู้ใช้ |
| `pages/ReviewsPage.jsx` | หน้ารีวิว — เลือกประกาศจากรายการจริง แล้วโพสต์/แสดงรีวิวผ่าน backend (`POST/GET /api/properties/:id` + `reviews` field) |
| `pages/MessagesPage.jsx` | หน้าแชท/กล่องข้อความ — realtime ผ่าน socket.io (typing, presence, unread, read receipt, edit/unsend/hide message) |
| `pages/AppLayout.jsx` | Layout หลัก (navigation, theme toggle light/dark, logout) |
| `components/PostPropertyForm.jsx` | ฟอร์มลงประกาศขาย/ให้เช่า |
| `components/MyListings.jsx` | จัดการประกาศของผู้ใช้เอง |
| `components/PropertyDetail.jsx` | แสดงรายละเอียดประกาศแบบเต็ม |
| `components/PropertyManagement.jsx` | จัดการประกาศ (แก้ไข/ลบ) |
| `services/propertyApi.js` | HTTP client เรียก backend property API |
| `services/messageApi.js` | HTTP client เรียก backend conversation/message API |
| `services/socketService.js` | จัดการ socket.io client connection (chat realtime) |
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
| `src/property.routes.js` | CRUD ประกาศอสังหาฯ (`/api/properties/*`) รวมถึง `POST /api/properties/:id/reviews` |
| `src/message.routes.js` | Conversation/message API (`/api/conversations/*`) — list/create conversation, ส่ง/แก้ไข/unsend/hide ข้อความ, mark-as-read |
| `src/socket.js` | ตั้งค่า socket.io server — auth ผ่าน JWT, presence, typing, join conversation room |
| `src/oauth.routes.js` | OAuth 2.0 flow (Google, Facebook, GitHub) |
| `src/password.routes.js` | เปลี่ยนรหัสผ่าน |
| `src/auth-utils.js` | สร้าง/จัดการ JWT token |
| `authmiddleware/auth.js` | Middleware ตรวจสอบ JWT (จาก cookie หรือ `Authorization: Bearer`) |
| `data/user.schema.js`, `data/user.model.js` | Mongoose schema/model ของ User |
| `data/property.schema.js`, `data/property.model.js` | Mongoose schema/model ของ Property (มี `reviews` array embedded) |
| `data/conversation.schema.js`, `data/conversation.model.js` | Mongoose schema/model ของ Conversation |
| `data/message.schema.js`, `data/message.model.js` | Mongoose schema/model ของ Message (มี `edited`, `editHistory`, `deletedFor`, `readBy`) |
| `mongodb/connectDB.js` | เชื่อมต่อ MongoDB Atlas |

## ฟีเจอร์ที่ต้องมี (ตามที่กำหนดไว้สำหรับโปรเจคนี้)

1. **หน้า Authentication** — ระบบสมัคร/เข้าสู่ระบบ (มีอยู่แล้ว: email-password + OAuth ผ่าน `pages/AuthPage.jsx` และ backend `/register`, `/login`, `/auth/:provider`)
2. **ระบบคุยกับผู้ใช้คนอื่น (chat/messaging)** — **มีแล้ว** (`pages/MessagesPage.jsx` + `src/message.routes.js` + `src/socket.js`) รองรับ realtime (typing/presence/read receipt), แก้ไข/unsend/ลบฝ่ายเดียว
3. **โพสต์/ลบประกาศขายบ้านได้เอง** — มีโครงอยู่แล้ว (`PostPropertyForm.jsx`, `MyListings.jsx`, backend `POST/PUT/DELETE /api/properties/:id` พร้อมตรวจสอบว่าเป็นเจ้าของประกาศ)

## ข้อควรระวัง / สิ่งที่รู้อยู่แล้ว

- **`backend/.env` และ `frontend/my-project/.env` ถูก commit เข้า git ไปแล้ว** มี MongoDB connection string และ JWT `SECRET_KEY` อยู่ในนั้น — ต้อง rotate credentials และเพิ่มใน `.gitignore` ก่อนทำงานต่อ (ถือว่ารั่วแล้ว)
- Frontend ใช้ React Router (`Routes`/`Route` ใน `App.jsx`) — ถ้าจะเพิ่มหน้าใหม่ ให้เพิ่ม `<Route>` ใน `App.jsx` และถ้าต้องการ layout แบบ estate-shell ให้เพิ่ม path เข้า `appRoutes` หรือ prefix check ใน `RootShell`
- ไม่มี state management library (ใช้ React hooks ล้วน)
- `apiUrl` ถูกประกาศซ้ำในหลายไฟล์ (`AppLayout.jsx`, `ProfilePage.jsx`, `PropertyPage.jsx`, `services/propertyApi.js`) — ไฟล์ใหม่ควร import จาก `config/api.js` แทนการประกาศซ้ำ
- `frontend/my-project/.git` เป็น git repo ซ้อนแยกจาก repo หลัก (ของเดิมจาก `npm create vite`, มี merge ค้างอยู่) — อย่ารัน git command จากในโฟลเดอร์นี้ จะสับสนกับ repo หลักที่ root

## แนวทางการทำงานร่วมกับ Claude ในโปรเจคนี้

- **แยกงานเป็น prompt ละเรื่อง** ไม่รวมหลายฟีเจอร์ในคำสั่งเดียว — diff เล็ก รีวิวง่าย และ build ขึ้นทีละ commit
- **ไม่ต้อง paste โค้ด** บอก path ไฟล์ก็พอ Claude อ่านไฟล์ปัจจุบันในโปรเจคได้เอง (paste มีประโยชน์เฉพาะไฟล์ที่ยังไม่ save)
- ถ้างานมี **จุดต้องตัดสินใจ** (เลือก service ภายนอก เช่น Cloudinary, เปลี่ยนโครงสร้างข้อมูล/schema ที่กระทบของเดิม) ให้ flag trade-off ให้ผู้ใช้เลือกก่อนเริ่ม implement ไม่ต้องเดาเอง
- งานด้าน UI มักจะ **iterate ทีละจุดเล็กๆ** จาก screenshot จริงที่ผู้ใช้แคปมาให้ (เช่น ปรับ context menu, toggle behavior, ตำแหน่งปุ่ม) — ปรับตามที่เห็นในภาพได้เลยโดยไม่ต้องถามซ้ำ
- ผู้ใช้จะถาม **% ความคืบหน้าของโปรเจค** เป็นระยะ — ประเมินจาก checklist ฟีเจอร์หลัก 3 อย่างด้านบน บวกรายการที่ยังค้างในหัวข้อนี้ และอัปเดตหัวข้อนี้เมื่อมีฟีเจอร์ใหม่เสร็จ
- สื่อสารเป็นภาษาไทย กระชับ ตรงประเด็น ไม่ต้องสรุปยาวท้ายข้อความถ้าไม่จำเป็น
