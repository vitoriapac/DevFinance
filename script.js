const Modal = {
  open() {
    //Abrir Modal, adicionar classe active
    document.querySelector('.modal-overlay').classList.add('active')
  },
  close() {
    //Fechar Modal, remover classe active
    document.querySelector('.modal-overlay').classList.remove('active')
  }
}

//Array com os dados das transações
const transactions = [
  {
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021'
  },
  {
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '23/01/2021'
  },
  {
    id: 3,
    description: 'Internet',
    amount: -20000,
    date: '23/01/2021'
  },
  {
    id: 4,
    description: 'App',
    amount: 100000,
    date: '23/01/2021'
  }
]

//Calculo dos cards
const Transaction = {
  all: transactions, //atalho p/ todas as transações

  incomes() {
    //somar as entradas
    let income = 0
    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })
    return income
  },
  expenses() {
    //somar as saidas
    let expense = 0
    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense
  },
  total() {
    //entradas - saidas
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img src="./assets/minus.svg" alt="Remover transação" />
      </td>
    `
    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    )
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    )
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()
    )
  }
}

//Formata os numeros em moeda, adiciona o valor negativo e $
const Utils = {
  formatCurrency(valeu) {
    const signal = Number(valeu) < 0 ? '-' : ''

    valeu = String(valeu).replace(/\D/g, '')
    valeu = Number(valeu) / 100

    valeu = valeu.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + valeu
  }
}

transactions.forEach(function (transaction) {
  DOM.addTransaction(transaction)
})

DOM.updateBalance()
