class Wallet {
    constructor() {
        this.balance = 0;
        this.transaction = [];
        this.password = '12345';
        // Load transactions from localStorage on initialization
        this.loadTransactions();
        // load balance from localStorage
        this.loadBalance()
    }

    displayBalance() {
        document.getElementById('balance-info').innerText = `Wallet balance: $${this.balance}`
    }

    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            this.transaction.push({
                type: 'Deposit',
                amount: amount,
                date: new Date().toLocaleString()
            });
            this.displayBalance();
            return true;
        } else {
            alert('Enter a valid amount to deposit')
            return false;
        }
    }

    withdraw(EnteredPassword, amount) {
        if (EnteredPassword === this.password) {

            if (amount > 0 && amount <= this.balance) {
                this.balance -= amount;
                this.transaction.push({
                    type: 'withdraw',
                    amount: amount,
                    date: new Date().toLocaleString()
                })
                this.displayBalance();
                return true;
            } else if (amount > this.balance) {
                alert('Insufficient funds!')
                return false;
            } else if (amount <= 0) {
                alert('Enter a valid amount to withdraw')
                return false;
            }
        } else {
            alert('Incorrect password!')
            return false;
        }
    }

    displayTransactions() {
        const loader = document.getElementById('loader')
        const transactionList = document.getElementById('transaction-history');
        transactionList.innerHTML = '';

        loader.style.display = 'block'
        setTimeout(() => {
            loader.style.display = 'none'
            this.transaction.forEach(transaction => {
                const listItem = document.createElement('li');
                listItem.innerText = `${transaction.type}: $${transaction.amount} - ${transaction.date}`;
                transactionList.appendChild(listItem);
            })
        }, 2000);
    }
    // Save balance to local storage
    saveBalance() {
        localStorage.setItem('balance', JSON.stringify(this.balance));
    }
    // Load balance from localStorage
    loadBalance() {
        try {
            const storedBalance = localStorage.getItem('balance');
            if (storedBalance) {
                this.balance = JSON.parse(storedBalance);
            } else {
                this.balance = 0;
            }
        } catch (error) {
            console.error('Error loading balance from localStorage:', error)
            this.balance = 0;
        }
    }


    // Save transaction to local storage
    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transaction));
    }
    
    // load transaction from local storage
    loadTransactions() {
        try {
            const storedTransactions = localStorage.getItem('transactions');
            if (storedTransactions) {
                this.transaction = JSON.parse(storedTransactions);
            } else {
                // If no transactions in localStorage, initialize as empty array
                this.transaction = [];
            }
        } catch (error) {
            console.error("Error loading transactions from localStorage:", error);
            // Handle the error appropriately:
            // 1. You could clear localStorage: localStorage.removeItem('transactions');
            // 2. Or, you could default to an empty array: this.transaction = [];
            this.transaction = []; // Choosing to default to an empty array for now
        }
    }
    

}


document.addEventListener('DOMContentLoaded', () => {
    const myWallet = new Wallet();
    myWallet.displayBalance();
    loader.style.display = 'none'

    document.getElementById('submit-deposit-btn').addEventListener('click',
        (e) => {
            e.preventDefault();
            const depositAmount = parseFloat(document.getElementById('deposit-amount').value);
            myWallet.deposit(depositAmount)
            if (myWallet.deposit(depositAmount)) {
                myWallet.saveBalance();
                myWallet.saveTransactions(); //save the balance after deposit
            }
        }
    )

    document.getElementById('submit-withdrawal-btn').addEventListener('click',
        (e) => {
            e.preventDefault();
            const withdrawAmount = parseFloat(document.getElementById('withdraw-amount').value);
            const passWord = document.getElementById('password').value;
            myWallet.withdraw(passWord, withdrawAmount)
            if (myWallet.withdraw(passWord, withdrawAmount)) {
                myWallet.saveBalance(); //save the balance after withdrwal
                myWallet.saveTransactions();
            }
        }
    )

    document.getElementById('deposit-btn').addEventListener('click', () => {
        const depositForm = document.getElementById('deposit-form');
        depositForm.classList.toggle('hidden');
    })

    document.getElementById('Withdraw-btn').addEventListener('click', () => {
        const withdrawForm = document.getElementById('withdraw-form');
        withdrawForm.classList.toggle('hidden');
        console.log('hurray!');
    })

    document.getElementById('t-HistoryBtn').addEventListener('click', () => {
        // Load transactions from localStorage
        myWallet.loadTransactions();

        if (myWallet.transaction.length === 0) {
            alert('No transactions to display')
            return;
        } else {
            // Clear existing transactions before displaying
            document.getElementById('transaction-history').innerHTML = '';
            myWallet.displayTransactions()
        }
        const transactionHistory = document.getElementById('transaction-history')
        transactionHistory.classList.toggle('hidden')
    })
});
