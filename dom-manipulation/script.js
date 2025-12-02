// STEP 2: Advanced DOM Manipulation

// Array of quote objects
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
  { text: "Believe you can and you're halfway there.", category: "Confidence" }
];

// Select elements from DOM
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];

  // Clear the display area
  quoteDisplay.innerHTML = "";

  // Create elements
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${text}"`;

  const quoteCategory = document.createElement("span");
  quoteCategory.textContent = `— Category: ${category}`;
  quoteCategory.style.display = "block";
  quoteCategory.style.fontStyle = "italic";

  // Append to the display
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to create a form that allows adding new quotes dynamically
function createAddQuoteForm() {
  // Prevent duplicate forms
  if (document.getElementById("addQuoteForm")) return;

  const form = document.createElement("form");
  form.id = "addQuoteForm";

  // Quote text field
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter quote text";
  textInput.required = true;

  // Category field
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;

  // Submit button
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Add Quote";
  submitBtn.type = "submit";

  // Append elements to form
  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  // Add form to the body
  document.body.appendChild(form);

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const quoteText = textInput.value.trim();
    const quoteCategory = categoryInput.value.trim();

    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });

      alert("New quote added!");
      form.reset();
    }
  });
}

// Event listener for random quote button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Automatically create the Add Quote form on page load
createAddQuoteForm();
