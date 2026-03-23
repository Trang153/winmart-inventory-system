# Winmart Dashboard

Project gom 2 phan:

- `frontend`: giao dien React + Vite
- `backend`: API Node.js + Express ket noi SQL Server

## 1. Yeu cau moi truong

- Node.js 18+ khuyen nghi
- SQL Server hoac SQL Server Express
- NPM

## 2. Cau truc thu muc

```text
.
|-- backend
|   |-- src
|   |-- sql/create_schema.sql
|   `-- .env.example
`-- frontend
    `-- src
```

## 3. Cai dat

Mo 2 terminal rieng.

### Backend

```powershell
cd backend
npm install
```

### Frontend

```powershell
cd frontend
npm install
```

## 4. Cau hinh backend

File cau hinh mau:

```powershell
backend/.env.example
```

File dang duoc dung:

```powershell
backend/.env
```

Noi dung hien tai:

```env
PORT=5000
DB_SERVER=DESKTOP-LDTAGN7
DB_INSTANCE=SQLEXPRESS
DB_NAME=WinmartDb
DB_TRUSTED_CONNECTION=true
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
JWT_SECRET=winmart_jwt_secret_key
JWT_EXPIRES_IN=1d
```

### Giai thich nhanh

- `PORT`: cong chay backend, mac dinh `5000`
- `DB_SERVER`: ten may SQL Server
- `DB_INSTANCE`: instance SQL Server, vi du `SQLEXPRESS`
- `DB_NAME`: ten database se duoc su dung
- `DB_TRUSTED_CONNECTION=true`: dang dung Windows Authentication
- `JWT_SECRET`: khoa ky token dang nhap

Neu khong dung Windows Authentication, can sua:

```env
DB_TRUSTED_CONNECTION=false
DB_USER=ten_dang_nhap_sql
DB_PASSWORD=mat_khau_sql
DB_PORT=1433
```

## 5. Khoi dong project

### Chay backend

```powershell
cd backend
npm run dev
```

Backend chay tai:

```text
http://localhost:5000
```

Swagger tai:

```text
http://localhost:5000/api/docs
```

Luu y: khi backend start, project se tu dong chay file:

```text
backend/sql/create_schema.sql
```

File nay se:

- tao database `WinmartDb` neu chua co
- tao bang du lieu
- seed du lieu mau

### Chay frontend

```powershell
cd frontend
npm run dev
```

Frontend thuong chay tai:

```text
http://localhost:5173
```

Frontend dang goi API theo bien:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Neu khong khai bao, code da mac dinh dung `http://localhost:5000`.

## 6. Tai khoan dang nhap mau

Du lieu seed san trong database:

- `admin / 123456`
- `manager01 / 123456`
- `staff01 / 123456`

Tai khoan `admin` la lua chon phu hop de demo nhanh.

## 7. Cac API/chuc nang chinh

- Dang nhap: `POST /api/auth/login`
- Quan ly nha cung cap: `/api/suppliers`
- Quan ly san pham: `/api/products`
- Upload anh: `POST /api/uploads/image`
- Kiem tra trang thai backend: `GET /api/health`
- Kiem tra ket noi DB: `GET /api/db-test`

## 8. Nhung thong tin quan trong can note

- Backend can ket noi duoc SQL Server thi cac chuc nang moi hoat dong day du.
- Project hien dang luu mat khau tai khoan dang nhap dang plain text trong database seed. Day la cach lam de demo, khong nen dung cho production.
- Khi chay lan dau, backend co the tu tao schema va du lieu mau trong `WinmartDb`.
- Anh upload se nam trong thu muc `backend/uploads`.
- Frontend va backend chay tach rieng, can mo 2 terminal.
- Neu doi cong backend, can cap nhat lai `VITE_API_BASE_URL` neu frontend khong goi duoc API.
- Neu SQL Server khong dung instance `SQLEXPRESS`, can sua lai `DB_INSTANCE` trong `backend/.env`.

## 9. Loi thuong gap

### Backend khong ket noi duoc SQL Server

Kiem tra:

- SQL Server da bat chua
- ten `DB_SERVER` dung chua
- ten `DB_INSTANCE` dung chua
- tai khoan Windows/SQL co quyen truy cap chua

### Frontend dang nhap that bai hoac khong load du lieu

Kiem tra:

- backend da chay chua
- dung URL `http://localhost:5000` chua
- API base URL co bi sua sai khong

## 10. Lenh build

```powershell
cd frontend
npm run build
```

Backend hien tai chu yeu dung:

```powershell
cd backend
npm start
```
