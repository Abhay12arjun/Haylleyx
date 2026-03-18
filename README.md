# 🚀 Dashboard Builder (MERN Stack)

A full-stack **Dashboard Builder Application** that allows users to create, configure, and visualize data-driven dashboards using dynamic widgets such as KPI cards, charts, and tables.

---

## 📌 Project Overview

This project is built using the **MERN Stack (MongoDB, Express, React, Node.js)** and enables users to:

- Create custom dashboards  
- Add and configure widgets  
- Visualize real-time analytics from order data  
- Filter data using date ranges  
- Build interactive and dynamic dashboards  

---

## 🎥 Demo Video

👉 Watch the project demo here:  
[▶ Watch Demo Video](https://youtu.be/Js2mrcxnMmw?si=SlUGNw0MGKRVz3AA)

---

## 🛠 Tech Stack

### 🔹 Frontend
- React + Vite  
- Tailwind CSS  
- Recharts (Charts Library)  
- Axios  

### 🔹 Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

---

## ✨ Features

### 📊 Dashboard Builder
- Add widgets dynamically:
  - KPI Card  
  - Bar Chart  
  - Line Chart  
  - Pie Chart  
  - Area Chart  
  - Scatter Plot  
  - Table  

- Configure widgets with:
  - Title & Description  
  - Width & Height  
  - Metric selection  
  - Aggregation (Sum, Average, Count)  
  - Data format (Number / Currency)  
  - Decimal precision  

---

### 📈 Data Visualization
- Orders by Product (Bar Chart)  
- Revenue Trend (Line & Area Charts)  
- Order Status Distribution (Pie Chart)  
- Sales Scatter Plot  
- Orders Table  

---

### 📌 KPI Metrics
- Total Orders  
- Total Revenue  
- Pending Orders  
- Completed Orders  

---

### 📅 Date Filter
Filter dashboard data by:
- Today  
- Last 7 Days  
- Last 30 Days  
- Last 90 Days  

---

### 📦 Orders Management
- Create Order  
- Update Order  
- Delete Order  
- View Orders in Table  

---

## 📁 Folder Structure

```bash
project-root
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
│
└── README.md



⚙️ Installation & Setup
1️⃣ Clone the Repository
[Clone Repository](https://github.com/your-username/dashboard-builder.git)
cd dashboard-builder
🔐 Environment Variables
Backend (/backend/.env)

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
Frontend (/frontend/.env)
VITE_API_URL=http://localhost:5000/api
▶️ Running the Application
🔹 Start Backend Server
cd backend
npm install
npm run dev

👉 Backend runs on: http://localhost:5000

🔹 Start Frontend

Open a new terminal:

cd frontend
npm install
npm run dev

👉 Frontend runs on: http://localhost:5173

🔄 Available Scripts
Backend
npm run dev     # Start server with nodemon
npm start       # Start production server
Frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
🌐 API Endpoints (Sample)
Auth

POST /api/auth/register

POST /api/auth/login

Orders

GET /api/orders

POST /api/orders

PUT /api/orders/:id

DELETE /api/orders/:id

Dashboard

GET /api/dashboard

🚀 Deployment
Frontend

Deploy on Vercel / Netlify

Backend

Deploy on Render / Railway

Make sure to update environment variables in production.

📸 Screenshots (Optional)

Add screenshots of your dashboard here for better presentation.

🤝 Contributing

Contributions are welcome!

fork → create branch → commit → push → pull request
📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Developed by Abhay

⭐ Support

If you like this project:

👉 Star the repository
👉 Share it with othe
