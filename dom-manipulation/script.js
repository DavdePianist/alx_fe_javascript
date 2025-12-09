// Load local quotes
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

// Show random quote
function showRandomQuote() {
  const rand = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[rand];
  quoteDisplay.innerHTML = `<p>"${text}"</p><span style="font-style: italic;">Category: ${category}</span>`;
}

// Populate categories
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

// Filter quotes
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  quoteDisplay.innerHTML = "";
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Both fields are required.");
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ---------------------------------------------
// SERVER SYNC (GET + POST)
// ---------------------------------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch server quotes
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();
  return data.slice(0, 5).map(item => ({ text: item.title, category: "Server" }));
}

// POST local quotes to server
async function syncToServer() {
  try {
    await fetch(SERVER_URL, {
      method: "POST",                          // Required
      headers: { "Content-Type": "application/json" },  // Required
      body: JSON.stringify(quotes)             // Send local quotes
    });
    alert("Local quotes synced to server!");
  } catch (err) {
    console.error("POST failed:", err);
    alert("Failed to sync to server.");
  }
}

// Sync logic (GET + conflict resolution)
async function syncWithServer() {
  syncStatus.style.display = "block";
  syncStatus.textContent = "Syncing with server…";
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const localJSON = JSON.stringify(quotes);
    const serverJSON = JSON.stringify(serverQuotes);
    if (localJSON !== serverJSON) {
      if (confirm("Server data differs. Use server version?")) {
        quotes = serverQuotes;
        saveQuotes();
        populateCategories();
        filterQuotes();
      }
    }
    syncStatus.textContent = "Sync complete!";
    setTimeout(() => (syncStatus.style.display = "none"), 2000);
  } catch (err) {
    syncStatus.textContent = "Sync failed!";
    console.error(err);
  }
}

// Auto-sync every 20s
setInterval(syncWithServer, 20000);
syncNow.addEventListener("click", syncWithServer);

// Manual POST sync button (optional)
document.getElementById("syncToServerBtn")?.addEventListener("click", syncToServer);

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
});
newQuoteBtn.addEventListener("click", showRandomQuote);
