// ----------------------------------------------------
// STEP 1: Load quotes from Local Storage
// ----------------------------------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
  { text: "Believe you can and you're halfway there.", category: "Confidence" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");
const syncStatus = document.getElementById("syncStatus");
const syncNow = document.getElementById("syncNow");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----------------------------------------------------
// STEP 2: Show Random Quote (Math.random)
// ----------------------------------------------------
function showRandomQuote() {
  const rand = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[rand];

  quoteDisplay.innerHTML = `
    <p>"${text}"</p>
    <span style="font-style: italic;">Category: ${category}</span>
  `;
}

// ----------------------------------------------------
// Populate Categories
// ----------------------------------------------------
function populateCategories() {
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) categoryFilter.value = saved;
}

// ----------------------------------------------------
// Filter Quotes
// ----------------------------------------------------
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  quoteDisplay.innerHTML = "";

  const filtered =
    selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ----------------------------------------------------
// Add Quote
// ----------------------------------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text, category });

  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// =====================================================================
// 🔥 STEP 4 — SERVER SYNC + CONFLICT RESOLUTION
// =====================================================================

// Mock server endpoint (JSONPlaceholder)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ----------------------------------------------------
// REQUIRED FUNCTION: fetchQuotesFromServer()
// ----------------------------------------------------
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  // Convert fake server posts to "quotes"
  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// ----------------------------------------------------
// Conflict Resolution: SERVER WINS by default
// ----------------------------------------------------
function resolveConflict(serverQuotes) {
  const localJSON = JSON.stringify(quotes);
  const serverJSON = JSON.stringify(serverQuotes);

  if (localJSON === serverJSON) return; // No conflict

  if (confirm("Server data differs from your local data.\nUse server version?")) {
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Local data replaced with server version.");
  } else {
    alert("Local version kept.");
  }
}

// ----------------------------------------------------
// Sync With Server
// ----------------------------------------------------
async function syncWithServer() {
  syncStatus.style.display = "block";
  syncStatus.textContent = "Syncing with server…";

  try {
    const serverQuotes = await fetchQuotesFromServer(); // REQUIRED NAME

    resolveConflict(serverQuotes);

    syncStatus.textContent = "Sync complete!";
    setTimeout(() => (syncStatus.style.display = "none"), 2000);

  } catch (err) {
    syncStatus.textContent = "Sync failed!";
    console.error(err);
  }
}

// Auto-sync every 20 seconds
setInterval(syncWithServer, 20000);

// Manual sync
syncNow.addEventListener("click", syncWithServer);

// ----------------------------------------------------
// INITIALIZE APP
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
});

newQuoteBtn.addEventListener("click", showRandomQuote);
