/* ============================================
   SQL Practice Tool — Logic
   Uses sql.js (SQLite compiled to WebAssembly)
   Phase 1: 2 tables + 30 questions + categories
   ============================================ */

let db = null;
let currentQuestion = 0;

// ============================================
// QUESTIONS DATA (30 questions, 5 categories)
// ============================================
const questions = [
  // ========== CATEGORY: SELECT ==========
  {
    category: "SELECT",
    difficulty: "Easy",
    question: "Find all students who scored more than 80 marks.",
    hint: "Use WHERE marks > 80",
    expected: "SELECT * FROM students WHERE marks > 80"
  },
  {
    category: "SELECT",
    difficulty: "Easy",
    question: "Get the names of students who live in 'Patna'.",
    hint: "Use WHERE city = 'Patna'",
    expected: "SELECT name FROM students WHERE city = 'Patna'"
  },
  {
    category: "SELECT",
    difficulty: "Easy",
    question: "List all students sorted by marks in descending order.",
    hint: "Use ORDER BY marks DESC",
    expected: "SELECT * FROM students ORDER BY marks DESC"
  },
  {
    category: "SELECT",
    difficulty: "Easy",
    question: "Get all students whose name starts with 'A'.",
    hint: "Use LIKE 'A%'",
    expected: "SELECT * FROM students WHERE name LIKE 'A%'"
  },
  {
    category: "SELECT",
    difficulty: "Easy",
    question: "Find students with marks between 60 and 80 (inclusive).",
    hint: "Use BETWEEN 60 AND 80",
    expected: "SELECT * FROM students WHERE marks BETWEEN 60 AND 80"
  },
  {
    category: "SELECT",
    difficulty: "Easy",
    question: "List all unique cities from the students table.",
    hint: "Use DISTINCT city",
    expected: "SELECT DISTINCT city FROM students"
  },
  {
    category: "SELECT",
    difficulty: "Medium",
    question: "List the top 3 students by marks.",
    hint: "Use ORDER BY marks DESC LIMIT 3",
    expected: "SELECT * FROM students ORDER BY marks DESC LIMIT 3"
  },
  {
    category: "SELECT",
    difficulty: "Medium",
    question: "Find students whose name ends with 'a'.",
    hint: "Use LIKE '%a'",
    expected: "SELECT * FROM students WHERE name LIKE '%a'"
  },
  {
    category: "SELECT",
    difficulty: "Medium",
    question: "Find students from Patna OR Delhi.",
    hint: "Use WHERE city = 'Patna' OR city = 'Delhi'",
    expected: "SELECT * FROM students WHERE city = 'Patna' OR city = 'Delhi'"
  },
  {
    category: "SELECT",
    difficulty: "Medium",
    question: "Find students who are NOT from Patna.",
    hint: "Use WHERE city != 'Patna'",
    expected: "SELECT * FROM students WHERE city != 'Patna'"
  },
  {
    category: "SELECT",
    difficulty: "Medium",
    question: "Find students with marks greater than 80 AND from Patna.",
    hint: "Use WHERE with AND",
    expected: "SELECT * FROM students WHERE marks > 80 AND city = 'Patna'"
  },

  // ========== CATEGORY: AGGREGATE ==========
  {
    category: "AGGREGATE",
    difficulty: "Medium",
    question: "Find the average marks of all students.",
    hint: "Use AVG(marks)",
    expected: "SELECT AVG(marks) FROM students"
  },
  {
    category: "AGGREGATE",
    difficulty: "Medium",
    question: "Count how many students are in the database.",
    hint: "Use COUNT(*)",
    expected: "SELECT COUNT(*) FROM students"
  },
  {
    category: "AGGREGATE",
    difficulty: "Medium",
    question: "Get the total marks of all students combined.",
    hint: "Use SUM(marks)",
    expected: "SELECT SUM(marks) FROM students"
  },
  {
    category: "AGGREGATE",
    difficulty: "Medium",
    question: "Find the highest marks in the students table.",
    hint: "Use MAX(marks)",
    expected: "SELECT MAX(marks) FROM students"
  },
  {
    category: "AGGREGATE",
    difficulty: "Medium",
    question: "Find the lowest marks in the students table.",
    hint: "Use MIN(marks)",
    expected: "SELECT MIN(marks) FROM students"
  },
  {
    category: "AGGREGATE",
    difficulty: "Hard",
    question: "Find the second highest marks in the students table.",
    hint: "Use ORDER BY marks DESC LIMIT 1 OFFSET 1",
    expected: "SELECT * FROM students ORDER BY marks DESC LIMIT 1 OFFSET 1"
  },

  // ========== CATEGORY: GROUP BY ==========
  {
    category: "GROUP BY",
    difficulty: "Medium",
    question: "Count how many students are from each city.",
    hint: "Use GROUP BY city with COUNT(*)",
    expected: "SELECT city, COUNT(*) FROM students GROUP BY city"
  },
  {
    category: "GROUP BY",
    difficulty: "Medium",
    question: "Find the average marks per city.",
    hint: "Use GROUP BY city with AVG(marks)",
    expected: "SELECT city, AVG(marks) FROM students GROUP BY city"
  },
  {
    category: "GROUP BY",
    difficulty: "Medium",
    question: "Find the highest marks in each city.",
    hint: "Use GROUP BY city with MAX(marks)",
    expected: "SELECT city, MAX(marks) FROM students GROUP BY city"
  },
  {
    category: "GROUP BY",
    difficulty: "Hard",
    question: "Find cities where the average marks are above 75.",
    hint: "Use GROUP BY city with HAVING AVG(marks) > 75",
    expected: "SELECT city, AVG(marks) FROM students GROUP BY city HAVING AVG(marks) > 75"
  },
  {
    category: "GROUP BY",
    difficulty: "Hard",
    question: "Find the number of students in each city, sorted by count descending.",
    hint: "GROUP BY + ORDER BY COUNT(*) DESC",
    expected: "SELECT city, COUNT(*) FROM students GROUP BY city ORDER BY COUNT(*) DESC"
  },

  // ========== CATEGORY: JOIN ==========
  {
    category: "JOIN",
    difficulty: "Hard",
    question: "Find each student's name along with their course names.",
    hint: "Use JOIN students and courses ON students.id = courses.student_id",
    expected: "SELECT students.name, courses.course_name FROM students JOIN courses ON students.id = courses.student_id"
  },
  {
    category: "JOIN",
    difficulty: "Hard",
    question: "Find students who scored above 90 in any course.",
    hint: "Use JOIN with WHERE courses.score > 90",
    expected: "SELECT students.name, courses.course_name, courses.score FROM students JOIN courses ON students.id = courses.student_id WHERE courses.score > 90"
  },
  {
    category: "JOIN",
    difficulty: "Hard",
    question: "Find the course names for the student named 'Aditya'.",
    hint: "JOIN + WHERE students.name = 'Aditya'",
    expected: "SELECT courses.course_name FROM students JOIN courses ON students.id = courses.student_id WHERE students.name = 'Aditya'"
  },
  {
    category: "JOIN",
    difficulty: "Hard",
    question: "Get each student's name and their total course score.",
    hint: "JOIN + GROUP BY students.name with SUM(courses.score)",
    expected: "SELECT students.name, SUM(courses.score) FROM students JOIN courses ON students.id = courses.student_id GROUP BY students.name"
  },
  {
    category: "JOIN",
    difficulty: "Hard",
    question: "Find all students who took 'Mathematics'.",
    hint: "JOIN + WHERE courses.course_name = 'Mathematics'",
    expected: "SELECT students.name FROM students JOIN courses ON students.id = courses.student_id WHERE courses.course_name = 'Mathematics'"
  },

  // ========== CATEGORY: SUBQUERY ==========
  {
    category: "SUBQUERY",
    difficulty: "Hard",
    question: "Find students who scored more than the average marks.",
    hint: "Use WHERE marks > (SELECT AVG(marks) FROM students)",
    expected: "SELECT * FROM students WHERE marks > (SELECT AVG(marks) FROM students)"
  },
  {
    category: "SUBQUERY",
    difficulty: "Hard",
    question: "Find the student with the highest marks.",
    hint: "Use ORDER BY marks DESC LIMIT 1",
    expected: "SELECT * FROM students ORDER BY marks DESC LIMIT 1"
  },
  {
    category: "SUBQUERY",
    difficulty: "Hard",
    question: "Find students who scored higher than RaviRaj in marks.",
    hint: "Use subquery to find RaviRaj's marks",
    expected: "SELECT * FROM students WHERE marks > (SELECT marks FROM students WHERE name = 'RaviRaj')"
  }
];

// ============================================
// INITIALIZE DATABASE
// ============================================
async function initDatabase() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
  });

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

  // Insert 20 students
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

  // Create courses table (for JOIN practice)
  db.run(`
    CREATE TABLE courses (
      id INTEGER PRIMARY KEY,
      student_id INTEGER,
      course_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);

  // Insert course records
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

  console.log("✅ Database ready: 20 students + 22 course records + 30 questions");
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
// RUN QUERY
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

    displayResult(result[0]);

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
// DISPLAY RESULT
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
    showMessage("🎉 You finished all 30 questions! More coming soon.", "success");
  }
});

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
