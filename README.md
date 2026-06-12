# Loginweb — Real Estate Marketplace

Marketplace อสังหาริมทรัพย์สำหรับขาย/ให้เช่าบ้าน คอนโด ทาวน์เฮาส์ และที่ดิน ผู้ใช้ติดต่อกันโดยตรง (ไม่ผ่านนายหน้า) มีระบบส่วนกลางดูแลความปลอดภัยและความน่าเชื่อถือของประกาศ

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS (`frontend/my-project`)
- **Backend**: Node.js + Express 5 + MongoDB/Mongoose (`backend`)
- **Realtime**: Socket.io (แชท, presence, typing, read receipt)
- **Auth**: JWT (email/password) + OAuth 2.0 (Google, Facebook, GitHub)
- **Image hosting**: Cloudinary (รูปโปรไฟล์)

## โครงสร้างโปรเจค

```
loginweb/
├── frontend/my-project/   React 19 + Vite + Tailwind CSS
└── backend/               Node.js + Express 5 + MongoDB/Mongoose
```

## การติดตั้งและรัน

**Frontend** (`cd frontend/my-project`):
```bash
npm install
npm run dev      # dev server (Vite)
npm run build    # build สำหรับ production
npm run lint     # ESLint
```

**Backend** (`cd backend`):
```bash
npm install
npm run dev      # watch mode (node --env-file=.env --watch src/server.js)
npm start        # รันปกติ
```

### Environment Variables

**`backend/.env`**
```
MONGODB_URI=...
SECRET_KEY=...
NODE_ENV=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**`frontend/my-project/.env`**
```
VITE_API_URL=...
```

## ฟีเจอร์ที่ทำเสร็จแล้ว

1. **Authentication** — สมัคร/เข้าสู่ระบบด้วย email-password และ OAuth (Google, Facebook, GitHub) พร้อมหน้าเปลี่ยนรหัสผ่าน
2. **Chat / Messaging แบบ realtime** — คุยกับผู้ใช้คนอื่นผ่าน socket.io รองรับ:
   - typing indicator, presence (online/offline)
   - read receipt (อ่านแล้ว/ส่งแล้ว)
   - แก้ไขข้อความ (แสดง "(แก้ไขแล้ว)" พร้อมดู edit history)
   - ลบข้อความ: unsend (ลบทั้งสองฝ่าย, เฉพาะเจ้าของ) และลบฝ่ายเดียว (ซ่อนเฉพาะตัวเอง)
   - เมนูตัวเลือกข้อความผ่านปุ่ม "⋯" (toggle เปิด/ปิด)
3. **โพสต์/จัดการประกาศ** — สร้าง/แก้ไข/ลบประกาศของตัวเอง (`PostPropertyForm`, `MyListings`) พร้อมตรวจสอบความเป็นเจ้าของฝั่ง backend
4. **ค้นหา/filter ประกาศ** (`SearchPage`) — แสดงชื่อและรูปผู้โพสต์ในการ์ดประกาศ พร้อมลิงก์ไปหน้าโปรไฟล์
5. **รีวิว** (`ReviewsPage`) — เลือกประกาศจริงจากระบบ แล้วโพสต์/แสดงรีวิวที่ผูกกับ property นั้นผ่าน backend
6. **โปรไฟล์ผู้ใช้** — แก้ไขชื่อ-นามสกุล และอัปโหลดรูปโปรไฟล์ขึ้น Cloudinary (`POST /profile/avatar`)

## ที่ยังค้างอยู่ / ควรทำต่อ

- ⚠️ `backend/.env` และ `frontend/my-project/.env` ยังถูก commit เข้า git — ต้อง rotate credentials (MongoDB URI, JWT secret) แล้วเพิ่มเข้า `.gitignore`
- ยังไม่มี automated test (unit/integration)
- มี `.git` ซ้อนอยู่ใน `frontend/my-project` (เศษจาก `npm create vite`) ควรเอาออก
