import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/Card'
import { DollarSign, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react'
import { TransactionList } from './TransactionList'
import {
  getUserTransactions,
  selectTransactions,
} from '@/store/slices/transactionSlice'
import { TransactionForm } from './TransactionForm'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/store'
import { useEffect } from 'react'

const Home: React.FC = () => {
  const transactions = useSelector(selectTransactions)
  const dispatch = useAppDispatch()

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  useEffect(() => {
    dispatch(getUserTransactions())
  }, [dispatch])

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
                  balance >= 0 ? 'text-green-600' : 'text-red-600'
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
              <TrendingUp className='h-4 w-4 text-green-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-semibold text-green-600'>
                ${totalIncome.toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                {transactions.filter(t => t.type === 'income').length}{' '}
                transactions
              </p>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Total Expenses
              </CardTitle>
              <TrendingDown className='h-4 w-4 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-semibold text-red-600'>
                ${totalExpenses.toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                {transactions.filter(t => t.type === 'expense').length}{' '}
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
                <TransactionForm mode='create' />
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
                <TransactionList />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
