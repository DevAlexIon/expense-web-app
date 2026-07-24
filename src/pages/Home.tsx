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
import { useEffect, useRef, useState } from 'react'
import { selectUser } from '@/store/slices/general'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { toAmount } from '@/helpers/utils'
import {
  consumeInitialAnim,
  isDashboardBootstrapped,
  markDashboardBootstrapped,
} from '@/helpers/dashboardSession'

const StatSkeleton = () => (
  <Card className='stat-card'>
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
      <div className='h-3 w-20 animate-pulse rounded bg-secondary' />
      <div className='h-8 w-8 animate-pulse rounded-lg bg-secondary' />
    </CardHeader>
    <CardContent>
      <div className='h-7 w-28 animate-pulse rounded-md bg-secondary' />
      <div className='mt-2 h-3 w-24 animate-pulse rounded bg-secondary' />
    </CardContent>
  </Card>
)

const Home: React.FC = () => {
  const transactions = useSelector(selectTransactions)
  const dispatch = useAppDispatch()
  const currency = useSelector(selectUser)?.currency ?? 'RON'
  const [ready, setReady] = useState(() => isDashboardBootstrapped())
  // Capture once per Home mount; true only on first dashboard entry after login
  const playInitial = useRef(consumeInitialAnim()).current

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + toAmount(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + toAmount(t.amount), 0)

  const balance = totalIncome - totalExpenses

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await dispatch(getUserTransactions()).unwrap()
      } catch {
        // keep going — show empty dashboard rather than stuck loader
      } finally {
        if (!cancelled) {
          markDashboardBootstrapped()
          setReady(true)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [dispatch])

  // After first bootstrap in this session, show cached numbers immediately on route return
  const showNumbers = ready || isDashboardBootstrapped()
  return (
    <div className='page-container'>
      <div className='mb-4 flex flex-wrap items-end justify-between gap-2 fade-up'>
        <div>
          <p className='font-mono-label text-brass mb-1'>Overview</p>
          <h1 className='font-display text-[1.5rem] font-bold tracking-tight text-foreground sm:text-[1.75rem]'>
            Dashboard
          </h1>
        </div>
        <p className='hidden text-sm text-muted-foreground sm:block'>
          Income, expenses, and balance
        </p>
      </div>

      <div className='mb-5 grid grid-cols-1 gap-3 md:grid-cols-3'>
        {!showNumbers ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <Card className='stat-card fade-up fade-up-delay-1'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
                <CardTitle className='font-mono-label text-muted-foreground'>
                  Total Balance
                </CardTitle>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brass-soft'>
                  <DollarSign
                    className='h-3.5 w-3.5 text-brass'
                    strokeWidth={2.2}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`font-display text-xl font-semibold tracking-tight sm:text-2xl ${
                    balance >= 0 ? 'text-income' : 'text-expense'
                  }`}
                >
                  <AnimatedNumber value={balance} playInitial={playInitial} />{' '}
                  <span className='text-sm font-medium text-muted-foreground'>
                    {currency}
                  </span>
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Current net position
                </p>
              </CardContent>
            </Card>

            <Card className='stat-card fade-up fade-up-delay-2'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
                <CardTitle className='font-mono-label text-muted-foreground'>
                  Total Income
                </CardTitle>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-income-soft'>
                  <TrendingUp
                    className='h-3.5 w-3.5 text-income'
                    strokeWidth={2.2}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className='font-display text-xl font-semibold tracking-tight text-income sm:text-2xl'>
                  <AnimatedNumber
                    value={totalIncome}
                    playInitial={playInitial}
                  />{' '}
                  <span className='text-sm font-medium text-muted-foreground'>
                    {currency}
                  </span>
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {transactions.filter(t => t.type === 'income').length}{' '}
                  transactions
                </p>
              </CardContent>
            </Card>

            <Card className='stat-card fade-up fade-up-delay-3'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
                <CardTitle className='font-mono-label text-muted-foreground'>
                  Total Expenses
                </CardTitle>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-expense-soft'>
                  <TrendingDown
                    className='h-3.5 w-3.5 text-expense'
                    strokeWidth={2.2}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className='font-display text-xl font-semibold tracking-tight text-expense sm:text-2xl'>
                  <AnimatedNumber
                    value={totalExpenses}
                    playInitial={playInitial}
                  />{' '}
                  <span className='text-sm font-medium text-muted-foreground'>
                    {currency}
                  </span>
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {transactions.filter(t => t.type === 'expense').length}{' '}
                  transactions
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5'>
        <div className='fade-up fade-up-delay-2 lg:col-span-1'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2'>
                <PlusCircle className='h-4 w-4 text-brass' strokeWidth={2.2} />
                <span>Add transaction</span>
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

        <div className='fade-up fade-up-delay-3 lg:col-span-2'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle>Recent transactions</CardTitle>
              <CardDescription>
                Your latest financial activity
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0 sm:p-0'>
              {!showNumbers ? (
                <div className='space-y-3 px-4 py-4 sm:px-5'>
                  {[0, 1, 2].map(i => (
                    <div key={i} className='flex items-center gap-3'>
                      <div className='h-8 w-8 animate-pulse rounded-lg bg-secondary' />
                      <div className='flex-1 space-y-2'>
                        <div className='h-3.5 w-2/3 animate-pulse rounded bg-secondary' />
                        <div className='h-3 w-1/3 animate-pulse rounded bg-secondary' />
                      </div>
                      <div className='h-4 w-16 animate-pulse rounded bg-secondary' />
                    </div>
                  ))}
                </div>
              ) : (
                <TransactionList />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Home
