# วิธีอัปโหลดขึ้น GitHub แล้วได้ลิงก์เว็บ (GitHub Pages)

โค้ดพร้อม commit แล้ว ทำแค่ 3 ขั้นตอนนี้:

---

## 1. สร้าง repo บน GitHub

1. ไปที่ [github.com/new](https://github.com/new)
2. **Repository name**: ใส่ `bts-route-guide` (หรือชื่ออื่นที่ชอบ)
3. เลือก **Public** → กด **Create repository** (ไม่ต้องใส่ README / .gitignore เพราะมีอยู่แล้ว)

---

## 2. Push โค้ดขึ้น GitHub

ในเทอร์มินัล (อยู่ที่โฟลเดอร์โปรเจกต์) รันตามที่ GitHub แสดง เช่น:

```bash
cd /Users/willy/bts-route-guide

git remote add origin https://github.com/<USERNAME>/bts-route-guide.git
git branch -M main
git push -u origin main
```

แทน `<USERNAME>` ด้วยชื่อ GitHub ของคุณ  
(ถ้าใช้ SSH ให้ใช้ `git@github.com:<USERNAME>/bts-route-guide.git` แทน)

---

## 3. เปิด GitHub Pages

1. ใน repo ที่สร้าง → แท็บ **Settings** → ซ้ายมือเลือก **Pages**
2. **Build and deployment** → **Source** เลือก **Deploy from a branch**
3. **Branch** เลือก **main** และ **/ (root)** → กด **Save**
4. รอ 1–2 นาที

---

## ลิงก์เว็บของคุณ

หลัง Pages ทำงานแล้ว จะเข้าได้ที่:

**https://\<USERNAME>.github.io/bts-route-guide/**

แทน `<USERNAME>` ด้วยชื่อ GitHub จริง เช่น ถ้าชื่อ `willy` ลิงก์คือ:

**https://willy.github.io/bts-route-guide/**

ถ้าตั้งชื่อ repo อื่น (ไม่ใช่ `bts-route-guide`) ให้ใช้ชื่อนั้นใน URL แทน

---

## ถ้าใช้ GitHub Actions แล้วเว็บไม่ขึ้น

1. **ตั้ง Source เป็น GitHub Actions**  
   **Settings** → **Pages** → **Build and deployment** → **Source** เลือก **GitHub Actions** (ไม่ใช่ Deploy from a branch) → **Save**

2. **เช็คว่า workflow deploy จาก root**  
   โปรเจกต์นี้ไม่มีโฟลเดอร์ `_site` หรือ `dist` — ไฟล์อยู่ที่ root (`index.html` ฯลฯ)  
   ใน `.github/workflows` ต้องมีขั้น `Upload artifact` ที่ใช้ **path: "."**  
   ใน repo มีไฟล์ `.github/workflows/pages.yml` ที่ตั้งค่าไว้แล้ว

3. **Push workflow แล้วดูที่ Actions**  
   Push โค้ดขึ้นไปแล้วไปที่แท็บ **Actions** ใน repo ดูว่า workflow รันผ่าน (เขียว) หรือไม่  
   ถ้า fail ให้เปิด run ล่าสุดดู error

4. **รอ 1–2 นาที** หลัง deploy สำเร็จแล้วลิงก์ถึงจะเข้าได้
