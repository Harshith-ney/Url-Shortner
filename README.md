# ⚡ URL Shortener with Analytics

A full-stack URL shortener built using **Node.js**, **Express**, **MongoDB**, **Redis**, and **React**, with click analytics, expiration handling, and JWT-based authentication.

---

## 🔗 Features

- 🔐 JWT Auth (optional for shortening)
- ✂️ Shorten long URLs with unique slugs
- 🧠 Smart caching with Redis
- 📈 Click analytics and charts
- 🕐 URL expiration support
- 🌐 React-based frontend

---

## 🛠️ Tech Stack

**Backend:**
- Node.js, Express
- MongoDB (Mongoose)
- Redis
- JWT for Auth

**Frontend:**
- React
- Chart.js (Analytics)
- Axios

---

## 🚀 Getting Started

### Clone the repo

```bash
git clone https://github.com/your-username/url-shortner.git
cd url-shortner


1. **Backend Setup**
cd backend
npm install

**Create a .env file:**
PORT=3000
MONGO_URI=mongodb://localhost:27017/urlshortner
JWT_SECRET=your_secret_key

Run Backend:
npm start

2. Frontend Setup
cd frontend
npm install
npm start


📊 Analytics
	•	Each click is logged with timestamp, IP, and user-agent.
	•	Cumulative click data shown on a chart.











