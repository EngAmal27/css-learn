// ===== Grab elements =====
const lessonList = document.getElementById("lessonList");
const hero = document.getElementById("hero");
const lessonEl = document.getElementById("lesson");
const lessonNum = document.getElementById("lessonNum");
const lessonTitle = document.getElementById("lessonTitle");
const lessonBody = document.getElementById("lessonBody");
const playground = document.getElementById("playground");
const cssEditor = document.getElementById("cssEditor");
const htmlEditor = document.getElementById("htmlEditor");
const previewFrame = document.getElementById("previewFrame");
const quizEl = document.getElementById("quiz");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const doneBtn = document.getElementById("doneBtn");
const resetBtn = document.getElementById("resetBtn");
const wideBtn = document.getElementById("wideBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const sidebar = document.getElementById("sidebar");

let current = 0;

// ===== Saved progress (localStorage) =====
function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — progress just won't be remembered
  }
}

// Completed lessons are saved by id, so adding lessons later doesn't break progress
let completed = load("css-learn-done-ids", []);
const isDone = (i) => completed.includes(lessons[i].id);

// ===== Sidebar (grouped by part) =====
function renderSidebar() {
  lessonList.innerHTML = "";
  let list;
  let lastPart;

  lessons.forEach((lesson, i) => {
    if (lesson.part !== lastPart) {
      const heading = document.createElement("h2");
      heading.textContent = PARTS[lesson.part];
      list = document.createElement("ol");
      list.className = "lesson-list";
      lessonList.append(heading, list);
      lastPart = lesson.part;
    }

    const btn = document.createElement("button");
    btn.innerHTML = `<span class="dot">${isDone(i) ? "✓" : i + 1}</span>
      <span><small>${lesson.section}</small>${lesson.title}</span>`;
    if (isDone(i)) btn.classList.add("done");
    if (i === current && !lessonEl.hidden) btn.classList.add("active");
    btn.addEventListener("click", () => showLesson(i));

    const li = document.createElement("li");
    li.appendChild(btn);
    list.appendChild(li);
  });

  const pct = (completed.length / lessons.length) * 100;
  progressFill.style.width = pct + "%";
  progressText.textContent = `${completed.length} / ${lessons.length}`;
}

// ===== Live preview =====
function updatePreview() {
  const lesson = lessons[current];
  previewFrame.srcdoc = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${lesson.head || ""}
    <style>body { font-family: system-ui, sans-serif; margin: 12px; }</style>
    <style>${cssEditor.value}</style>
  </head>
  <body>${htmlEditor.value}</body>
</html>`;
}

// ===== Editor tabs =====
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    cssEditor.hidden = tab.dataset.tab !== "css";
    htmlEditor.hidden = tab.dataset.tab !== "html";
  });
});

// ===== Quiz =====
const inlineCode = (text) => text.replace(/</g, "&lt;").replace(/`([^`]+)`/g, "<code>$1</code>");

function renderQuiz(questions) {
  quizEl.innerHTML = `<h3>Quick check</h3>`;

  questions.forEach((quiz, qi) => {
    const block = document.createElement("div");
    block.className = "quiz-question";
    block.innerHTML = `<p class="q-text"><strong>${qi + 1}.</strong> ${inlineCode(quiz.question)}</p>`;

    const options = document.createElement("div");
    options.className = "quiz-options";
    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";

    // Shuffle the options so the right answer isn't always in the same spot
    const order = quiz.options.map((_, i) => i).sort(() => Math.random() - 0.5);

    order.forEach((i) => {
      const btn = document.createElement("button");
      btn.innerHTML = inlineCode(quiz.options[i]);
      btn.addEventListener("click", () => {
        if (i === quiz.answer) {
          btn.classList.add("correct");
          feedback.innerHTML = "✅ Correct!" + (quiz.explain ? ` <span>${inlineCode(quiz.explain)}</span>` : "");
          feedback.className = "quiz-feedback right";
          options.querySelectorAll("button").forEach((b) => (b.disabled = true));
        } else {
          btn.classList.add("wrong");
          btn.disabled = true;
          feedback.textContent = "❌ Not quite — try again.";
          feedback.className = "quiz-feedback wrong";
        }
      });
      options.appendChild(btn);
    });

    block.append(options, feedback);
    quizEl.appendChild(block);
  });
}

// ===== Show a lesson =====
function showLesson(i) {
  current = i;
  const lesson = lessons[i];

  hero.hidden = true;
  lessonEl.hidden = false;

  lessonNum.textContent = `Lesson ${i + 1} of ${lessons.length} · ${lesson.section}`;
  lessonTitle.textContent = lesson.title;
  lessonBody.innerHTML = lesson.body;
  cssEditor.value = lesson.css;
  htmlEditor.value = lesson.html;
  updatePreview();
  renderQuiz(lesson.quiz);

  prevBtn.disabled = i === 0;
  nextBtn.disabled = i === lessons.length - 1;
  doneBtn.textContent = isDone(i) ? "✓ Completed" : "Mark complete";

  save("css-learn-current", i);
  sidebar.classList.remove("open");
  renderSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== Events =====
cssEditor.addEventListener("input", updatePreview);
htmlEditor.addEventListener("input", updatePreview);

// Let the Tab key insert spaces instead of leaving the editor
[cssEditor, htmlEditor].forEach((editor) => {
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      editor.setRangeText("  ", editor.selectionStart, editor.selectionEnd, "end");
      updatePreview();
    }
  });
});

resetBtn.addEventListener("click", () => {
  cssEditor.value = lessons[current].css;
  htmlEditor.value = lessons[current].html;
  updatePreview();
});

wideBtn.addEventListener("click", () => {
  playground.classList.toggle("wide");
});

prevBtn.addEventListener("click", () => showLesson(current - 1));
nextBtn.addEventListener("click", () => showLesson(current + 1));

doneBtn.addEventListener("click", () => {
  const id = lessons[current].id;
  if (!completed.includes(id)) {
    completed.push(id);
    save("css-learn-done-ids", completed);
  }
  if (current < lessons.length - 1) {
    showLesson(current + 1);
  } else {
    doneBtn.textContent = "🎉 All done!";
    renderSidebar();
  }
});

document.getElementById("startBtn").addEventListener("click", () => {
  const saved = load("css-learn-current", 0);
  showLesson(saved < lessons.length ? saved : 0);
});

document.getElementById("menuBtn").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// ===== Dark / light theme =====
const themeBtn = document.getElementById("themeBtn");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  save("css-learn-theme", theme);
}

themeBtn.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(load("css-learn-theme", prefersDark ? "dark" : "light"));

renderSidebar();
