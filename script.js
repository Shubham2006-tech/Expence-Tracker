document.addEventListener("DOMContentLoaded", () => {
    const balanceDisplay = document.getElementById("balance");
    const transactionList = document.getElementById("transactions");
    const form = document.getElementById("transaction-form");
    const nameInput = document.getElementById("name");
    const amountInput = document.getElementById("amount");
    const typeInput = document.getElementById("type");
    const clearHistoryBtn = document.getElementById("clear-history");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function updateBalance() {
        const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        balanceDisplay.innerHTML = `₹${balance.toFixed(2)}`;
    }

    function updateUI() {
        transactionList.innerHTML = "";
        transactions.forEach(addTransactionDOM);
        updateBalance();
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    function addTransactionDOM(transaction) {
        const listItem = document.createElement("li");
        listItem.classList.add("transaction-item", transaction.amount > 0 ? "income" : "expense");
        listItem.innerHTML = `
            <span>${transaction.name} - ₹${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
        `;
        transactionList.appendChild(listItem);
    }

    function removeTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateUI();
    }

    function addTransaction(event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;

        if (name === "" || isNaN(amount) || amount <= 0) {
            alert("Please enter valid transaction details!");
            return;
        }

        const transaction = {
            id: Date.now(),
            name: name,
            amount: type === "income" ? amount : -amount
        };

        transactions.push(transaction);
        updateUI();
        form.reset();
    }

    function clearHistory() {
        if (confirm("Are you sure you want to clear all transactions?")) {
            transactions = [];
            localStorage.removeItem("transactions");
            updateUI();
        }
    }

    form.addEventListener("submit", addTransaction);
    clearHistoryBtn.addEventListener("click", clearHistory);

    updateUI();
});
