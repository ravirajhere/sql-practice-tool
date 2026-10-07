# 🗄️ SQL Practice Tool

An interactive browser-based SQL practice tool. Write SQL queries, run them against a real database, and check your answers — no setup, no installation, no backend.

## 🌐 Live Demo
👉 **https://rj-sql-practice-tool.vercel.app**

## 💡 Why I Built This
Learning SQL is hard when you need to install MySQL or PostgreSQL just to practice a few basic queries. Beginners often get stuck at setup before writing a single line of SQL.

This tool solves that:
1. Opens in the browser — no installation
2. Runs a real SQLite database (compiled to WebAssembly)
3. Gives 10 practice questions with hints
4. Checks your answer instantly

Built for students who want to practice SQL queries without any setup hassle.

## ✨ Features
- **10 practice questions** — SELECT, WHERE, ORDER BY, AVG, COUNT, LIKE, BETWEEN, DISTINCT
- **Real SQLite database** — runs in the browser via sql.js (WebAssembly)
- **Instant answer checking** — knows if your query is correct
- **Hints for every question** — stuck? Use the hint
- **Progress bar** — track how far you are
- **20 sample students** — clean dataset to practice on
- **Error handling** — shows SQL errors clearly
- **Keyboard shortcut** — Ctrl/Cmd + Enter to run query
- **Safe** — only SELECT queries allowed
- **100% client-side** — no backend, no data sent anywhere

## 🛠️ Tech Stack
- HTML5
- CSS3
- JavaScript (Vanilla) — async/await, DOM manipulation
- **sql.js** — SQLite compiled to WebAssembly
- Vercel (Deployment)

## 📂 Project Structure

sql-practice-tool/
├── index.html
├── style.css
├── script.js
└── README.md

## 🗃️ Database Schema

Table: **students**

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Student name |
| marks | INTEGER | Exam marks |
| city | TEXT | Home city |

Sample data: 20 students from Patna, Delhi, Mumbai, and Bangalore.

## 🚀 How to Run Locally
1. Clone the repo:
   git clone https://github.com/ravirajhere/sql-practice-tool.git
2. Navigate into the folder:
   cd sql-practice-tool
3. Open index.html in your browser. That's it — no installation, no server.

## 🧠 What I Learned From This Project
- Running SQLite in the browser using sql.js (WebAssembly)
- Building a real SQL execution environment without any backend
- Dynamic DOM rendering for result tables
- Query normalization and answer comparison logic
- Handling SQL errors gracefully
- Designing a clean learning experience for beginners

## 📝 Questions Included
1. Find all students who scored more than 80 marks
2. Get names of students from a specific city
3. List students sorted by marks (descending)
4. Find the average marks
5. Count total students
6. Find the topper
7. Filter students by name pattern (LIKE)
8. Filter students by marks range (BETWEEN)
9. Get total of all marks (SUM)
10. List unique cities (DISTINCT)

## 🔮 Future Improvements
- Add more questions (JOINs, GROUP BY, subqueries)
- Multiple tables (courses, teachers, enrollments)
- Free-play mode — run any query on the database
- Show query explanation after correct answer
- Track progress across sessions using localStorage
- Add intermediate and advanced difficulty levels

## 👤 Author
**Ravi Raj**
GitHub: [@ravirajhere](https://github.com/ravirajhere)
