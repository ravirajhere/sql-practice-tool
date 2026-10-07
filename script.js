/* ============================================
   SQL Practice Tool — Logic
   Uses sql.js (SQLite compiled to WebAssembly)
   ============================================ */

let db = null;              // SQLite database instance
let currentQuestion = 0;    // Current question index

// ============================================
// QUESTIONS DATA
// ============================================
const questions = [
  {
    question: "Find all students who scored more than 80 marks.",
    hint: "Use SELECT * FROM students WHERE marks > 80;",
    expected: "SELECT * FROM students WHERE marks > 80",
    checkType: "rows"
  },
  {
    question: "Get the names of students who live in 'Patna'.",
    hint: "Use WHERE city = 'Patna'",
    expected: "SELECT name FROM students WHERE city = 'Patna'",
    checkType: "rows"
  },
  {
    question: "List all students sorted by marks in descending order.",
    hint: "Use ORDER BY marks DESC",
    expected: "SELECT * FROM students ORDER BY marks DESC",
    checkType: "rows"
  },
  {
    question: "Find the average marks of all students.",
    hint: "Use AVG(marks) function",
    expected: "SELECT AVG(marks) FROM students",
    checkType: "rows"
  },
  {
    question: "Count how many students are in the database.",
    hint: "Use COUNT(*) function",
    expected: "SELECT COUNT(*) FROM students",
    checkType: "rows"
  },
  {
    question: "Find the student with the highest marks.",
    hint: "Use ORDER BY marks DESC LIMIT 1",
    expected: "SELECT * FROM students ORDER BY marks DESC LIMIT 1",
    checkType: "rows"
  },
  {
    question: "Get all students whose name starts with 'A'.",
    hint: "Use LIKE 'A%'",
    expected: "SELECT * FROM students WHERE name LIKE 'A%'",
    checkType: "rows"
  },
  {
    question: "Find students with marks between 60 and 80 (inclusive).",
    hint: "Use BETWEEN 60 AND 80",
    expected: "SELECT * FROM students WHERE marks BETWEEN 60 AND 80",
    checkType: "rows"
  },
  {
    question: "Get the total marks of all students combined.",
    hint: "Use SUM(marks)",
    expected: "SELECT SUM(marks) FROM students",
    checkType: "rows"
  },
  {
    question: "List all unique cities from the students table.",
    hint: "Use DISTINCT city",
    expected: "SELECT DISTINCT city FROM students",
    checkType: "rows"
  }
];

// ============================================
// INITIALIZE DATABASE
// ============================================
async function initDatabase() {
  // Load sql.js
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
  });

  // Create new database
  db = new SQL.Database();

  // Create students table
  db.run(`
    CREATE TABLE students (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      marks INTEGER NOT NULL,
      city TEXT NOT NULL
    );
  `);

  // Insert sample data — 20 students
  const students = [
    [1, "Aditya", 88, "Patna"],
    [2, "Bhavya", 76, "Delhi"],
    [3, "Chirag", 92, "Mumbai"],
    [4, "Anjali", 65, "Patna"],
    [5, "Rohit", 55, "Bangalore"],
    [6, "Ayesha", 81, "Delhi"],
    [7, "Karan", 70, "Patna"],
    [8, "Nishant", 95, "Mumbai"],
    [9, "Pranav", 62, "Bangalore"],
    [10, "Sufhanshu", 79, "Delhi"],
    [11, "Deepak", 84, "Patna"],
    [12, "Priyam", 91, "Mumbai"],
    [13, "Amit", 58, "Bangalore"],
    [14, "RaviRaj", 73, "Delhi"],
    [15, "Vivek", 67, "Patna"],
    [16, "Ananya", 89, "Mumbai"],
    [17, "Shresth", 45, "Bangalore"],
    [18, "Suraj", 77, "Delhi"],
    [19, "Keshav", 82, "Patna"],
    [20, "Meera", 96, "Mumbai"]
  ];

  students.forEach(s => {
    db.run("INSERT INTO students (id, name, marks, city) VALUES (?, ?, ?, ?)", s);
  });

  console.log("✅ Database ready with 20 students");
}

// ============================================
// DOM ELEMENTS
// ============================================
const questionText = document.getElementById("questionText");
const hintText = document.getElementById("hintText");
const sqlInput = document.getElementById("sqlInput");
const runBtn = document.getElementById("runBtn");
const clearBtn = document.getElementById("clearBtn");
const nextBtn = document.getElementById("nextBtn");
const message = document.getElementById("message");
const resultTable = document.getElementById("resultTable");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

// ============================================
// LOAD QUESTION
// ============================================
function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  hintText.textContent = q.hint;
  sqlInput.value = "";
  message.className = "message";
  message.textContent = "";
  resultTable.innerHTML = "";
  nextBtn.disabled = true;

  // Update progress
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
}

// ============================================
// NORMALIZE SQL (for comparison)
// ============================================
function normalizeSQL(sql) {
  return sql
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/;$/, "")
    .trim();
}

// ============================================
// RUN QUERY
// ============================================
function runQuery() {
  const userSQL = sqlInput.value.trim();

  if (!userSQL) {
    showMessage("Please write a SQL query first.", "error");
    return;
  }

  // Only allow SELECT for safety
  const normalized = normalizeSQL(userSQL);
  if (!normalized.startsWith("select")) {
    showMessage("Only SELECT queries are allowed in this practice tool.", "error");
    return;
  }

  try {
    const result = db.exec(userSQL);

    if (result.length === 0) {
      showMessage("Query ran, but returned no results.", "error");
      return;
    }

    // Show result table
    displayResult(result[0]);

    // Check if answer matches expected
    const expected = normalizeSQL(questions[currentQuestion].expected);
    if (normalized === expected) {
      showMessage("✅ Correct! Well done.", "success");
      nextBtn.disabled = false;
    } else {
      showMessage("⚠️ Query ran, but not quite the expected answer. Try again.", "error");
    }
  } catch (err) {
    showMessage("❌ SQL Error: " + err.message, "error");
  }
}

// ============================================
// DISPLAY RESULT TABLE
// ============================================
function displayResult(result) {
  const { columns, values } = result;

  let html = "<table><thead><tr>";
  columns.forEach(col => {
    html += `<th>${col}</th>`;
  });
  html += "</tr></thead><tbody>";

  values.forEach(row => {
    html += "<tr>";
    row.forEach(cell => {
      html += `<td>${cell === null ? "NULL" : cell}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  resultTable.innerHTML = html;
}

// ============================================
// SHOW MESSAGE
// ============================================
function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

// ============================================
// EVENT LISTENERS
// ============================================
runBtn.addEventListener("click", runQuery);

clearBtn.addEventListener("click", () => {
  sqlInput.value = "";
  sqlInput.focus();
  message.className = "message";
  message.textContent = "";
  resultTable.innerHTML = "";
});

nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showMessage("🎉 You finished all questions! More coming soon.", "success");
  }
});

// Ctrl/Cmd + Enter to run query
sqlInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    runQuery();
  }
});

// ============================================
// INIT
// ============================================
(async function start() {
  try {
    await initDatabase();
    loadQuestion();
  } catch (err) {
    showMessage("Failed to load database: " + err.message, "error");
    console.error(err);
  }
})();
