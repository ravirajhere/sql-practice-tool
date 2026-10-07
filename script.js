/* ============================================
   SQL Practice Tool — Logic
   Phase 4 Final: 30 questions · progress · streak · filter · share · free-play · explanations
   ============================================ */

let db = null;
let currentQuestion = 0;
let currentCategory = "All";
let streak = 0;
let bestStreak = 0;
let currentMode = "practice";
let solvedQuestions = new Set();

// ============================================
// CATEGORY EXPLANATIONS
// ============================================
const explanations = {
  "SELECT": "SELECT picks columns from a table. Use * for all columns, or name specific columns. WHERE filters rows. ORDER BY sorts, LIMIT caps results, LIKE matches patterns, and BETWEEN checks ranges.",
  "AGGREGATE": "Aggregate functions summarize many rows into one value: AVG (average), COUNT (count rows), SUM (total), MAX (highest), MIN (lowest). They all return a single row.",
  "GROUP BY": "GROUP BY splits rows into groups based on a column, then applies aggregate functions to each group separately. Use HAVING (not WHERE) to filter groups after aggregation.",
  "JOIN": "JOIN combines rows from two tables based on a related column (foreign key). INNER JOIN keeps only matching rows. The ON clause specifies how tables are linked.",
  "SUBQUERY": "A subquery is a SELECT inside another query. It runs first, and its result is used by the outer query. Common in WHERE clauses for comparisons against computed values."
};

// ============================================
// QUESTIONS (30)
// ============================================
const questions = [
  // SELECT (11)
  { category: "SELECT", difficulty: "Easy", question: "Find all students who scored more than 80 marks.", hint: "Use WHERE marks > 80", expected: "SELECT * FROM students WHERE marks > 80" },
  { category: "SELECT", difficulty: "Easy", question: "Get the names of students who live in 'Patna'.", hint: "Use WHERE city = 'Patna'", expected: "SELECT name FROM students WHERE city = 'Patna'" },
  { category: "SELECT", difficulty: "Easy", question: "List all students sorted by marks in descending order.", hint: "Use ORDER BY marks DESC", expected: "SELECT * FROM students ORDER BY marks DESC" },
  { category: "SELECT", difficulty: "Easy", question: "Get all students whose name starts with 'A'.", hint: "Use LIKE 'A%'", expected: "SELECT * FROM students WHERE name LIKE 'A%'" },
  { category: "SELECT", difficulty: "Easy", question: "Find students with marks between 60 and 80 (inclusive).", hint: "Use BETWEEN 60 AND 80", expected: "SELECT * FROM students WHERE marks BETWEEN 60 AND 80" },
  { category: "SELECT", difficulty: "Easy", question: "List all unique cities from the students table.", hint: "Use DISTINCT city", expected: "SELECT DISTINCT city FROM students" },
  { category: "SELECT", difficulty: "Medium", question: "List the top 3 students by marks.", hint: "Use ORDER BY marks DESC LIMIT 3", expected: "SELECT * FROM students ORDER BY marks DESC LIMIT 3" },
  { category: "SELECT", difficulty: "Medium", question: "Find students whose name ends with 'a'.", hint: "Use LIKE '%a'", expected: "SELECT * FROM students WHERE name LIKE '%a'" },
  { category: "SELECT", difficulty: "Medium", question: "Find students from Patna OR Delhi.", hint: "Use WHERE city = 'Patna' OR city = 'Delhi'", expected: "SELECT * FROM students WHERE city = 'Patna' OR city = 'Delhi'" },
  { category: "SELECT", difficulty: "Medium", question: "Find students who are NOT from Patna.", hint: "Use WHERE city != 'Patna'", expected: "SELECT * FROM students WHERE city != 'Patna'" },
  { category: "SELECT", difficulty: "Medium", question: "Find students with marks greater than 80 AND from Patna.", hint: "Use WHERE with AND", expected: "SELECT * FROM students WHERE marks > 80 AND city = 'Patna'" },

  // AGGREGATE (6)
  { category: "AGGREGATE", difficulty: "Medium", question: "Find the average marks of all students.", hint: "Use AVG(marks)", expected: "SELECT AVG(marks) FROM students" },
  { category: "AGGREGATE", difficulty: "Medium", question: "Count how many students are in the database.", hint: "Use COUNT(*)", expected: "SELECT COUNT(*) FROM students" },
  { category: "AGGREGATE", difficulty: "Medium", question: "Get the total marks of all students combined.", hint: "Use SUM(marks)", expected: "SELECT SUM(marks) FROM students" },
  { category: "AGGREGATE", difficulty: "Medium", question: "Find the highest marks in the students table.", hint: "Use MAX(marks)", expected: "SELECT MAX(marks) FROM students" },
  { category: "AGGREGATE", difficulty: "Medium", question: "Find the lowest marks in the students table.", hint: "Use MIN(marks)", expected: "SELECT MIN(marks) FROM students" },
  { category: "AGGREGATE", difficulty: "Hard", question: "Find the second highest marks in the students table.", hint: "Use ORDER BY marks DESC LIMIT 1 OFFSET 1", expected: "SELECT * FROM students ORDER BY marks DESC LIMIT 1 OFFSET 1" },

  // GROUP BY (5)
  { category: "GROUP BY", difficulty: "Medium", question: "Count how many students are from each city.", hint: "Use GROUP BY city with COUNT(*)", expected: "SELECT city, COUNT(*) FROM students GROUP BY city" },
  { category: "GROUP BY", difficulty: "Medium", question: "Find the average marks per city.", hint: "Use GROUP BY city with AVG(marks)", expected: "SELECT city, AVG(marks) FROM students GROUP BY city" },
  { category: "GROUP BY", difficulty: "Medium", question: "Find the highest marks in each city.", hint: "Use GROUP BY city with MAX(marks)", expected: "SELECT city, MAX(marks) FROM students GROUP BY city" },
  { category: "GROUP BY", difficulty: "Hard", question: "Find cities where the average marks are above 75.", hint: "Use GROUP BY city with HAVING AVG(marks) > 75", expected: "SELECT city, AVG(marks) FROM students GROUP BY city HAVING AVG(marks) > 75" },
  { category: "GROUP BY", difficulty: "Hard", question: "Find the number of students in each city, sorted by count descending.", hint: "GROUP BY + ORDER BY COUNT(*) DESC", expected: "SELECT city, COUNT(*) FROM students GROUP BY city ORDER BY COUNT(*) DESC" },

  // JOIN (5)
  { category: "JOIN", difficulty: "Hard", question: "Find each student's name along with their course names.", hint: "Use JOIN students and courses ON students.id = courses.student_id", expected: "SELECT students.name, courses.course_name FROM students JOIN courses ON students.id = courses.student_id" },
  { category: "JOIN", difficulty: "Hard", question: "Find students who scored above 90 in any course.", hint: "Use JOIN with WHERE courses.score > 90", expected: "SELECT students.name, courses.course_name, courses.score FROM students JOIN courses ON students.id = courses.student_id WHERE courses.score > 90" },
  { category: "JOIN", difficulty: "Hard", question: "Find the course names for the student named 'Aditya'.", hint: "JOIN + WHERE students.name = 'Aditya'", expected: "SELECT courses.course_name FROM students JOIN courses ON students.id = courses.student_id WHERE students.name = 'Aditya'" },
  { category: "JOIN", difficulty: "Hard", question: "Get each student's name and their total course score.", hint: "JOIN + GROUP BY students.name with SUM(courses.score)", expected: "SELECT students.name, SUM(courses.score) FROM students JOIN courses ON students.id = courses.student_id GROUP BY students.name" },
  { category: "JOIN", difficulty: "Hard", question: "Find all students who took 'Mathematics'.", hint: "JOIN + WHERE courses.course_name = 'Mathematics'", expected: "SELECT students.name FROM students JOIN courses ON students.id = courses.student_id WHERE courses.course_name = 'Mathematics'" },

  // SUBQUERY (3)
  { category: "SUBQUERY", difficulty: "Hard", question: "Find students who scored more than the average marks.", hint: "Use WHERE marks > (SELECT AVG(marks) FROM students)", expected: "SELECT * FROM students WHERE marks > (SELECT AVG(marks) FROM students)" },
  { category: "SUBQUERY", difficulty: "Hard", question: "Find the student with the highest marks.", hint: "Use ORDER BY marks DESC LIMIT 1", expected: "SELECT * FROM students ORDER BY marks DESC LIMIT 1" },
  { category: "SUBQUERY", difficulty: "Hard", question: "Find students who scored higher than RaviRaj in marks.", hint: "Use subquery to find RaviRaj's marks", expected: "SELECT * FROM students WHERE marks > (SELECT marks FROM students WHERE name = 'RaviRaj')" }
];

// ============================================
// LOCALSTORAGE
// ============================================
function loadProgress() {
  const saved = localStorage.getItem("sqlToolProgress");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      solvedQuestions = new Set(data.solved || []);
      bestStreak = data.bestStreak || 0;
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
  }
  updateStats();
}

function saveProgress() {
  localStorage.setItem("sqlToolProgress", JSON.stringify({
    solved: Array.from(solvedQuestions),
    bestStreak: bestStreak
  }));
}

function updateStats() {
  const streakEl = document.getElementById("streakValue");
  const solvedEl = document.getElementById("solvedValue");
  const bestEl = document.getElementById("bestStreakValue");

  if (streakEl) streakEl.textContent = `${streak} 🔥`;
  if (solvedEl) solvedEl.textContent = `${solvedQuestions.size} / ${questions.length}`;
  if (bestEl) bestEl.textContent = bestStreak;

  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn && solvedQuestions.size > 0) {
    shareBtn.style.display = "block";
  }
}

// ============================================
// DATABASE
// ============================================
async function initDatabase() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
  });

  db = new SQL.Database();

  // students table
  db.run(`CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    marks INTEGER NOT NULL,
    city TEXT NOT NULL
  );`);

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

  // courses table
  db.run(`CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,
    course_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );`);

  const courses = [
    [1, 1, "Mathematics", 85],
    [2, 1, "Physics", 78],
    [3, 2, "Mathematics", 92],
    [4, 2, "Chemistry", 88],
    [5, 3, "Physics", 95],
    [6, 4, "Mathematics", 65],
    [7, 5, "Chemistry", 72],
    [8, 6, "Physics", 88],
    [9, 7, "Mathematics", 55],
    [10, 8, "Chemistry", 91],
    [11, 9, "Physics", 68],
    [12, 10, "Mathematics", 82],
    [13, 11, "Chemistry", 74],
    [14, 12, "Physics", 90],
    [15, 13, "Mathematics", 58],
    [16, 14, "Chemistry", 72],
    [17, 15, "Physics", 67],
    [18, 16, "Mathematics", 89],
    [19, 17, "Chemistry", 45],
    [20, 18, "Physics", 77],
    [21, 19, "Mathematics", 82],
    [22, 20, "Chemistry", 96]
  ];
  courses.forEach(c => {
    db.run("INSERT INTO courses (id, student_id, course_name, score) VALUES (?, ?, ?, ?)", c);
  });

  console.log("✅ Database ready: 20 students + 22 courses + 30 questions");
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
const shareBtn = document.getElementById("shareBtn");
const message = document.getElementById("message");
const resultTable = document.getElementById("resultTable");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const explanationBox = document.getElementById("explanationBox");
const explanationText = document.getElementById("explanationText");

const practiceSection = document.getElementById("practiceSection");
const freeplaySection = document.getElementById("freeplaySection");
const freeplayInput = document.getElementById("freeplayInput");
const freeplayRunBtn = document.getElementById("freeplayRunBtn");
const freeplayClearBtn = document.getElementById("freeplayClearBtn");
const freeplayMessage = document.getElementById("freeplayMessage");
const freeplayResultTable = document.getElementById("freeplayResultTable");

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

  if (explanationBox) explanationBox.style.display = "none";

  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length} · ${q.category} · ${q.difficulty}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
}

// ============================================
// NORMALIZE SQL
// ============================================
function normalizeSQL(sql) {
  return sql
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/;$/, "")
    .trim();
}

// ============================================
// RUN QUERY (Practice)
// ============================================
function runQuery() {
  const userSQL = sqlInput.value.trim();

  if (!userSQL) {
    showMessage("Please write a SQL query first.", "error");
    return;
  }

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

    displayResult(result[0], resultTable);

    const expected = normalizeSQL(questions[currentQuestion].expected);
    if (normalized === expected) {
      const wasAlreadySolved = solvedQuestions.has(currentQuestion);
      solvedQuestions.add(currentQuestion);

      if (!wasAlreadySolved) {
        streak++;
        if (streak > bestStreak) bestStreak = streak;
      }

      saveProgress();
      updateStats();

      let msg = "✅ Correct! Well done.";
      if (streak >= 3 && !wasAlreadySolved) {
        msg += ` 🔥 ${streak} in a row!`;
      }
      showMessage(msg, "success");

      // Show explanation
      const category = questions[currentQuestion].category;
      explanationText.textContent = explanations[category] || "";
      explanationBox.style.display = "block";

      nextBtn.disabled = false;
    } else {
      streak = 0;
      saveProgress();
      updateStats();
      showMessage("⚠️ Query ran, but not quite the expected answer. Try again.", "error");
    }
  } catch (err) {
    showMessage("❌ SQL Error: " + err.message, "error");
  }
}

// ============================================
// DISPLAY RESULT
// ============================================
function displayResult(result, target) {
  const { columns, values } = result;
  let html = "<table><thead><tr>";
  columns.forEach(col => html += `<th>${col}</th>`);
  html += "</tr></thead><tbody>";

  values.forEach(row => {
    html += "<tr>";
    row.forEach(cell => {
      html += `<td>${cell === null ? "NULL" : cell}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  target.innerHTML = html;
}

// ============================================
// SHOW MESSAGE
// ============================================
function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

// ============================================
// FREE PLAY
// ============================================
function runFreeplayQuery() {
  const userSQL = freeplayInput.value.trim();

  if (!userSQL) {
    freeplayMessage.textContent = "Please write a SQL query first.";
    freeplayMessage.className = "message error";
    return;
  }

  const normalized = normalizeSQL(userSQL);
  if (!normalized.startsWith("select")) {
    freeplayMessage.textContent = "Only SELECT queries are allowed.";
    freeplayMessage.className = "message error";
    return;
  }

  try {
    const result = db.exec(userSQL);

    if (result.length === 0) {
      freeplayMessage.textContent = "Query ran, but returned no results.";
      freeplayMessage.className = "message error";
      freeplayResultTable.innerHTML = "";
      return;
    }

    displayResult(result[0], freeplayResultTable);
    const rowCount = result[0].values.length;
    freeplayMessage.textContent = `✅ Query ran successfully · ${rowCount} rows returned.`;
    freeplayMessage.className = "message success";
  } catch (err) {
    freeplayMessage.textContent = "❌ SQL Error: " + err.message;
    freeplayMessage.className = "message error";
    freeplayResultTable.innerHTML = "";
  }
}

// ============================================
// MODE SWITCH
// ============================================
function setMode(mode) {
  currentMode = mode;

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  if (mode === "freeplay") {
    practiceSection.style.display = "none";
    freeplaySection.style.display = "flex";
  } else {
    practiceSection.style.display = "block";
    freeplaySection.style.display = "none";
  }
}

// ============================================
// CATEGORY FILTER
// ============================================
function applyFilter(category) {
  currentCategory = category;

  const filtered = questions
    .map((q, i) => ({ ...q, originalIndex: i }))
    .filter(q => category === "All" || q.category === category);

  if (filtered.length === 0) return;

  currentQuestion = filtered[0].originalIndex;
  loadQuestion();

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });
}

// ============================================
// SHARE
// ============================================
function shareProgress() {
  const solved = solvedQuestions.size;
  const total = questions.length;
  const text = `I solved ${solved}/${total} SQL practice questions on SQL Practice Tool! 🗄️\n\nTry it: https://rj-sql-practice-tool.vercel.app`;

  if (navigator.share) {
    navigator.share({
      title: "SQL Practice Tool Progress",
      text: text,
      url: "https://rj-sql-practice-tool.vercel.app"
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showMessage("📋 Progress copied! Paste it anywhere.", "success");
    });
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
runBtn.addEventListener("click", runQuery);
if (shareBtn) shareBtn.addEventListener("click", shareProgress);
if (freeplayRunBtn) freeplayRunBtn.addEventListener("click", runFreeplayQuery);

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

const filterBar = document.getElementById("filterBar");
if (filterBar) {
  filterBar.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      applyFilter(e.target.dataset.category);
    }
  });
}

clearBtn.addEventListener("click", () => {
  sqlInput.value = "";
  sqlInput.focus();
  message.className = "message";
  message.textContent = "";
  resultTable.innerHTML = "";
  if (explanationBox) explanationBox.style.display = "none";
});

if (freeplayClearBtn) {
  freeplayClearBtn.addEventListener("click", () => {
    freeplayInput.value = "";
    freeplayInput.focus();
    freeplayMessage.className = "message";
    freeplayMessage.textContent = "";
    freeplayResultTable.innerHTML = "";
  });
}

nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showMessage("🎉 You finished all 30 questions! More coming soon.", "success");
  }
});

sqlInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    runQuery();
  }
});

if (freeplayInput) {
  freeplayInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      runFreeplayQuery();
    }
  });
}

// ============================================
// INIT
// ============================================
(async function start() {
  try {
    loadProgress();
    await initDatabase();
    loadQuestion();
  } catch (err) {
    showMessage("Failed to load database: " + err.message, "error");
    console.error(err);
  }
})();
