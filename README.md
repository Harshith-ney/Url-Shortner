# ⚡ URL Shortener with Analytics

A full-stack URL shortener built using **Node.js**, **Express**, **MongoDB**, **Redis**, and **React**, featuring click tracking, expiration logic, and sleek data visualization with Chart.js.

---

## 🔗 Features

- 🔐 JWT-based authentication (optional)
- ✂️ Shorten long URLs with unique slugs
- 🧠 Redis caching for blazing fast redirects
- 📈 Click logging with timestamps, IP, and user-agent
- 📊 Cumulative click analytics displayed via chart
- ⏳ URL expiration support
- 🖥️ React-based frontend

---

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis
- JWT

**Frontend:**
- React.js
- Chart.js
- Axios

---

## 🚀 Getting Started

### 🔁 Clone the repository

```bash
git clone https://github.com/your-username/url-shortner.git
cd url-shortner

🧩 Backend Setup
cd backend
npm install


Create a .env file inside /backend:

PORT=3000
MONGO_URI=mongodb://localhost:27017/urlshortner
JWT_SECRET=your_secret_key

Run the backend server:
npm start

💻 Frontend Setup

cd frontend
npm install
npm start

📊 Analytics
	•	Every redirect logs:
	•	Timestamp
	•	User IP
	•	User-Agent string
	•	Chart visualizes cumulative clicks over time using Chart.js




url-shortner/
├── backend/
│   ├── controller/
│   ├── models/
│   ├── routes/
│   └── index.js
├── frontend/
│   ├── src/
│   ├── components/
│   └── App.js
└── README.md










