// -----------------------------------------------------
// STEP 1: Load quotes from localStorage or use defaults
// -----------------------------------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
  { text: "Believe you can and you're halfway there.", category: "Confidence" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes to storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -----------------------------------------------------
// STEP 2A: Populate Categories Dynamically
// -----------------------------------------------------
function populateCategories() {
  // Clear existing options
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Extract unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Add each category to the dropdown
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore previously selected category
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// -----------------------------------------------------
// STEP 2B: Filter Quotes Based on Selected Category
// -----------------------------------------------------
function filterQuotes() {
  const selected = categoryFilter.value;

  // Save selected category to local storage
  localStorage.setItem("selectedCategory", selected);

  // Clear display
  quoteDisplay.innerHTML = "";

  // Choose quotes to display
  const filteredQuotes =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
    return;
  }

  // Display filtered quotes
  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// -----------------------------------------------------
// STEP 3: Update Categories in Real-time When Adding Quotes
// -----------------------------------------------------
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add to quotes array
  quotes.push({ text, category });

  // Save to storage
  saveQuotes();

  // Update dropdown categories immediately
  populateCategories();

  // Refresh displayed quotes based on the current filter
  filterQuotes();

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// -----------------------------------------------------
// INIT PAGE
// -----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  populateCategories(); // Load unique categories
  filterQuotes();       // Apply saved filter on load
});
