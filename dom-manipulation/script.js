// ---------------------------------------------
// STEP 1: Load quotes from Local Storage
// ---------------------------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
  { text: "Believe you can and you're halfway there.", category: "Confidence" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");

// Save quotes back to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---------------------------------------------
// STEP 2A: Show a Random Quote (Math.random)
// ---------------------------------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);  // REQUIRED
  const { text, category } = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${text}"</p>
    <span style="font-style: italic;">Category: ${category}</span>
  `;
}

// ---------------------------------------------
// STEP 2B: Populate Category Dropdown
// ---------------------------------------------
function populateCategories() {
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

// ---------------------------------------------
// STEP 2C: Filter Quotes by Category
// ---------------------------------------------
function filterQuotes() {
  const selected = categoryFilter.value;

  localStorage.setItem("selectedCategory", selected);

  quoteDisplay.innerHTML = "";

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
    return;
  }

  // Display all matching quotes
  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ---------------------------------------------
// STEP 3: Add New Quote
// Updates Category + LocalStorage + UI
// ---------------------------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });

  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// ---------------------------------------------
// INITIALIZE APPLICATION
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
});

newQuoteBtn.addEventListener("click", showRandomQuote);
