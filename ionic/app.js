const reasonInput = document.querySelector("#input-reason");
const amountInput = document.querySelector("#input-amount");
const cancelBtn = document.querySelector("#btn-cancel");
const confirmBtn = document.querySelector("#btn-confirm");
const expensesList = document.querySelector("#expense-list");
const totalExpensesOutput = document.querySelector("#total-expenses");
const alertCtrl = document.querySelector("#alert");

let totalExpenses = 0;

const clear = () => {
  reasonInput.value = "";
  amountInput.value = "";
};

confirmBtn.addEventListener("click", () => {
  const enteredReason = reasonInput.value;
  const enteredAmount = amountInput.value;

  if (
    enteredAmount <= 0 ||
    enteredAmount.trim().length <= 0 ||
    enteredReason.trim().length <= 0
  ) {
    const alertIon = document.createElement("ion-alert");
    alertIon.header = "Invalid inputs";
    alertIon.message = "Please enter valid name and amount";
    alertIon.buttons = ["Okay"];
    alertCtrl.appendChild(alertIon);
    alertIon.present();
    return;
  }

  const newItem = document.createElement("ion-item");
  newItem.textContent = enteredReason + ": $" + enteredAmount;
  expensesList.appendChild(newItem);

  totalExpenses += +enteredAmount;
  totalExpensesOutput.textContent = totalExpenses;
  totalExpenses;

  clear();
});

cancelBtn.addEventListener("click", clear);
