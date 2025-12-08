let expenses = [];
let expenseChart;

// Run once DOM + Chart.js are ready
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expense-form");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const categorySelect = document.getElementById("category");
  const tableBody = document.getElementById("expense-table-body");

  const totalAmountEl = document.getElementById("total-amount");
  const expenseCountEl = document.getElementById("expense-count");

  // Handle form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    if (!description || isNaN(amount) || amount <= 0 || !category) {
      alert("Please enter a description, a positive amount, and a category.");
      return;
    }

    const newExpense = {
      description,
      amount,
      category,
    };

    expenses.push(newExpense);
    renderTable();
    updateSummary();
    updateChart();

    form.reset();
  });

  // Use event delegation for delete buttons
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      expenses.splice(index, 1);
      renderTable();
      updateSummary();
      updateChart();
    }
  });

  function renderTable() {
    tableBody.innerHTML = "";

    expenses.forEach((expense, index) => {
      const tr = document.createElement("tr");

      const descTd = document.createElement("td");
      descTd.textContent = expense.description;

      const categoryTd = document.createElement("td");
      categoryTd.textContent = expense.category;

      const amountTd = document.createElement("td");
      amountTd.textContent = `$${expense.amount.toFixed(2)}`;
      amountTd.classList.add("amount-cell");

      const actionTd = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.setAttribute("data-index", index);
      actionTd.appendChild(deleteBtn);

      tr.appendChild(descTd);
      tr.appendChild(categoryTd);
      tr.appendChild(amountTd);
      tr.appendChild(actionTd);

      tableBody.appendChild(tr);
    });
  }

  function updateSummary() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalAmountEl.textContent = `$${total.toFixed(2)}`;
    expenseCountEl.textContent = expenses.length;
  }

  function getCategoryTotals() {
    const totals = {};

    expenses.forEach((exp) => {
      if (!totals[exp.category]) {
        totals[exp.category] = 0;
      }
      totals[exp.category] += exp.amount;
    });

    return totals;
  }

  function updateChart() {
    const totals = getCategoryTotals();
    const labels = Object.keys(totals);
    const data = Object.values(totals);

    const ctx = document.getElementById("expense-chart").getContext("2d");

    // If chart already exists, just update data
    if (expenseChart) {
      expenseChart.data.labels = labels;
      expenseChart.data.datasets[0].data = data;
      expenseChart.update();
      return;
    }

    // Create chart first time
    expenseChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Spending by Category",
            data,
            // Chart.js will auto-assign colors if not specified in newer versions,
            // but here we provide some basic ones.
            backgroundColor: [
              "rgba(79, 70, 229, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(249, 115, 22, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(156, 163, 175, 0.8)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  // Initialize empty chart so layout looks nice even with no data
  updateChart();
});
