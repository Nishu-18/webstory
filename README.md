
# 📖 Web Stories CMS + Player

A full-stack web application that allows users to **create, manage, and view interactive web stories**.  
It includes a **CMS (Content Management System)** for creating and managing stories, and a **Story Player** to view them seamlessly.

---

## 🚀 Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Nishu-18/webstory.git
cd webstory

```
### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Create a .env file inside the /backend folder with the following variables:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the backend server:
```bash
npm start

```
The backend will start at:
👉 http://localhost:5000

### 5. Frontend Setup
```bash
cd ../frontend
npm install


```
### 6. Create a .env file inside the /frontend folder with:
```bash
VITE_BACKEND_URL=http://localhost:5000



```

### 7. Run the backend
```bash
npm run dev




```

The frontend will start at:
👉 http://localhost:5173









### 8. Admin Login

Use the following credentials to log in as an Admin:
```bash
Username: Nishchal
Password: 1234

```


## 🧠 How It Works

1. **Authentication**
   - Admin logs in using credentials.
   - On successful login, a JWT token is generated and stored in `localStorage`.
   - This token is attached to each API request via the `Authorization` header.

2. **Story Creation**
   - Admin can create new stories by adding title, description, and images.
   - Stories are saved in MongoDB and can be fetched by all users.

3. **Story Player**
   - Stories are displayed as interactive slides.
   - Supports next/previous navigation and replay options.

4. **Security**
   - Protected routes on the backend verify tokens using middleware (`verifyToken`).
   - Unauthorized requests return a `401` error.







