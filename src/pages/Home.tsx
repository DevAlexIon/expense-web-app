import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/Card'
import { DollarSign, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react'
import { Transaction, TransactionForm } from './TransactionForm'
import { TransactionList } from './TransactionList'
import { useState } from 'react'

const Home: React.FC = () => {
  const balance = 1000
  const totalIncome = 2000
  const totalExpenses = 200
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 3500,
      description: 'Salary',
      category: 'Job',
      date: '2025-01-15',
    },
    {
      id: '2',
      type: 'expense',
      amount: 450,
      description: 'Grocery Shopping',
      category: 'Food',
      date: '2025-01-14',
    },
    {
      id: '3',
      type: 'expense',
      amount: 120,
      description: 'Gas Bill',
      category: 'Utilities',
      date: '2025-01-13',
    },
    {
      id: '4',
      type: 'income',
      amount: 200,
      description: 'Freelance Work',
      category: 'Side Job',
      date: '2025-01-12',
    },
  ])

  const updateTransaction = (
    id: string,
    updatedTransaction: Omit<Transaction, 'id'>,
  ) => {
    setTransactions(
      transactions.map(t => (t.id === id ? { ...updatedTransaction, id } : t)),
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card className='border-0 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Total Balance
              </CardTitle>
              <DollarSign className='h-4 w-4 text-gray-400' />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-semibold ${
                  balance >= 0 ? 'text-green' : 'text-red'
                }`}
              >
                ${Math.abs(balance).toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                {balance >= 0 ? '+' : '-'} Current balance
              </p>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Total Income
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-semibold text-green'>
                ${totalIncome.toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>transactions</p>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Total Expenses
              </CardTitle>
              <TrendingDown className='h-4 w-4 text-red' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-semibold text-red'>
                ${totalExpenses.toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                {/* {transactions.filter(t => t.type === 'expense').length}{' '} */}
                transactions
              </p>
            </CardContent>
          </Card>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Transaction Form */}
          <div className='lg:col-span-1'>
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <PlusCircle className='w-5 h-5' />
                  <span>Add Transaction</span>
                </CardTitle>
                <CardDescription>
                  Record a new income or expense
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm
                  onSubmit={transaction => {
                    // onAddTransaction(transaction)
                    // setShowTransactionForm(false)
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Transaction List */}
          <div className='lg:col-span-2'>
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest financial activities
                </CardDescription>
              </CardHeader>
              <CardContent className='p-0'>
                <TransactionList
                  transactions={transactions}
                  onUpdate={updateTransaction}
                  onDelete={deleteTransaction}
                />
                {/* <p>123</p> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
