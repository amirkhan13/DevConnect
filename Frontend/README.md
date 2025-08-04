# DevConnect - Social Feed App (Incomplete)

DevConnect is a basic social feed-style web app built using React, Redux Toolkit, Node.js, and MongoDB. It was created as a personal learning project to explore frontend-backend integration, API communication, and state management using Redux.

> ⚠️ This project is not fully complete or production-ready. It served primarily as a learning experience.

## 💡 Features Implemented

- 🔐 User Authentication (JWT-based, token stored in localStorage)
- 📝 Create and view posts
- 📄 Redux-based global state management
- 🔄 Fetching posts from backend using Axios
- 💾 Connected to backend API for CRUD operations
- 💻 Responsive UI with Tailwind CSS

## 🧱 Tech Stack

| Frontend         | Backend           | Others              |
|------------------|-------------------|----------------------|
| React.js         | Node.js (Express) | MongoDB (Mongoose)   |
| Redux Toolkit    | JWT Auth          | Cloudinary (optional)|
| Axios            | Bcrypt            | Toast Notifications  |
| Tailwind CSS     | Multer            | Moment.js            |

## 🚧 Limitations / Work In Progress

- ❌ No finished comment/like functionality
- ❌ UI design is basic; lacks polish and consistency
- ❌ Error handling and edge cases need refinement
- ❌ Incomplete role-based routing or profile features

## 📁 Folder Structure (Frontend)

src/
├── components/
│ ├── Header/
│ ├── Footer/
│ ├── CreatePost.jsx
│ ├── PostCard.jsx
│ └── Loader.jsx
├── pages/
│ ├── Feed.jsx
│ ├── Login.jsx
│ └── Register.jsx
├── store/
│ ├── postSlice.js
│ └── authSlice.js
└── App.jsx



## 🛠 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/amirkhan13/DevConnect.git
  

## Install dependencies
   npm install
## Start frontend
    npm run dev

## Start backend server
    cd Backend
    npm install
    npm run dev



---
## License
This project is open-source for educational purposes. You're free to fork and build upon it.



Let me know if you’d like this exported as a file or customized further for GitHub!
