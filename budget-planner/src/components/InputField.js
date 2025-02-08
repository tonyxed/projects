import { useEffect, useState } from "react";
import "../styles/InputField.css";

//balance and input fields on the left side, with the charts and what not on the right side
//have AI recommendations on like how much you should be spending with the balance
//userprofile sign in sign out ?? python backend???

const InputField = () => {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [enteredBalance, setEnteredBalance] = useState("");
  const [theme, setTheme] = useState("light");
  const [showSettings, setShowSettings] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const handleChangeDate = (event) => {
    setDate(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleChangeBalance = (event) => {
    setEnteredBalance(event.target.value);
  };

  //handles the submit of the states
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (enteredBalance === "" || amount === "" || category === "") {
      alert("Please fill in all fields");
      return;
    }

    let predictedCategory = category;

    //fetching AI
    if (category === "Other") {
      try {
        const response = await fetch("http://127.0.0.1:5000/categorize", {
          method: "POST",
          headers: { "Content-type": "application/json"},
          body: JSON.stringify({ description: category })
        });
        const data = await response.json();
        predictedCategory = data.category;
      } catch (error){
        console.error("Error Fetching category:", error);
      }
    }

    const newBalance = balance + Number(enteredBalance) - Number(amount);
    setBalance(newBalance);

    const newTransaction = {
      date,
      category,
      amount: Number(amount),
    };

    setTransactions([...transactions, newTransaction]); //adds to the list

    setEnteredBalance("");
    setCategory("");
    setAmount("");
    setDate("");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const editExpense = (index) => {
    console.log("Editing Expense", index);
  };

  const deleteExpense = (index) => {
    const transactionsToDelete = transactions[index];
    const updatedTransactions = transactions.filter((_, i) => i !== index);

    setBalance((prevBalance) => prevBalance + transactionsToDelete.amount);

    setTransactions(updatedTransactions);

  };
  return (
    <div>
      <button
        className="setting-btn"
        onClick={() => setShowSettings(!showSettings)}
      >
        <span className="bar bar1"></span>
        <span className="bar bar2"></span>
        <span className="bar bar1"></span>
      </button>

      {showSettings && (
        <div className="settings-dropdown">
          <p className="settings-title">Settings</p>
          <div className="theme-toggle-container">
            <p>Dark Mode</p>
            <label className="switch-label">
              <input
                type="checkbox"
                className="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="form-container">
        <h1 className="form-title">Balance</h1>
        <p className={`form-balance ${balance < 0 ? "negative" : ""}`}>
          ${balance}
        </p>
        <input
          type="number"
          value={enteredBalance}
          onChange={handleChangeBalance}
          placeholder="Enter your Balance"
          className="input-field"
        />
        <select
          value={category}
          onChange={handleChangeCategory}
          className="input-field-list"
        >
          <option value="">Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={handleChangeAmount}
          placeholder="Expense Amount"
          className="input-field"
        />
        <input
          type="date"
          value={date}
          onChange={handleChangeDate}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          <span className="label">Add New Item</span>
          <span className="gradient-container">
            <span className="gradient"></span>
          </span>
        </button>
      </form>
      <div className="transactions-container">
        <h2>History</h2>
        {transactions.length === 0 ? (
          <p>No History Yet.</p>
        ) : (
          <ul>
            {transactions.map((transactions, index) => (
              <li key={index} className="transaction-item">
                <span>{index + 1}</span>
                <p>{transactions.date}</p>
                <p>{transactions.category}</p>
                <p>${transactions.amount}</p>
                <button className="btn-del" onClick={() => deleteExpense(index)}>
                  <svg
                    viewBox="0 0 15 17.5"
                    height="17.5"
                    width="15"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                  >
                    <path
                      transform="translate(-2.5 -1.25)"
                      d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                      id="Fill"
                    ></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InputField;
