let expenses = [];
let expenseChart;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expense-form");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const categorySelect = document.getElementById("category");
  const tableBody = document.getElementById("expense-table-body");
  const totalAmountEl = document.getElementById("total-amount");
  const expenseCountEl = document.getElementById("expense-count");
  const downloadPdfBtn = document.getElementById("download-pdf");

  // Theme buttons
  const themeButtons = document.querySelectorAll("[data-theme]");

  // Add expense
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

  // Delete expense
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      expenses.splice(index, 1);
      renderTable();
      updateSummary();
      updateChart();
    }
  });

  // Download PDF button
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => {
      generatePdfReport();
    });
  }

  // Theme buttons
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const themeName = btn.dataset.theme;
      applyTheme(themeName);
    });
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

  // PDF generation
  function generatePdfReport() {
    if (!window.jspdf) {
      alert("jsPDF failed to load.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Expense Report", 10, 10);

    // Summary
    let y = 20;
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    doc.setFontSize(12);
    doc.text(`Total spent: $${total.toFixed(2)}`, 10, y);
    y += 7;
    doc.text(`Number of expenses: ${expenses.length}`, 10, y);
    y += 12;

    // Table header
    doc.setFont(undefined, "bold");
    doc.text("Description", 10, y);
    doc.text("Category", 80, y);
    doc.text("Amount", 140, y);
    doc.setFont(undefined, "normal");
    y += 6;

    // Expenses list
    expenses.forEach((exp) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(exp.description.substring(0, 25), 10, y);
      doc.text(exp.category, 80, y);
      doc.text(`$${exp.amount.toFixed(2)}`, 140, y);
      y += 6;
    });

    // Add chart on a new page
    const canvas = document.getElementById("expense-chart");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png", 1.0);
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Spending by Category", 10, 10);
      // x, y, width, height
      doc.addImage(imgData, "PNG", 15, 20, 180, 120);
    }

    doc.save("expense_report.pdf");
  }

  // Simple theme system
  function applyTheme(themeName) {
    const themes = {
      purple: {
        bodyBg: "#f3f4f6",
        cardBg: "#ffffff",
        text: "#111827",
        primary: "#4f46e5",
      },
      teal: {
        bodyBg: "#ecfeff",
        cardBg: "#ffffff",
        text: "#082f49",
        primary: "#0f766e",
      },
      peach: {
        bodyBg: "#fff7ed",
        cardBg: "#ffffff",
        text: "#7c2d12",
        primary: "#f97316",
      },
      dark: {
        bodyBg: "#020617",
        cardBg: "#0f172a",
        text: "#e5e7eb",
        primary: "#38bdf8",
      },
    };

    const theme = themes[themeName] || themes.purple;

    // Body
    document.body.style.backgroundColor = theme.bodyBg;
    document.body.style.color = theme.text;

    // Cards
    document.querySelectorAll(".card").forEach((card) => {
      card.style.backgroundColor = theme.cardBg;
      card.style.color = theme.text;
    });

    // Buttons
    document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
      btn.style.backgroundColor = theme.primary;
      btn.style.borderColor = theme.primary;
      btn.style.color = "#ffffff";
    });
  }

  // Initial setup
  applyTheme("purple");
  updateChart();
});
