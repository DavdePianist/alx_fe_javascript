// Load quotes from local storage OR use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
  { text: "Believe you can and you're halfway there.", category: "Confidence" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteForm = document.getElementById("addQuoteForm");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const quotesList = document.getElementById("quotesList");
const resetFilters = document.getElementById("resetFilters");


// Save to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----------------------------
// RANDOM QUOTE
// ----------------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${text}"</p>
    <span style="font-style:italic;">— Category: ${category}</span>
  `;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify({ text, category }));
}

newQuoteBtn.addEventListener("click", showRandomQuote);

// Load last viewed quote
document.addEventListener("DOMContentLoaded", () => {
  const last = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
  if (last) {
    quoteDisplay.innerHTML = `
      <p>"${last.text}"</p>
      <span style="font-style: italic;">— Category: ${last.category}</span>
    `;
  }

  updateCategoryFilter();
  renderQuotesList();
});


// ----------------------------
// ADD NEW QUOTE
// ----------------------------
addQuoteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) return;

  quotes.push({ text, category });
  saveQuotesToLocalStorage();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  updateCategoryFilter();
  renderQuotesList();

  alert("New quote added!");
});


// ----------------------------
// IMPORT & EXPORT JSON
// ----------------------------
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("exportQuotes").addEventListener("click", exportQuotes);


function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format: expected an array.");
        return;
      }

      importedQuotes.forEach(q => {
        if (q.text && q.category) {
          quotes.push(q);
        }
      });

      saveQuotesToLocalStorage();
      updateCategoryFilter();
      renderQuotesList();

      alert("Quotes imported successfully!");

    } catch (err) {
      alert("Error reading JSON file.");
    }
  };

  reader.readAsText(file);
}

document.getElementById("importQuotes").addEventListener("change", importQuotes);


// ----------------------------
// SEARCH & FILTER
// ----------------------------
function updateCategoryFilter() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}


function renderQuotesList() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  quotesList.innerHTML = "";

  quotes
    .filter(q =>
      (selectedCategory === "all" || q.category === selectedCategory) &&
      q.text.toLowerCase().includes(searchText)
    )
    .forEach(q => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${q.text}</strong> <br> <em>${q.category}</em>`;
      quotesList.appendChild(li);
    });
}

searchInput.addEventListener("input", renderQuotesList);
categoryFilter.addEventListener("change", renderQuotesList);
resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  renderQuotesList();
});
