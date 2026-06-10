const API = "http://localhost:5002";

async function loadExpenses() {

  const res = await fetch(API + "/expenses");

  const expenses = await res.json();

  let monthlyTotal = 0;

let foodTotal = 0;

let fuelTotal = 0;

let billsTotal = 0;

expenses.forEach(expense => {

  const amount =
    Number(expense.amount || 0);

  monthlyTotal += amount;

  if (expense.category === "Food") {
    foodTotal += amount;
  }

  if (expense.category === "Fuel") {
    fuelTotal += amount;
  }

  if (expense.category === "Bills") {
    billsTotal += amount;
  }

});

document.getElementById(
  "summaryCards"
).innerHTML = `

<div class="summary-card">
  <h3>💰 Monthly Total</h3>
  <p>₹${monthlyTotal}</p>
</div>

<div class="summary-card">
  <h3>🍔 Food</h3>
  <p>₹${foodTotal}</p>
</div>

<div class="summary-card">
  <h3>⛽ Fuel</h3>
  <p>₹${fuelTotal}</p>
</div>

<div class="summary-card">
  <h3>📄 Bills</h3>
  <p>₹${billsTotal}</p>
</div>

`;

  const searchText =
    document.getElementById("searchInput")
      ?.value
      .toLowerCase() || "";

  const selectedCategory =
    document.getElementById("filterCategory")
      ?.value || "All";

  const expensesDiv =
    document.getElementById("expenses");

  expensesDiv.innerHTML = "";

  const groupedExpenses = {};

  expenses
    .filter(expense => {

      const title =
        (expense.title || "").toLowerCase();

      const matchesSearch =
        title.includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        expense.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );

    })
    .forEach(expense => {

      const expenseDate =
        expense.date || "Unknown Date";

      if (!groupedExpenses[expenseDate]) {
        groupedExpenses[expenseDate] = [];
      }

      groupedExpenses[expenseDate].push(expense);

    });

  for (const date in groupedExpenses) {

    let total = 0;

    let tableRows = "";

    groupedExpenses[date].forEach(expense => {

      total += Number(expense.amount || 0);

      tableRows += `

        <tr>

          <td>${expense.title || "-"}</td>

          <td>${expense.category || "-"}</td>

          <td>Rs ${expense.amount || 0}</td>

          <td>

            <button
              onclick="editExpense(
                '${expense._id}',
                '${expense.title || ""}',
                '${expense.amount || ""}',
                '${expense.category || ""}',
                '${expense.date || ""}'
              )"
            >
              Edit
            </button>

            <button
              onclick="deleteExpense('${expense._id}')"
            >
              Delete
            </button>

          </td>

        </tr>

      `;

    });

    expensesDiv.innerHTML += `

      <div class="expense-day">

        <h2>📅 ${date}</h2>

        <table>

          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>

          ${tableRows}

        </table>

        <h3 class="total">
          Daily Total: Rs ${total}
        </h3>

      </div>

    `;

  }

}

async function addExpense() {

  const title =
    document.getElementById("title").value;

  const amount =
    document.getElementById("amount").value;

  const category =
    document.getElementById("category").value;

  const date =
    document.getElementById("date").value;

  if (
    !title ||
    !amount ||
    !category ||
    !date
  ) {

    alert("Please fill all fields");

    return;

  }

  await fetch(API + "/expenses", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      title,
      amount,
      category,
      date
    })

  });

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";

  loadExpenses();

}

async function deleteExpense(id) {

  const confirmDelete =
    confirm("Delete this expense?");

  if (!confirmDelete) return;

  await fetch(API + "/expenses/" + id, {

    method: "DELETE"

  });

  loadExpenses();

}

async function editExpense(
  id,
  oldTitle,
  oldAmount,
  oldCategory,
  oldDate
) {

  const title =
    prompt("Edit Title", oldTitle);

  if (title === null) return;

  const amount =
    prompt("Edit Amount", oldAmount);

  if (amount === null) return;

  const category =
    prompt("Edit Category", oldCategory);

  if (category === null) return;

  const date =
    prompt("Edit Date (YYYY-MM-DD)", oldDate);

  if (date === null) return;

  await fetch(API + "/expenses/" + id, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      title,
      amount,
      category,
      date
    })

  });

  loadExpenses();

}

loadExpenses();