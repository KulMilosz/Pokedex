# 📱 Pokedex App

Pokedex App is a web application developed as a final project for second module of Devstock course. It allows users to browse a list of Pokémon, search and filter them, manage favorites, and add new ones. The app supports user registration, login, editing Pokémon, and multiple interactive features.

## 🛠️ Technologies Used

- **React.js** – front-end framework
- **Vite** – fast bundler and dev server
- **React Router** – client-side routing
- **React Query** – data fetching and caching
- **JSON Server** – fake REST API for local development
- **Tailwind CSS** – utility-first CSS framework
- **Notistack** – notification system for displaying success/error/toast messages

## ✨ Features

- 🔍 Search Pokémon by name
- 📄 Pagination (list split into pages)
- 🌟 Favorites – add/remove Pokémon from favorites
- 🎮 Battle Arena – simulate Pokémon battles
- ✏️ Edit Pokémon data
- ➕ Add new Pokémon
- 👤 User registration and login
- 🌙 Theme toggle (light/dark mode)
- 🧠 Local data storage

## 🔧 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-repo/pokedex-app.git
cd pokedex-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the local JSON Server:**

```bash
cd data
json-server --watch db.json
```

4. **Run the app:**

```bash
npm run dev
```
