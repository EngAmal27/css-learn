// ===== Helpers for writing lesson content =====
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const code = (s) => `<pre><code>${esc(s.trim())}</code></pre>`;
const table = (head, rows) => `
  <div class="table-wrap"><table>
    <thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
const tip = (s) => `<p class="callout tip">💡 ${s}</p>`;
const analogy = (s) => `<p class="callout analogy">🧠 <strong>Analogy:</strong> ${s}</p>`;
const mistakes = (list) => `
  <div class="callout mistakes"><strong>⚠️ Common mistakes</strong>
    <ul>${list.map((m) => `<li>${m}</li>`).join("")}</ul>
  </div>`;

const PARTS = {
  1: "Part 1 · CSS Basics & Layout",
  2: "Part 2 · Flexbox, Effects, Responsive & Bootstrap",
};

// Every lesson: id, part, section, title, body (HTML), html + css (playground start),
// optional head (extra tags for the preview), and quiz (list of questions).
const lessons = [
  // ================= PART 1 =================
  {
    id: "what-is-css",
    part: 1,
    section: "2.1",
    title: "What is CSS?",
    body: `
      <p>CSS stands for <strong>Cascading Style Sheets</strong>.</p>
      <ul>
        <li><strong>Style Sheets</strong> — a sheet of rules that describe how the page looks.</li>
        <li><strong>Cascading</strong> — when several rules target the same element, a system decides which one wins (you'll learn it in the Specificity lesson).</li>
      </ul>
      ${analogy("HTML is the structure of a house (walls and doors). CSS is the paint, the furniture and the decoration.")}
      <h3>Anatomy of a rule</h3>
      ${code(`
selector {
  property: value;
  property: value;
}

h1 {
  color: blue;
  font-size: 32px;
}`)}
      ${table(["Part", "Example", "Meaning"], [
        ["Selector", "<code>h1</code>", "Who are we styling?"],
        ["Property", "<code>color</code>", "What are we changing?"],
        ["Value", "<code>blue</code>", "The new value"],
        ["Declaration", "<code>color: blue;</code>", "One property + value, ends with <code>;</code>"],
        ["Declaration block", "<code>{ }</code>", "All the declarations together"],
      ])}
    `,
    html: `<h1>Hello CSS!</h1>
<p>Change my color and size from the CSS tab.</p>`,
    css: `h1 {
  color: blue;
  font-size: 32px;
}

p {
  color: gray;
}`,
    quiz: [
      {
        question: "In `h1 { color: blue; }`, what is `color: blue;` called?",
        options: ["A selector", "A declaration", "A declaration block"],
        answer: 1,
      },
      {
        question: "What does the word \"Cascading\" refer to?",
        options: ["Rules are written in a waterfall shape", "A system that decides which rule wins when rules conflict", "CSS files must be linked in order"],
        answer: 1,
      },
    ],
  },
  {
    id: "linking-css",
    part: 1,
    section: "2.2",
    title: "Linking CSS to HTML",
    body: `
      <p>There are 3 ways to add CSS to a page:</p>
      ${code(`
<!-- 1. Inline -->
<p style="color: red; font-size: 18px;">Text</p>

<!-- 2. Internal: inside the <head> -->
<style>
  p { color: red; }
</style>

<!-- 3. External: a separate file (the best) -->
<link rel="stylesheet" href="css/style.css">`)}
      ${table(["", "Inline", "Internal", "External"], [
        ["Where", "In the tag itself", "<code>&lt;style&gt;</code> in the head", "Separate <code>.css</code> file"],
        ["Affects", "One element", "One page", "Every page that links it"],
        ["Priority", "Highest", "By order", "By order"],
        ["Reusable", "No", "Same page only", "Yes"],
        ["Organisation", "Bad", "Medium", "Best"],
        ["Browser cache", "No", "No", "Yes — faster site"],
        ["When to use", "Quick test, or from JS", "One small page", "Any real project"],
      ])}
      ${tip("Internal and External have the same priority — whichever is written <em>later</em> in the page wins.")}
    `,
    html: `<p>I am a normal paragraph.</p>
<p style="color: red;">I have an inline style — who wins?</p>`,
    css: `/* This is like an internal <style> block */
p {
  color: blue;
  font-size: 20px;
}`,
    quiz: [
      {
        question: "Which method should you use for a real project?",
        options: ["Inline", "Internal", "External"],
        answer: 2,
        explain: "It's reusable across pages, organised, and the browser can cache it.",
      },
      {
        question: "A paragraph has `style=\"color: red\"` and the CSS file says `p { color: blue; }`. What color is it?",
        options: ["Red", "Blue", "Purple"],
        answer: 0,
        explain: "Inline styles have the highest priority (except !important).",
      },
    ],
  },
  {
    id: "selectors-basic",
    part: 1,
    section: "2.3",
    title: "Selectors & Combinators",
    body: `
      <h3>Basic selectors</h3>
      ${code(`
/* Universal: every element */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Element (type): every p */
p { line-height: 1.6; }

/* Class: any element with class="card" */
.card { background: white; }

/* ID: the element with id="hero" */
#hero { height: 100vh; }

/* Grouping: several selectors, same rules */
h1, h2, h3 { font-family: 'Cairo', sans-serif; }

/* A specific element with a specific class */
p.note { color: gray; }

/* An element that has BOTH classes */
.btn.primary { background: blue; }`)}
      ${table(["", "Class", "ID"], [
        ["Symbol", "<code>.</code>", "<code>#</code>"],
        ["Repeat", "On many elements", "Once per page (unique)"],
        ["Per element", "Many classes", "One ID"],
        ["Specificity", "Lower", "Much higher"],
        ["Main use", "CSS", "JS, labels, <code>#section</code> links"],
      ])}
      ${tip("Use <strong>classes</strong> for CSS almost always. Leave IDs for JavaScript and anchor links.")}
      <h3>Combinators</h3>
      ${table(["Name", "Symbol", "Selects"], [
        ["Descendant", "space", "Inside the element, at any depth"],
        ["Child", "<code>&gt;</code>", "Direct children only"],
        ["Adjacent sibling", "<code>+</code>", "The sibling right after it"],
        ["General sibling", "<code>~</code>", "All siblings after it"],
      ])}
      ${analogy("Descendant = all your grandchildren. Child = your kids only. Adjacent = the younger sibling right after you. General sibling = all your younger siblings.")}
      <p>The playground uses this structure — check which paragraphs each rule colors:</p>
      ${code(`
<div class="box">
  <p>A: direct child</p>
  <section><p>B: grandchild</p></section>
  <span>C</span>
  <p>D</p>
  <p>E</p>
</div>`)}
    `,
    html: `<div class="box">
  <p>A: direct child</p>
  <section>
    <p>B: grandchild</p>
  </section>
  <span>C (span)</span>
  <p>D</p>
  <p>E</p>
</div>`,
    css: `/* Descendant: any p inside .box -> A, B, D, E */
.box p { color: red; }

/* Child: direct children only -> A, D, E */
.box > p { font-weight: bold; }

/* Adjacent sibling: first p right after span -> D */
span + p { background: lightgreen; }

/* General sibling: every p after span -> D, E */
span ~ p { border-left: 4px solid orange; padding-left: 6px; }`,
    quiz: [
      {
        question: "Which paragraphs does `.box > p` select in the example?",
        options: ["A, B, D, E", "A, D, E", "D only"],
        answer: 1,
        explain: "B is inside <section>, so it's a grandchild, not a direct child.",
      },
      {
        question: "Which selector targets `<button class=\"btn primary\">` but NOT `<button class=\"btn\">`?",
        options: [".btn .primary", ".btn.primary", ".btn, .primary"],
        answer: 1,
        explain: "No space means the same element must have both classes.",
      },
    ],
  },
  {
    id: "selectors-advanced",
    part: 1,
    section: "2.3",
    title: "Attribute, Pseudo-classes & Pseudo-elements",
    body: `
      <h3>Attribute selectors</h3>
      ${code(`
input[type="text"]  { border: 1px solid gray; }
[required]          { border-color: red; }
a[href^="https"]    { color: green; }   /* starts with */
a[href$=".pdf"]     { color: red; }     /* ends with */
a[href*="google"]   { font-weight: bold; } /* contains */`)}
      ${table(["Form", "Meaning"], [
        ["<code>[attr]</code>", "Attribute exists"],
        ["<code>[attr=\"v\"]</code>", "Exactly equal"],
        ["<code>[attr^=\"v\"]</code>", "Starts with"],
        ["<code>[attr$=\"v\"]</code>", "Ends with"],
        ["<code>[attr*=\"v\"]</code>", "Contains"],
      ])}
      <h3>Pseudo-classes — an element in a certain <em>state</em> or <em>position</em></h3>
      ${code(`
/* Interaction */
a:hover        { color: red; }
button:active  { transform: scale(0.95); }
input:focus    { outline: 2px solid blue; }
a:visited      { color: purple; }

/* Forms */
input:checked + label { font-weight: bold; }
input:disabled { opacity: 0.5; }
input:invalid  { border-color: red; }

/* Position among siblings */
li:first-child         { font-weight: bold; }
li:last-child          { border-bottom: none; }
li:nth-child(2)        { color: red; }
tr:nth-child(even)     { background: #eee; }
li:nth-child(3n)       { }   /* every third */
p:not(.special)        { color: gray; }`)}
      ${tip("Link states order is <code>:link → :visited → :hover → :active</code>. Remember it as <strong>LoVe HAte</strong>. If the order is reversed, hover may not work.")}
      <h3>Pseudo-elements — a <em>part</em> of an element, or fake content</h3>
      ${code(`
p::first-letter    { font-size: 2em; }
p::first-line      { font-weight: bold; }
::selection        { background: yellow; }
input::placeholder { color: #aaa; }

.price::before    { content: "$"; }
.required::after  { content: " *"; color: red; }

/* A line under the heading with ::after */
h2::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background: orange;
  margin-top: 8px;
}`)}
      ${tip("<code>::before</code> and <code>::after</code> won't show without <code>content</code> — even <code>content: \"\"</code> is enough.")}
      ${table(["", "Pseudo-class", "Pseudo-element"], [
        ["Symbol", "One colon <code>:</code>", "Two colons <code>::</code>"],
        ["Selects", "The whole element in a state", "A part of the element"],
        ["Examples", "<code>:hover</code>, <code>:focus</code>, <code>:nth-child</code>", "<code>::before</code>, <code>::first-letter</code>"],
        ["Question", "What is the element <em>doing</em>?", "Which <em>piece</em> of it?"],
      ])}
    `,
    html: `<h2>Shopping list</h2>
<ul>
  <li>Milk</li>
  <li>Bread</li>
  <li>Eggs</li>
  <li>Cheese</li>
  <li>Tea</li>
</ul>
<p class="price">250</p>
<a href="https://google.com">Google</a> ·
<a href="files/menu.pdf">Menu PDF</a>`,
    css: `h2::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background: orange;
  margin-top: 8px;
}

li:first-child { font-weight: bold; }
li:nth-child(even) { background: #eee; }
li:hover { color: crimson; }

.price::before { content: "EGP "; color: gray; }

a[href^="https"] { color: green; }
a[href$=".pdf"] { color: red; }`,
    quiz: [
      {
        question: "You wrote `.icon::before { color: red; }` but nothing appears. Why?",
        options: ["::before only works on links", "It's missing the content property", "Pseudo-elements need an ID"],
        answer: 1,
      },
      {
        question: "Which selects every even row of a table?",
        options: ["tr:even", "tr:nth-child(even)", "tr::nth(2n)"],
        answer: 1,
      },
    ],
  },
  {
    id: "specificity",
    part: 1,
    section: "2.3",
    title: "Specificity & Inheritance",
    body: `
      <p>If two rules conflict, who wins? Each selector gets <strong>points</strong>:</p>
      ${table(["Type", "Weight"], [
        ["<code>!important</code>", "Beats everything (don't use it unless you must)"],
        ["Inline style", "1-0-0-0"],
        ["ID", "0-1-0-0"],
        ["Class, attribute, pseudo-class", "0-0-1-0"],
        ["Element, pseudo-element", "0-0-0-1"],
        ["<code>*</code>", "0"],
      ])}
      ${table(["Selector", "Score"], [
        ["<code>p</code>", "0-0-0-1"],
        ["<code>.card p</code>", "0-0-1-1"],
        ["<code>#main .card p</code>", "0-1-1-1"],
        ["<code>nav ul li a:hover</code>", "0-0-1-4"],
      ])}
      <p><strong>Rules:</strong> the higher score wins. If the scores are equal, the rule written <strong>last</strong> wins (that's the Cascade).</p>
      ${code(`
#title { color: red; }    /* 0-1-0-0 -> wins */
.title { color: blue; }   /* 0-0-1-0 */
h1     { color: green; }  /* 0-0-0-1 */`)}
      <h3>Inheritance</h3>
      <p>Some properties pass down from parent to children automatically.</p>
      ${table(["Inherited", "Not inherited"], [
        ["<code>color</code>, <code>font-family</code>, <code>font-size</code>, <code>line-height</code>, <code>text-align</code>",
         "<code>margin</code>, <code>padding</code>, <code>border</code>, <code>background</code>, <code>width</code>, <code>height</code>"],
      ])}
      ${code(`
body { font-family: 'Cairo', sans-serif; color: #333; }
/* every text on the page gets this font and color */`)}
    `,
    html: `<h1 id="title" class="title">Which color am I?</h1>

<ul class="menu">
  <li>1</li>
  <li class="active">2</li>
  <li>3</li>
  <li>4</li>
</ul>`,
    css: `#title { color: red; }
.title  { color: blue; }
h1      { color: green; }

/* Guess the colors of 1-4 before looking! */
.menu li { color: black; }
.active + li { color: red; }
.menu li:last-child { color: blue; }`,
    quiz: [
      {
        question: "What is the specificity of `#nav .link:hover`?",
        options: ["0-1-1-0", "0-1-2-0", "0-0-2-1"],
        answer: 1,
        explain: "1 ID + 1 class + 1 pseudo-class (counts like a class) = 0-1-2-0.",
      },
      {
        question: "In the menu example, what colors are items 3 and 4?",
        options: ["3 black, 4 blue", "3 red, 4 blue", "3 red, 4 red"],
        answer: 1,
        explain: "`.active + li` ties with `.menu li` (0-0-1-1) but comes later, so 3 is red. `:last-child` scores 0-0-2-1, so 4 is blue.",
      },
      {
        question: "Which property is NOT inherited by children?",
        options: ["color", "font-family", "padding"],
        answer: 2,
      },
    ],
  },
  {
    id: "colors-units",
    part: 1,
    section: "2.4",
    title: "Colors & Units",
    body: `
      <h3>Writing colors</h3>
      ${code(`
color: red;                    /* name */
color: #ff0000;                /* Hex */
color: #f00;                   /* short Hex */
color: rgb(255, 0, 0);         /* RGB */
color: rgba(255, 0, 0, 0.5);   /* RGB + transparency */
color: hsl(0, 100%, 50%);      /* Hue, Saturation, Lightness */`)}
      ${table(["Method", "Transparency", "Note"], [
        ["Name", "No", "Only ~140 colors"],
        ["Hex", "Yes, with 8 digits (<code>#ff000080</code>)", "Most common in design"],
        ["RGB / RGBA", "Yes", "Easy to understand the mix"],
        ["HSL", "Yes", "Easiest for shades of the same color"],
      ])}
      ${table(["", "<code>opacity: 0.5</code>", "<code>background: rgba(0,0,0,0.5)</code>"], [
        ["Affects", "The whole element and everything inside", "Only the background"],
        ["Text inside", "Becomes transparent too", "Stays clear"],
      ])}
      <h3>Units</h3>
      ${table(["Unit", "Type", "Relative to", "Example"], [
        ["<code>px</code>", "Fixed", "Nothing", "Borders"],
        ["<code>%</code>", "Relative", "The parent", "<code>width: 50%</code>"],
        ["<code>em</code>", "Relative", "The parent's (or own) font-size", "Button padding"],
        ["<code>rem</code>", "Relative", "The <code>&lt;html&gt;</code> font-size (usually 16px)", "Font sizes and spacing"],
        ["<code>vw</code>", "Relative", "1% of screen width", ""],
        ["<code>vh</code>", "Relative", "1% of screen height", "<code>height: 100vh</code> for a hero"],
      ])}
      ${code(`
html  { font-size: 16px; }
.parent    { font-size: 20px; }
.child-em  { font-size: 2em; }   /* 2 × 20 = 40px */
.child-rem { font-size: 2rem; }  /* 2 × 16 = 32px */`)}
      ${tip("The problem with <code>em</code>: it multiplies when elements are nested. That's why <code>rem</code> is safer for font sizes.")}
    `,
    html: `<div class="parent">
  Parent (20px)
  <p class="child-em">2em child</p>
  <p class="child-rem">2rem child</p>
</div>

<div class="photo">
  <div class="opacity">opacity: 0.5</div>
  <div class="rgba">rgba background</div>
</div>`,
    css: `html { font-size: 16px; }
.parent { font-size: 20px; }
.child-em { font-size: 2em; }
.child-rem { font-size: 2rem; }

.photo {
  background: linear-gradient(45deg, teal, orange);
  padding: 16px;
  margin-top: 16px;
}

.opacity, .rgba {
  color: white;
  font-weight: bold;
  padding: 12px;
  margin: 8px 0;
}

.opacity { background: black; opacity: 0.5; }
.rgba { background: rgba(0, 0, 0, 0.5); }`,
    quiz: [
      {
        question: "`html` is 16px and `.parent` is 20px. What is `1.5em` for a child of `.parent`?",
        options: ["24px", "30px", "36px"],
        answer: 1,
        explain: "em uses the parent's font-size: 1.5 × 20 = 30px. (1.5rem would be 24px.)",
      },
      {
        question: "You want a dark see-through background but clear white text. Which do you use?",
        options: ["opacity: 0.5", "background: rgba(0, 0, 0, 0.5)", "color: transparent"],
        answer: 1,
      },
    ],
  },
  {
    id: "fonts-text",
    part: 1,
    section: "2.5–2.6",
    title: "Fonts & Text",
    body: `
      <h3>Font properties</h3>
      ${code(`
.text {
  font-family: 'Cairo', Arial, sans-serif; /* in order: if the first is missing, use the next */
  font-size: 1.125rem;
  font-weight: 700;     /* 100 to 900, or normal / bold */
  font-style: italic;   /* normal / italic */
  line-height: 1.6;     /* space between lines, best without a unit */
}

/* Shorthand */
.text { font: italic 700 1.125rem/1.6 'Cairo', sans-serif; }`)}
      <p>Using Google Fonts — put this in the <code>&lt;head&gt;</code>:</p>
      ${code(`<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">`)}
      ${table(["", "Serif", "Sans-serif", "Monospace"], [
        ["Shape", "Little \"feet\" on letter edges", "No feet", "All letters same width"],
        ["Example", "Times New Roman", "Arial, Cairo", "Courier, Consolas"],
        ["Use", "Books, newspapers", "Web and screens", "Code"],
      ])}
      <h3>Text properties</h3>
      ${code(`
.text {
  color: #333;
  text-align: center;          /* left / right / center / justify */
  text-decoration: none;       /* underline / line-through / none */
  text-transform: uppercase;   /* uppercase / lowercase / capitalize */
  letter-spacing: 2px;
  word-spacing: 5px;
  text-indent: 30px;           /* indent the first line */
}

/* "..." when text is too long — needs all three */
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Most common use: remove the underline from links */
a { text-decoration: none; color: inherit; }`)}
      ${tip("<code>text-transform</code> only works on English (Latin) letters — Arabic has no uppercase.")}
    `,
    html: `<h1>Nile Café</h1>
<p class="tag">coffee on the nile</p>
<p class="long">This is a very long product title that will not fit in the box at all</p>
<p>Good typography makes text easy to read. Try changing the line-height and font-family.</p>
<a href="#">A link without underline</a>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');

body {
  font-family: 'Cairo', sans-serif;
  line-height: 1.7;
  color: #333;
}

h1 { font-size: 2.5rem; text-align: center; }

.tag {
  text-transform: uppercase;
  letter-spacing: 4px;
  text-align: center;
  color: gray;
}

.long {
  width: 250px;
  border: 1px solid #ccc;
  padding: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

a { text-decoration: none; color: teal; }`,
    quiz: [
      {
        question: "Which is the best type of font for code?",
        options: ["Serif", "Sans-serif", "Monospace"],
        answer: 2,
      },
      {
        question: "You added `text-overflow: ellipsis` but the \"...\" doesn't appear. What's missing?",
        options: ["white-space: nowrap and overflow: hidden", "display: flex", "text-align: right"],
        answer: 0,
      },
    ],
  },
  {
    id: "backgrounds",
    part: 1,
    section: "2.7",
    title: "Backgrounds & Gradients",
    body: `
      ${code(`
.hero {
  background-color: #222;
  background-image: url('../images/bg.jpg');
  background-repeat: no-repeat;   /* repeat / repeat-x / repeat-y / no-repeat */
  background-size: cover;         /* cover / contain / 100% auto */
  background-position: center;    /* top / center / bottom / 50% 50% */
  background-attachment: fixed;   /* scroll / fixed (Parallax) */
}

/* Shorthand */
.hero { background: #222 url('bg.jpg') no-repeat center / cover; }`)}
      ${table(["", "cover", "contain"], [
        ["Fills the whole area", "Yes", "Maybe leaves empty space"],
        ["Whole image visible", "Maybe crops it", "Yes"],
        ["Use", "Hero background", "Logo or product image"],
      ])}
      ${table(["", "scroll (default)", "fixed"], [
        ["Effect", "Background moves with the page", "Background stays still, content slides over it (Parallax)"],
      ])}
      <h3>Gradients</h3>
      ${code(`
/* Linear: in a straight line */
.a { background: linear-gradient(to right, #ff7e5f, #feb47b); }
.b { background: linear-gradient(45deg, red, yellow, green); }

/* Radial: from the center outwards */
.c { background: radial-gradient(circle, white, navy); }

/* Dark overlay on a photo so text is readable */
.hero {
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
              url('bg.jpg') center / cover;
}`)}
      ${table(["", "linear-gradient", "radial-gradient"], [
        ["Direction", "Straight line at an angle", "Circles from a point outward"],
        ["Use", "Backgrounds and buttons", "Light or spotlight effects"],
      ])}
    `,
    html: `<div class="box a">linear to right</div>
<div class="box b">linear 45deg</div>
<div class="box c">radial</div>
<section class="hero">
  <h1>Text on an overlay</h1>
</section>`,
    css: `.box {
  height: 70px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-weight: bold;
}

.a { background: linear-gradient(to right, #ff7e5f, #feb47b); }
.b { background: linear-gradient(45deg, red, yellow, green); }
.c { background: radial-gradient(circle, white, navy); color: white; }

/* The "photo" here is a gradient so it works offline.
   With a real image use: url('bg.jpg') center / cover */
.hero {
  height: 160px;
  display: grid;
  place-items: center;
  color: white;
  background:
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    repeating-linear-gradient(45deg, #f4a261 0 20px, #2a9d8f 20px 40px);
}`,
    quiz: [
      {
        question: "Which background-size fills the whole hero, even if the image gets cropped?",
        options: ["contain", "cover", "auto"],
        answer: 1,
      },
      {
        question: "How do you make white text readable on a busy photo?",
        options: ["Put a dark gradient overlay on top of the image", "Use opacity on the section", "Use background-attachment: fixed"],
        answer: 0,
      },
    ],
  },
  {
    id: "box-model",
    part: 1,
    section: "2.8",
    title: "The Box Model",
    body: `
      <p>Every element is a box with 4 layers, from inside to outside — the most important lesson in CSS:</p>
      <ul>
        <li><strong>Content</strong> — the text or image itself.</li>
        <li><strong>Padding</strong> — space between content and border. Takes the background color.</li>
        <li><strong>Border</strong> — the frame.</li>
        <li><strong>Margin</strong> — space outside the border. Always transparent.</li>
      </ul>
      ${analogy("A framed picture. The picture = Content. The white card around it = Padding. The wooden frame = Border. The space between this frame and the next one on the wall = Margin.")}
      <h3>Writing margin and padding</h3>
      ${code(`
margin: 10px;                 /* all four sides */
margin: 10px 20px;            /* top & bottom | left & right */
margin: 10px 20px 30px;       /* top | left & right | bottom */
margin: 10px 20px 30px 40px;  /* top | right | bottom | left (clockwise) */
margin-top: 10px;             /* one side */
margin: 0 auto;               /* center a block horizontally (needs a width) */`)}
      ${code(`
border: 2px solid #333;         /* width | style | color */
border-bottom: 1px dashed red;  /* one side */
border-radius: 10px;            /* rounded corners */
border-radius: 50%;             /* circle (if the element is square) */
/* styles: solid / dashed / dotted / double / none */`)}
      <h3>box-sizing</h3>
      <p>With <code>width: 300px; padding: 20px; border: 5px</code>:</p>
      ${table(["", "content-box (default)", "border-box"], [
        ["<code>width</code> means", "The content only", "Content + padding + border"],
        ["Real width", "300 + 40 + 10 = <strong>350px</strong>", "<strong>300px</strong> exactly"],
        ["Easy to calculate", "No", "Yes"],
      ])}
      ${code(`
/* First lines of any project */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}`)}
      ${table(["", "Margin", "Padding"], [
        ["Position", "Outside the border", "Inside the border"],
        ["Takes background color", "No", "Yes"],
        ["Can be negative", "Yes", "No"],
        ["<code>auto</code>", "Yes, for centering", "No"],
        ["Collapses", "Yes", "No"],
      ])}
      <p><strong>Margin collapse:</strong> if one box has <code>margin-bottom: 30px</code> and the next has <code>margin-top: 20px</code>, the gap is 30px, not 50px — the bigger one wins. This only happens vertically.</p>
      ${code(`
.box {
  width: 80%;
  max-width: 1200px;  /* never wider than this */
  min-height: 200px;  /* never shorter than this */
  overflow: auto;     /* visible / hidden / scroll / auto when content is too big */
}`)}
      ${tip("Open DevTools → Elements and look at the Box Model diagram for any element. It makes this lesson click.")}
    `,
    html: `<div class="box content">content-box</div>
<div class="box border">border-box</div>
<div class="circle"></div>`,
    css: `.box {
  width: 300px;
  padding: 20px;
  border: 5px solid #333;
  margin: 20px auto;
  background: lightblue;
}

.content { box-sizing: content-box; } /* real width 350px */
.border  { box-sizing: border-box; }  /* real width 300px */

.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: coral;
  margin: 0 auto;
}`,
    quiz: [
      {
        question: "`width: 200px; padding: 10px; border: 2px` without box-sizing. What is the real width?",
        options: ["200px", "212px", "224px"],
        answer: 2,
        explain: "200 + 10×2 + 2×2 = 224px. With border-box it would be 200px.",
      },
      {
        question: "Box A has margin-bottom 30px, box B below it has margin-top 20px. What's the gap?",
        options: ["50px", "30px", "20px"],
        answer: 1,
        explain: "Vertical margins collapse — the bigger one wins.",
      },
      {
        question: "`margin: 10px 20px 30px 40px` — what is the left margin?",
        options: ["10px", "20px", "40px"],
        answer: 2,
      },
    ],
  },
  {
    id: "display",
    part: 1,
    section: "2.9",
    title: "Display",
    body: `
      ${code(`
display: block;
display: inline;
display: inline-block;
display: none;
display: flex;   /* Part 2 */
display: grid;`)}
      ${table(["", "block", "inline", "inline-block"], [
        ["Starts a new line", "Yes", "No", "No"],
        ["Width", "Full line", "Size of content", "Size of content"],
        ["Accepts width & height", "Yes", "No", "Yes"],
        ["Margin & padding top/bottom", "Yes", "Applied but don't push neighbours", "Yes"],
        ["Examples", "div, p, h1, section", "span, a, strong", "button, img, input"],
      ])}
      ${tip("Navbar links are <code>&lt;a&gt;</code> (inline). To give them padding like a button, make them <code>inline-block</code> or <code>block</code>.")}
      <h3>Hiding elements</h3>
      ${table(["", "display: none", "visibility: hidden", "opacity: 0"], [
        ["Visible", "No", "No", "No"],
        ["Keeps its space", "No — as if deleted", "Yes", "Yes"],
        ["Clickable", "No", "No", "Yes"],
        ["Can transition", "No", "Limited", "Yes"],
      ])}
    `,
    html: `<span class="item">span 1</span>
<span class="item">span 2</span>
<div class="item">div 1</div>
<div class="item">div 2</div>

<p>
  <span class="tag hide-a">A</span>
  <span class="tag hide-b">B</span>
  <span class="tag">C</span>
</p>`,
    css: `.item {
  background: plum;
  padding: 10px;
  margin: 5px;
  width: 120px; /* ignored by inline! */
}

/* Try changing to inline-block */
span.item { display: inline; }

.tag {
  display: inline-block;
  padding: 8px 14px;
  background: teal;
  color: white;
}

/* Compare: one leaves a gap, one doesn't */
.hide-a { visibility: hidden; }
.hide-b { /* display: none; */ }`,
    quiz: [
      {
        question: "You set `width: 200px` on a `<span>` and nothing happens. Why?",
        options: ["span is inline, which ignores width", "You need !important", "span only accepts %"],
        answer: 0,
      },
      {
        question: "Which hides an element AND removes its space?",
        options: ["visibility: hidden", "opacity: 0", "display: none"],
        answer: 2,
      },
    ],
  },
  {
    id: "position",
    part: 1,
    section: "2.10",
    title: "Position",
    body: `
      ${code(`
position: static;    /* default */
position: relative;
position: absolute;
position: fixed;
position: sticky;
/* used with: top / right / bottom / left / z-index */`)}
      <ul>
        <li><strong>static</strong> — normal place. <code>top</code> and <code>left</code> don't work.</li>
        <li><strong>relative</strong> — moves from its original place, which stays reserved. Main use: be the reference for an <code>absolute</code> child.</li>
        <li><strong>absolute</strong> — leaves the flow (others act like it isn't there). Positioned relative to the nearest parent that isn't <code>static</code>. If none, relative to the page.</li>
        <li><strong>fixed</strong> — leaves the flow and stays fixed to the screen, even when scrolling.</li>
        <li><strong>sticky</strong> — normal until scrolling reaches the <code>top</code> you set, then it sticks.</li>
      </ul>
      <h3>The classic example: a badge on a card</h3>
      ${code(`
.card  { position: relative; }   /* the reference */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
}`)}
      ${code(`
/* Fixed navbar */
.navbar { position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; }

/* WhatsApp button in the corner */
.whatsapp { position: fixed; bottom: 20px; left: 20px; }

/* Section title that sticks while scrolling */
.section-title { position: sticky; top: 0; background: white; }`)}
      <p><strong>z-index</strong> decides who's on top when elements overlap — bigger number on top. It only works on elements with a position other than static (or inside flex/grid).</p>
      ${table(["", "In the flow", "Reference", "Moves with scroll", "Example"], [
        ["static", "Yes", "—", "Yes", "Any normal element"],
        ["relative", "Yes (space kept)", "Its original place", "Yes", "Parent of an absolute"],
        ["absolute", "No", "Nearest positioned parent", "With the parent", "Badge, icon on image"],
        ["fixed", "No", "The screen", "No", "Navbar, chat button"],
        ["sticky", "Yes", "Parent + scroll", "Until it sticks", "Table header"],
      ])}
      ${tip("<code>float: left</code> was used for layouts in the past. Today it's only for wrapping text around an image — layouts use Flexbox and Grid.")}
    `,
    html: `<h3 class="section-title">Sticky title — scroll the preview</h3>
<div class="card">
  <span class="badge">NEW</span>
  Product card
</div>
<p>Scroll me...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p>
<a class="whatsapp" href="#">💬</a>`,
    css: `.section-title {
  position: sticky;
  top: 0;
  background: white;
  padding: 8px 0;
}

.card {
  position: relative; /* remove this and watch the badge fly away */
  width: 220px;
  height: 120px;
  margin: 20px;
  padding: 20px;
  background: lightsteelblue;
  border-radius: 10px;
}

.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
}

.whatsapp {
  position: fixed;
  bottom: 16px;
  left: 16px;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  background: #25d366;
  border-radius: 50%;
  text-decoration: none;
  font-size: 22px;
}`,
    quiz: [
      {
        question: "Your absolute badge appears in the corner of the page, not the card. Fix?",
        options: ["Add position: relative to the card", "Add z-index: 999 to the badge", "Use position: fixed"],
        answer: 0,
      },
      {
        question: "Which position keeps an element on screen while the page scrolls?",
        options: ["relative", "absolute", "fixed"],
        answer: 2,
      },
    ],
  },
  {
    id: "part1-practice",
    part: 1,
    section: "Practice",
    title: "Part 1: Mistakes & Exercises",
    body: `
      ${mistakes([
        "Forgetting <code>;</code> at the end of a line, or <code>.</code> before a class name.",
        "Linking the CSS file with a wrong path — check the <strong>Network</strong> tab in DevTools for a 404.",
        "Using <code>absolute</code> without <code>relative</code> on the parent — the element flies to the corner of the page.",
        "Being surprised that <code>width</code> doesn't work on <code>&lt;span&gt;</code> or <code>&lt;a&gt;</code> (they're inline).",
        "Using <code>!important</code> to fix every problem instead of understanding Specificity.",
        "Forgetting <code>box-sizing: border-box</code>.",
      ])}
      <h3>Exercises</h3>
      <ol>
        <li><strong>Product card:</strong> image, name, price and a button. 300px wide, rounded corners, padding. A "Sale" badge in the corner with <code>absolute</code>. The button changes color on hover. <em>(Starter code is in the playground.)</em></li>
        <li><strong>Grades table:</strong> even rows light gray, and the row under the mouse turns yellow.</li>
        <li><strong>Hero section:</strong> full screen height, a <code>cover</code> background image with a dark gradient overlay, and white text.</li>
      </ol>
      <details>
        <summary>Hint for exercise 2</summary>
        ${code(`
tr:nth-child(even) { background: #f2f2f2; }
tr:hover { background: #fff3a0; }`)}
      </details>
    `,
    html: `<div class="card">
  <span class="badge">Sale</span>
  <div class="img"></div>
  <h3>Wireless Headphones</h3>
  <p class="price">1,200 EGP</p>
  <button class="btn">Add to cart</button>
</div>`,
    css: `*, *::before, *::after { box-sizing: border-box; }

body { font-family: system-ui, sans-serif; background: #f4f4f8; }

.card {
  width: 300px;
  /* TODO: padding, background white, rounded corners, shadow */
  /* TODO: make it the reference for the badge */
}

.img {
  height: 160px;
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
  border-radius: 8px;
}

.badge {
  /* TODO: put me in the top-right corner of the card */
  background: crimson;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
}

.price { color: teal; font-weight: bold; }

.btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: teal;
  color: white;
  cursor: pointer;
}

/* TODO: change the button color on hover */`,
    quiz: [
      {
        question: "A style isn't applying. What's the right fix?",
        options: ["Add !important everywhere", "Check DevTools for crossed-out rules and write a more specific selector", "Move everything to inline styles"],
        answer: 1,
      },
    ],
  },

  // ================= PART 2 =================
  {
    id: "flexbox-basics",
    part: 2,
    section: "2.11",
    title: "Flexbox: The Container",
    body: `
      <p><strong>The problem:</strong> before Flexbox, placing 3 cards side by side with equal gaps, or centering something vertically, was very hard. Flexbox does it in two lines.</p>
      <p>Put <code>display: flex</code> on the <strong>parent</strong> (Flex Container) and its direct children (Flex Items) line up next to each other automatically.</p>
      <h3>The two axes — the most important idea</h3>
      <ul>
        <li><strong>Main axis</strong> — the direction the items line up in. In <code>row</code> it's horizontal.</li>
        <li><strong>Cross axis</strong> — the other direction. In <code>row</code> it's vertical.</li>
      </ul>
      <p>If you change to <code>flex-direction: column</code>, the two axes <strong>swap</strong>.</p>
      ${code(`
.container {
  display: flex;
  flex-direction: row;       /* row | row-reverse | column | column-reverse */
  flex-wrap: wrap;           /* nowrap (default) | wrap */
  justify-content: center;   /* on the main axis */
  align-items: center;       /* on the cross axis */
  gap: 20px;                 /* space between items */
  align-content: space-between; /* only with several lines (wrap) */
}`)}
      <h3>justify-content (main axis)</h3>
      ${table(["Value", "Result"], [
        ["<code>flex-start</code>", "All at the start"],
        ["<code>flex-end</code>", "All at the end"],
        ["<code>center</code>", "All in the middle"],
        ["<code>space-between</code>", "First at the start, last at the end, the rest spread out"],
        ["<code>space-around</code>", "Each item has equal space around it (the edges get half)"],
        ["<code>space-evenly</code>", "All gaps exactly equal, including the edges"],
      ])}
      <h3>align-items (cross axis)</h3>
      ${table(["Value", "Result"], [
        ["<code>stretch</code> (default)", "Items stretch to the parent's full height"],
        ["<code>flex-start</code>", "Top"],
        ["<code>flex-end</code>", "Bottom"],
        ["<code>center</code>", "Middle"],
        ["<code>baseline</code>", "Aligned on the text's bottom line"],
      ])}
      ${tip("Great practice: play <strong>Flexbox Froggy</strong> (flexboxfroggy.com) — you learn these properties as a game.")}
    `,
    html: `<div class="container">
  <div class="item">1</div>
  <div class="item tall">2</div>
  <div class="item">3</div>
</div>`,
    css: `.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* try: center, space-evenly */
  align-items: center;            /* try: flex-start, stretch */
  gap: 10px;
  height: 220px;
  padding: 10px;
  background: #eee;
}

.item {
  width: 60px;
  min-height: 60px;
  background: coral;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tall { min-height: 110px; }`,
    quiz: [
      {
        question: "With `flex-direction: column`, which property centers items horizontally?",
        options: ["justify-content", "align-items", "text-align"],
        answer: 1,
        explain: "In column, the main axis is vertical, so the cross axis (align-items) is horizontal.",
      },
      {
        question: "What is the difference between space-between and space-evenly?",
        options: ["space-between leaves no space at the edges; space-evenly makes every gap equal, edges included", "They are the same", "space-evenly only works with wrap"],
        answer: 0,
      },
    ],
  },
  {
    id: "flexbox-items",
    part: 2,
    section: "2.11",
    title: "Flexbox: Items & Real Patterns",
    body: `
      <h3>Item properties</h3>
      ${code(`
.item {
  flex-grow: 1;         /* takes a share of the free space (0 = no) */
  flex-shrink: 1;       /* shrinks if there's not enough space (0 = no) */
  flex-basis: 200px;    /* starting size before sharing */
  flex: 1;              /* shorthand: grow 1, shrink 1, basis 0 */
  align-self: flex-end; /* change align-items for this one item */
  order: -1;            /* change its display order (HTML stays the same) */
}

.sidebar { flex: 1; }  /* takes 1 part */
.content { flex: 3; }  /* takes 3 parts */
/* result: sidebar 25%, content 75% */`)}
      ${table(["On the parent (Container)", "On the child (Item)"], [
        ["<code>display: flex</code>", "<code>flex-grow</code>"],
        ["<code>flex-direction</code>", "<code>flex-shrink</code>"],
        ["<code>flex-wrap</code>", "<code>flex-basis</code>"],
        ["<code>justify-content</code>", "<code>flex</code>"],
        ["<code>align-items</code>", "<code>align-self</code>"],
        ["<code>align-content</code>, <code>gap</code>", "<code>order</code>"],
      ])}
      ${table(["", "align-items", "align-content"], [
        ["Arranges", "Items inside one line", "The lines themselves"],
        ["Works", "Always", "Only with wrap and several lines"],
      ])}
      <h3>Real patterns</h3>
      ${code(`
/* 1. Navbar */
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; }
.links  { display: flex; gap: 24px; list-style: none; }

/* 2. Center anything in the page */
.center { display: flex; justify-content: center; align-items: center; min-height: 100vh; }

/* 3. Cards that wrap to a new line on their own */
.cards { display: flex; flex-wrap: wrap; gap: 20px; }
.card  { flex: 1 1 280px; } /* at least 280px, grows if there's room */

/* 4. Footer stuck to the bottom even with little content */
body { display: flex; flex-direction: column; min-height: 100vh; }
main { flex: 1; }`)}
      ${table(["", "Flexbox", "Grid"], [
        ["Dimensions", "One (a row OR a column)", "Two (rows AND columns)"],
        ["Starts from", "The content", "The layout"],
        ["Good for", "Navbar, buttons, centering, a row of cards", "Whole page layout, photo gallery"],
      ])}
    `,
    html: `<nav class="navbar">
  <a href="#" class="logo">MySite</a>
  <ul class="links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>

<div class="cards">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>`,
    css: `body { margin: 0; font-family: system-ui, sans-serif; }

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #1d1d2b;
}

.navbar a { color: white; text-decoration: none; }
.logo { font-weight: bold; }

.links {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
}

.card {
  flex: 1 1 140px; /* widen the preview and watch them reflow */
  padding: 30px;
  background: mediumseagreen;
  color: white;
  border-radius: 8px;
  text-align: center;
}`,
    quiz: [
      {
        question: "Three items have `flex: 1`, `flex: 2` and `flex: 1`. How much space does each take?",
        options: ["33% each", "25%, 50%, 25%", "20%, 60%, 20%"],
        answer: 1,
        explain: "Total = 4 parts: 1/4, 2/4, 1/4.",
      },
      {
        question: "Which property belongs on the CHILD, not the parent?",
        options: ["justify-content", "flex-wrap", "align-self"],
        answer: 2,
      },
    ],
  },
  {
    id: "shadows-transforms",
    part: 2,
    section: "2.12",
    title: "Shadows & Transforms",
    body: `
      <h3>box-shadow and text-shadow</h3>
      ${code(`
/* box-shadow: x  y  blur  spread  color */
.card  { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.input { box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); } /* shadow inside */
.btn   { box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1); } /* several */

/* text-shadow: x  y  blur  color (no spread or inset) */
h1    { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
.neon { color: #fff; text-shadow: 0 0 10px #0ff, 0 0 20px #0ff; }  /* glow */`)}
      ${table(["Value", "Meaning"], [
        ["x", "Right (positive) or left (negative)"],
        ["y", "Down (positive) or up (negative)"],
        ["blur", "How soft the shadow is"],
        ["spread", "How much bigger than the element"],
        ["color", "Use rgba so it looks natural"],
      ])}
      ${table(["", "box-shadow", "text-shadow"], [
        ["Applies to", "The whole box", "The letters"],
        ["spread", "Yes", "No"],
        ["inset", "Yes", "No"],
      ])}
      <h3>2D transforms</h3>
      ${code(`
.a { transform: translate(50px, 20px); } /* move */
.b { transform: translateX(-50%); }
.c { transform: rotate(45deg); }         /* rotate */
.d { transform: scale(1.2); }            /* grow to 120% */
.e { transform: skew(10deg, 5deg); }     /* slant */
.f { transform: translateY(-10px) scale(1.05); } /* several: spaces, not commas */
.g { transform-origin: top left; }       /* the pivot point */`)}
      <h3>3D transforms</h3>
      ${code(`
.scene  { perspective: 1000px; }         /* on the parent: distance from the eye */
.card3d { transform: rotateY(180deg); }  /* flip around the vertical axis */
.box    { transform: rotateX(45deg); }
.box    { transform: translateZ(100px); }
.box    { backface-visibility: hidden; } /* hide the back when flipped */`)}
      <h3>Classic centering</h3>
      ${code(`
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`)}
      ${table(["", "transform: translate", "position (top/left)"], [
        ["Affects other elements", "No", "Maybe"],
        ["Animation performance", "Excellent (GPU)", "Slower"],
        ["% is relative to", "The element itself", "The parent"],
      ])}
    `,
    html: `<div class="row">
  <div class="tile t1">translate</div>
  <div class="tile t2">rotate</div>
  <div class="tile t3">scale</div>
  <div class="tile t4">skew</div>
</div>
<h1 class="neon">NEON</h1>
<div class="scene"><div class="flip">3D</div></div>`,
    css: `body { background: #1d1d2b; color: white; font-family: system-ui; }

.row { display: flex; gap: 16px; padding: 20px; }

.tile {
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  font-size: 12px;
  background: coral;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.t1 { transform: translateY(-10px); }
.t2 { transform: rotate(15deg); }
.t3 { transform: scale(1.15); }
.t4 { transform: skew(10deg, 5deg); }

.neon {
  text-align: center;
  text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
}

.scene { perspective: 600px; display: flex; justify-content: center; }
.flip {
  width: 100px;
  height: 100px;
  display: grid;
  place-items: center;
  background: teal;
  transform: rotateY(40deg);
}`,
    quiz: [
      {
        question: "How do you combine translate and scale in one element?",
        options: ["transform: translateY(-10px), scale(1.05);", "transform: translateY(-10px) scale(1.05);", "Two separate transform lines"],
        answer: 1,
        explain: "Separate with spaces. Two separate transform lines would overwrite each other.",
      },
      {
        question: "Which shadow property can't be used with text-shadow?",
        options: ["blur", "color", "spread"],
        answer: 2,
      },
    ],
  },
  {
    id: "transitions-animations",
    part: 2,
    section: "2.12",
    title: "Transitions & Animations",
    body: `
      <h3>Transitions</h3>
      <p>Instead of a change (like hover) happening instantly, it happens gradually.</p>
      ${code(`
.btn {
  background: blue;
  transition: background 0.3s ease, transform 0.3s ease;
  /* transition: property  duration  timing-function  delay */
}

.btn:hover {
  background: darkblue;
  transform: translateY(-3px);
}

/* every property */
.card { transition: all 0.3s ease-in-out; }`)}
      ${table(["timing-function", "Speed"], [
        ["<code>linear</code>", "Constant from start to end"],
        ["<code>ease</code> (default)", "Starts slow, speeds up, slows at the end"],
        ["<code>ease-in</code>", "Starts slow"],
        ["<code>ease-out</code>", "Ends slow (feels the most natural)"],
        ["<code>ease-in-out</code>", "Slow at both ends"],
        ["<code>cubic-bezier()</code>", "Your own curve"],
      ])}
      ${tip("Not every property can transition. Colors, numbers like <code>width</code>, <code>opacity</code> and <code>transform</code> can. <code>display</code> can't.")}
      <h3>Animations</h3>
      <p>Motion that runs on its own, without hover, and can have many steps.</p>
      ${code(`
/* 1. Define the motion */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 2. Apply it */
.hero-title { animation: fadeInUp 1s ease-out forwards; }
.cta        { animation: pulse 2s infinite; }`)}
      ${table(["Property", "Job"], [
        ["<code>animation-name</code>", "The keyframes name"],
        ["<code>animation-duration</code>", "How long"],
        ["<code>animation-timing-function</code>", "Speed curve (like transition)"],
        ["<code>animation-delay</code>", "Wait before starting"],
        ["<code>animation-iteration-count</code>", "Number of times, or <code>infinite</code>"],
        ["<code>animation-direction</code>", "<code>normal</code> / <code>reverse</code> / <code>alternate</code> (back and forth)"],
        ["<code>animation-fill-mode</code>", "<code>forwards</code>: keep the last frame when done"],
        ["<code>animation-play-state</code>", "<code>running</code> / <code>paused</code>"],
      ])}
      ${table(["", "Transition", "Animation"], [
        ["Starts", "Needs a trigger (hover, a class changes)", "On its own when the page loads"],
        ["Steps", "Two states only (from / to)", "Many (0% to 100%)"],
        ["Repeats", "No", "Yes (<code>infinite</code>)"],
        ["Needs keyframes", "No", "Yes"],
        ["Use", "Hover on a button or card", "Loader, pulse, entrance motion"],
      ])}
    `,
    html: `<h2 class="title">I slide in from the left</h2>
<div class="card">Hover me</div>
<button class="cta">Book now</button>
<div class="loader"></div>`,
    css: `body { font-family: system-ui; padding: 10px; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-50px); }
  to   { opacity: 1; transform: translateX(0); }
}
.title { animation: slideIn 1s ease-out; }

/* transition goes on the element, NOT on :hover */
.card {
  width: 200px;
  padding: 30px;
  margin: 20px 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.cta {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: darkorange;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
.loader {
  width: 40px;
  height: 40px;
  margin-top: 20px;
  border: 4px solid #ddd;
  border-top-color: blue;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}`,
    quiz: [
      {
        question: "You want a spinning loader that never stops. Transition or animation?",
        options: ["Transition", "Animation"],
        answer: 1,
      },
      {
        question: "The hover effect animates in but snaps back instantly on mouse out. Why?",
        options: ["transition was put on :hover instead of the element", "You need ease-in-out", "Hover can't animate back"],
        answer: 0,
      },
    ],
  },
  {
    id: "responsive",
    part: 2,
    section: "2.13",
    title: "Responsive Design",
    body: `
      <p>One site that looks good on mobile, tablet and desktop — without building 3 sites. It has 3 pillars:</p>
      <ol>
        <li><strong>Viewport meta tag</strong> in the head — without it nothing is responsive:
          ${code(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)}</li>
        <li><strong>Fluid layouts:</strong> relative units (<code>%</code>, <code>rem</code>, <code>vw</code>) and <code>max-width</code> instead of fixed <code>px</code> widths.</li>
        <li><strong>Media queries:</strong> CSS rules that only apply at certain sizes.</li>
      </ol>
      ${code(`
@media (min-width: 768px) { }  /* 768px or wider */
@media (max-width: 768px) { }  /* 768px or narrower */
@media (min-width: 768px) and (max-width: 1024px) { } /* between */
@media (orientation: landscape) { }  /* phone held sideways */
@media print { nav { display: none; } }  /* when printing */`)}
      ${table(["Device", "Width"], [
        ["Mobile", "Less than 576px"],
        ["Large mobile", "576px"],
        ["Tablet", "768px"],
        ["Laptop", "992px"],
        ["Large screen", "1200px"],
      ])}
      ${tip("Don't set breakpoints for specific devices. Shrink the browser, and where the design breaks — put a breakpoint there.")}
      <h3>Mobile-first vs Desktop-first</h3>
      ${code(`
/* Mobile-first: base code is for mobile, then add for bigger screens */
.cards { flex-direction: column; }
@media (min-width: 768px) {
  .cards { flex-direction: row; }
}

/* Desktop-first: base code is for desktop, then adjust for smaller */
.cards { flex-direction: row; }
@media (max-width: 767px) {
  .cards { flex-direction: column; }
}`)}
      ${table(["", "Mobile-first", "Desktop-first"], [
        ["Start with", "Mobile", "Desktop"],
        ["Query type", "<code>min-width</code>", "<code>max-width</code>"],
        ["Idea", "Add complexity for big screens", "Remove things for small screens"],
        ["Mobile performance", "Better", "Worse"],
        ["Preferred today", "Yes — Google ranks the mobile version first, and Bootstrap uses it", "Old projects"],
      ])}
      <h3>Responsive images and text</h3>
      ${code(`
img {
  max-width: 100%;  /* never wider than its parent */
  height: auto;     /* keep the ratio */
  display: block;
}

/* Fill a fixed area without stretching */
.thumb { width: 100%; height: 200px; object-fit: cover; }

/* Font that grows with the screen, with a min and max */
h1 { font-size: clamp(1.75rem, 5vw, 3.5rem); }
/* clamp(smallest, preferred, largest) */`)}
      ${table(["", "width: 100%", "max-width: 100%"], [
        ["Small image (200px) in a big parent", "Stretches and looks bad", "Stays 200px"],
        ["Big image in a small parent", "Shrinks", "Shrinks"],
      ])}
      ${tip("Test it: DevTools → the phone icon (Toggle Device Toolbar) or <code>Ctrl + Shift + M</code>. In this playground, click <strong>⤢ Wide preview</strong> and resize your browser.")}
    `,
    html: `<nav class="navbar">
  <a href="#" class="logo">Nile Café</a>
  <ul class="links">
    <li><a href="#">Home</a></li>
    <li><a href="#">Menu</a></li>
    <li><a href="#">Book</a></li>
  </ul>
</nav>
<h1>Coffee on the Nile</h1>
<div class="cards">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>`,
    css: `/* Mobile-first */
body { margin: 0; font-family: system-ui; }

.navbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #0e6e6e;
}
.navbar a { color: white; text-decoration: none; }
.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

h1 {
  text-align: center;
  font-size: clamp(1.75rem, 5vw, 3.5rem);
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
.cards div {
  flex: 1;
  padding: 30px;
  background: #e0a458;
  text-align: center;
}

/* Tablet and up — click "Wide preview" to see it */
@media (min-width: 768px) {
  .navbar { flex-direction: row; justify-content: space-between; }
  .links { flex-direction: row; gap: 24px; }
  .cards { flex-direction: row; }
}`,
    quiz: [
      {
        question: "Why does Mobile-first use min-width?",
        options: ["Because the base code is for mobile, and we add rules as the screen gets bigger", "Because min-width is faster", "Because max-width doesn't work on phones"],
        answer: 0,
      },
      {
        question: "Your media queries work in DevTools but not on a real phone. Most likely cause?",
        options: ["Missing the viewport meta tag", "Using rem", "Using Flexbox"],
        answer: 0,
      },
    ],
  },
  {
    id: "bootstrap",
    part: 2,
    section: "2.14",
    title: "Bootstrap",
    head: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>`,
    body: `
      <p>A ready-made framework with CSS (and a little JS) already written. Instead of writing CSS, you use ready <strong>classes</strong>.</p>
      <ul>
        <li><strong>Speed:</strong> a whole page in very little time.</li>
        <li><strong>Responsive</strong> and Mobile-first out of the box.</li>
        <li><strong>Ready components:</strong> Navbar, Cards, Modals, Carousel.</li>
        <li><strong>Consistent</strong> look on every browser.</li>
      </ul>
      ${code(`
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  ...
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>`)}
      ${tip("For Arabic there's an RTL version: <code>bootstrap.rtl.min.css</code>, with <code>&lt;html dir=\"rtl\"&gt;</code>.")}
      ${table(["", "Plain CSS", "Bootstrap"], [
        ["Speed", "Slower", "Much faster"],
        ["Control", "Full", "Limited to the classes (you can override)"],
        ["Size", "Small", "Big file even if you use a little"],
        ["Look", "Unique", "Sites look alike"],
        ["Needs CSS knowledge", "Yes", "Yes, to customise it"],
        ["Good for", "Custom designs", "Fast work, dashboards, prototypes"],
      ])}
      <h3>Grid system</h3>
      <p>The rule: <code>container</code> → <code>row</code> → <code>col</code>. Each row is split into <strong>12 columns</strong>.</p>
      ${code(`
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">Card 1</div>
    <div class="col-12 col-md-6 col-lg-4">Card 2</div>
    <div class="col-12 col-md-6 col-lg-4">Card 3</div>
  </div>
</div>`)}
      <p>Read <code>col-md-6</code> as: "from size <code>md</code> and up, take 6 of 12 (half)". So: mobile <code>col-12</code> = full width each, tablet <code>col-md-6</code> = two per row, laptop <code>col-lg-4</code> = three per row.</p>
      ${table(["Name", "From width"], [
        ["xs (no name)", "0"], ["sm", "576px"], ["md", "768px"], ["lg", "992px"], ["xl", "1200px"], ["xxl", "1400px"],
      ])}
      ${code(`
<div class="col">...</div>                    <!-- share the space equally -->
<div class="col-auto">...</div>               <!-- as wide as the content -->
<div class="col-md-4 offset-md-4">...</div>   <!-- skip 4 columns (centering) -->
<div class="row g-4">...</div>                <!-- gutter: space between columns -->`)}
      ${table(["", "container", "container-fluid"], [
        ["Width", "Fixed per size, centered", "Always 100% of the screen"],
        ["Use", "Normal content", "Full-width banner or hero"],
      ])}
      <h3>Components</h3>
      ${code(`
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline-danger btn-lg">Delete</button>
<a href="#" class="btn btn-success btn-sm">A link that looks like a button</a>
<!-- colors: primary, secondary, success, danger, warning, info, light, dark -->

<div class="card" style="width: 18rem;">
  <img src="product.jpg" class="card-img-top" alt="Product">
  <div class="card-body">
    <h5 class="card-title">Product name</h5>
    <p class="card-text">Short description.</p>
    <a href="#" class="btn btn-primary">Buy</a>
  </div>
</div>`)}
      <p>The <strong>Navbar</strong> collapses on mobile by itself. <code>navbar-expand-lg</code> means: open from <code>lg</code> and up, and a ☰ button below that. <code>data-bs-toggle</code> and <code>data-bs-target</code> need the Bootstrap JS file.</p>
      ${tip("Teach yourself to use the docs at <strong>getbootstrap.com</strong> — copying and editing from the docs is real-world work.")}
      <h3>Utilities</h3>
      <p>Small classes that each do one thing. Spacing is <code>{property}{side}-{size}</code>:</p>
      ${table(["Part", "Values"], [
        ["property", "<code>m</code> = margin, <code>p</code> = padding"],
        ["side", "<code>t</code> top, <code>b</code> bottom, <code>s</code> start, <code>e</code> end, <code>x</code> left & right, <code>y</code> top & bottom, empty = all"],
        ["size", "<code>0</code> to <code>5</code>, or <code>auto</code>"],
      ])}
      <p>Examples: <code>mt-3</code>, <code>px-4</code>, <code>mb-0</code>, <code>mx-auto</code>, <code>py-5</code>. (<code>s</code>/<code>e</code> are used instead of left/right so they work in both Arabic and English.)</p>
      ${table(["Category", "Examples"], [
        ["Display", "<code>d-none</code>, <code>d-flex</code>, <code>d-md-block</code>"],
        ["Flex", "<code>justify-content-between</code>, <code>align-items-center</code>, <code>flex-column</code>, <code>gap-3</code>"],
        ["Colors", "<code>text-primary</code>, <code>bg-light</code>, <code>text-white</code>"],
        ["Border", "<code>border</code>, <code>rounded</code>, <code>rounded-circle</code>, <code>shadow</code>"],
        ["Sizing", "<code>w-50</code>, <code>w-100</code>, <code>h-100</code>"],
        ["Position", "<code>position-relative</code>, <code>position-absolute</code>, <code>top-0</code>, <code>end-0</code>"],
      ])}
      ${code(`
<div class="d-none d-md-block">Shows from tablet and up only</div>
<div class="d-block d-md-none">Shows on mobile only</div>`)}
      ${tip("To override Bootstrap's look, link <strong>your</strong> CSS file <em>after</em> Bootstrap so it wins in the Cascade.")}
    `,
    html: `<nav class="navbar navbar-expand-md bg-dark navbar-dark">
  <div class="container">
    <a class="navbar-brand" href="#">MySite</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="menu">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Services</a></li>
      </ul>
    </div>
  </div>
</nav>

<div class="container py-4">
  <div class="row g-3">
    <div class="col-12 col-md-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Card 1</h5>
          <p class="card-text">col-12 col-md-6</p>
          <a href="#" class="btn btn-primary">Buy</a>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Card 2</h5>
          <p class="card-text">Widen the preview to see 2 per row.</p>
          <a href="#" class="btn btn-outline-danger">Delete</a>
        </div>
      </div>
    </div>
  </div>
  <p class="d-none d-md-block mt-3 text-success">Visible from tablet (md) and up</p>
  <p class="d-block d-md-none mt-3 text-danger">Visible on mobile only</p>
</div>`,
    css: `/* Your own CSS comes after Bootstrap, so it can override it */
.card-title {
  color: teal;
}`,
    quiz: [
      {
        question: "An element has `col-sm-12 col-md-6 col-xl-3`. How wide is it on a tablet (768px)?",
        options: ["Full width", "Half the row", "A quarter of the row"],
        answer: 1,
        explain: "Mobile: full. Tablet (md): half. 992–1199px: still half. From xl (1200px): a quarter.",
      },
      {
        question: "The navbar ☰ button does nothing when clicked. What did you forget?",
        options: ["The Bootstrap JS file", "The container class", "The viewport meta tag"],
        answer: 0,
      },
      {
        question: "What does `mx-auto` do?",
        options: ["margin auto on left & right (centers it)", "max-width auto", "padding on x axis"],
        answer: 0,
      },
    ],
  },
  {
    id: "part2-practice",
    part: 2,
    section: "Practice",
    title: "Part 2: Mistakes & Project",
    body: `
      ${mistakes([
        "Putting <code>justify-content</code> on the child instead of the parent.",
        "Being surprised <code>align-items: center</code> doesn't work — the parent has no height.",
        "Forgetting the viewport meta tag, so media queries don't work on mobile.",
        "Writing media queries at the <em>top</em> of the file — the normal rules after them override them. Put them at the end.",
        "Bootstrap: a <code>col</code> without a <code>row</code> around it, or columns adding up to more than 12.",
        "Forgetting the Bootstrap JS file, so the Navbar and Modal don't open.",
        "Putting <code>transition</code> on <code>:hover</code> instead of the element — the motion only works going in, not coming out.",
      ])}
      <h3>Project</h3>
      <ol>
        <li><strong>Restaurant landing page with Bootstrap:</strong> a responsive Navbar, a Hero with a background image, a "Food menu" section with 6 cards (1 per row on mobile, 2 on tablet, 3 on laptop), a contact section with a form, and a footer.</li>
        <li><strong>The same menu section without Bootstrap</strong>, using Flexbox and media queries. Compare the time and the amount of code. <em>(Starter code is in the playground — click ⤢ Wide preview.)</em></li>
      </ol>
    `,
    html: `<section class="menu">
  <h2>Food menu</h2>
  <div class="menu-grid">
    <article class="menu-card"><h3>Turkish coffee</h3><p class="price">35 EGP</p></article>
    <article class="menu-card"><h3>Aswani karkadeh</h3><p class="price">25 EGP</p></article>
    <article class="menu-card"><h3>Feteer meshaltet</h3><p class="price">90 EGP</p></article>
    <article class="menu-card"><h3>Ful & ta'meya</h3><p class="price">50 EGP</p></article>
    <article class="menu-card"><h3>Mango juice</h3><p class="price">40 EGP</p></article>
    <article class="menu-card"><h3>Om Ali</h3><p class="price">60 EGP</p></article>
  </div>
</section>`,
    css: `:root {
  --primary: #0e6e6e;
  --light: #faf7f2;
  --radius: 12px;
}

body { margin: 0; font-family: system-ui; background: var(--light); }
.menu { padding: 24px; }

/* Mobile-first: 1 per row */
.menu-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.menu-card {
  flex: 1 1 100%;
  background: white;
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.price { color: var(--primary); font-weight: 700; }

/* TODO: 2 per row from 576px, 3 per row from 768px
   Hint: flex-basis like calc(50% - 10px) */`,
    quiz: [
      {
        question: "Your media query rules are being ignored. You wrote them at the top of the file. Why?",
        options: ["Normal rules written after them win, because they have the same specificity", "Media queries must be in a separate file", "Media queries only work with Bootstrap"],
        answer: 0,
      },
    ],
  },
];
