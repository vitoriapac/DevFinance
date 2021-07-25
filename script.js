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

//Armazenamento local do navegador
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },

  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions)
    )
  }
}

//Calculo dos cards
const Transaction = {
  //atalho p/ todas as transações
  all: Storage.get(),

  //Adiciona novas transações
  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },

  //Remove as transações
  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" />
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
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }
}

//Formata os numeros em moeda, adiciona o valor negativo e $
const Utils = {
  formatAmount(value) {
    value = Number(value) * 100

    return value
  },

  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

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

//Acesso aos dados do formularios
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos')
    }
  },

  //formata os dados do formulario
  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  //Salvar a Transação
  saveTransaction(transaction) {
    Transaction.add(transaction)
  },

  //apagar os dados
  clearFields() {
    Form.description.valeu = ''
    Form.amount.valeu = ''
    Form.date.valeu = ''
  },

  submit(event) {
    //Para o comportamento padrão
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Form.saveTransaction(transaction)
      Form.clearFields()
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)

    DOM.updateBalance()

    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

//Inicializa a calculadora
App.init()
