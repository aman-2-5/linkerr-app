# Linkerr 🚀

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

> **Connect. Collaborate. Create.**
> A full-stack professional networking and freelance marketplace platform connecting developers, designers, and clients.

---

## 🌐 Live Demo
**[View Live Project Here](https://your-linkerr-project-url.vercel.app)** *(Note: The project is currently hosted on a free tier, so the backend may take a moment to wake up on the first request.)*

---

## 📖 About The Project

**Linkerr** is a dynamic web application designed to bridge the gap between professional networking (like LinkedIn) and freelance service marketplaces (like Fiverr). It solves the problem of disconnected professional identities by allowing users to showcase their skills, sell services, and network in one unified ecosystem.

### Key Features
* **🔍 Intelligent Search:** Find users by name/skills and services by category using regex-based filtering.
* **👤 Dynamic User Profiles:** Showcase education, skills, headlines, and "Open to Work" status.
* **🛒 Service Marketplace:** Users can create, list, and manage freelance services with pricing and ratings.
* **🤝 Networking:** Connect with other professionals and expand your network.
* **🔐 Secure Authentication:** JWT-based login and registration system.
* **📱 Responsive Design:** Fully optimized for desktop and mobile using Tailwind CSS.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Hooks, Context API)
* React Router DOM (Navigation)
* Tailwind CSS (Styling)
* Lucide React (Icons)
* Axios (API Integration)

**Backend:**
* Node.js & Express.js (RESTful API)
* MongoDB & Mongoose (Database & Modeling)
* JWT (JSON Web Tokens for Auth)

---

## 📸 Screenshots

*(Add screenshots of your Dashboard, Search Page, and Profile here)*

| Landing / Dashboard | Search Results |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard+Screenshot) | ![Search](https://via.placeholder.com/400x200?text=Search+Screenshot) |

---

## 🚧 Project Status

**Current Phase: Open Beta / MVP**

This project is currently under **Active Development**. 
While the core functionalities (Auth, Services, Search, Profiles) are fully operational, I am actively working on:
* Real-time chat functionality using Socket.io.
* Payment gateway integration (Stripe/Razorpay).
* Advanced filtering logic for search results.

---

## 🚀 How to Run Locally

If you want to run this project on your local machine, follow these steps:

### Prerequisites
* Node.js installed
* MongoDB installed or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/linkerr.git](https://github.com/yourusername/linkerr.git)
cd linkerr
2. Setup Backend
Bash
cd server
npm install
# Create a .env file and add:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000
npm start
3. Setup Frontend
Bash
cd client
npm install
npm start
The app should now be running on http://localhost:3000.
