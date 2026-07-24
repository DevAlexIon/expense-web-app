import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/Card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  PieLabelRenderProps,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/badge'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  getUserTransactions,
  selectTransactions,
  selectTransactionsLoading,
} from '@/store/slices/transactionSlice'
import { useAppDispatch } from '@/store'
import { toAmount, toDateKey } from '@/helpers/utils'

const COLORS = [
  '#0C1222',
  '#B8956C',
  '#1B7A4E',
  '#B8334A',
  '#5C6578',
  '#8B7355',
]

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(12, 18, 34, 0.08)',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(12, 18, 34, 0.08)',
  fontSize: '13px',
}

const Reports = () => {
  const dispatch = useAppDispatch()
  const transactions = useSelector(selectTransactions)
  const loading = useSelector(selectTransactionsLoading)

  useEffect(() => {
    void dispatch(getUserTransactions())
  }, [dispatch])

  if (loading && transactions.length === 0) {
    return (
      <div className='page-container flex min-h-[calc(100dvh-4.75rem)] flex-col justify-center py-10'>
        <div className='mb-6 text-center fade-up'>
          <p className='font-mono-label text-brass mb-1'>Analytics</p>
          <h1 className='font-display text-[1.5rem] font-bold tracking-tight text-foreground sm:text-[1.75rem]'>
            Reports
          </h1>
          <p className='mt-1.5 text-sm text-muted-foreground'>
            Loading your insights…
          </p>
        </div>

        <div className='mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='stat-card'>
              <CardHeader className='pb-2'>
                <div className='mx-auto h-3 w-24 animate-pulse rounded bg-secondary' />
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='mx-auto h-7 w-28 animate-pulse rounded-md bg-secondary' />
                <div className='mx-auto h-5 w-16 animate-pulse rounded bg-secondary' />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className='fade-up'>
          <CardContent className='flex items-center justify-center !pt-16 pb-16 sm:!pt-20 sm:pb-20'>
            <div className='h-44 w-full max-w-2xl animate-pulse rounded-2xl bg-secondary' />
          </CardContent>
        </Card>
      </div>
    )
  }

  const monthlyData = transactions.reduce((acc, transaction) => {
    const key = toDateKey(transaction.date)
    if (!key) return acc
    const [year, month] = key.split('-')
    const monthKey = `${year}-${month}`

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expenses: 0 }
    }

    const amount = toAmount(transaction.amount)
    if (transaction.type === 'income') {
      acc[monthKey].income += amount
    } else if (transaction.type === 'expense') {
      acc[monthKey].expenses += amount
    }

    return acc
  }, {} as Record<string, { month: string; income: number; expenses: number }>)

  const monthlyChartData = Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month),
  )

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = (transaction.category || 'Other').trim() || 'Other'
      acc[category] = (acc[category] || 0) + toAmount(transaction.amount)
      return acc
    }, {} as Record<string, number>)

  const categoryChartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .filter(entry => entry.value > 0)
    .sort((a, b) => b.value - a.value)

  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      const category = (transaction.category || 'Other').trim() || 'Other'
      acc[category] = (acc[category] || 0) + toAmount(transaction.amount)
      return acc
    }, {} as Record<string, number>)

  const incomeChartData = Object.entries(incomeByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .filter(entry => entry.value > 0)
    .sort((a, b) => b.value - a.value)

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + toAmount(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + toAmount(t.amount), 0)

  const balance = totalIncome - totalExpenses

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() - i)
    return toDateKey(date)
  }).reverse()

  const dailySpendingData = last30Days.map((dateKey: string) => {
    const dayTransactions = transactions.filter(
      t => toDateKey(t.date) === dateKey,
    )
    const dayExpenses = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + toAmount(t.amount), 0)
    const dayIncome = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + toAmount(t.amount), 0)

    const [y, m, d] = dateKey.split('-').map(Number)
    const labelDate = new Date(y!, m! - 1, d)

    return {
      date: labelDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      expenses: dayExpenses,
      income: dayIncome,
      net: dayIncome - dayExpenses,
    }
  })

  return (
    <div className='page-container'>
      <div className='mb-5 flex flex-wrap items-end justify-between gap-2 fade-up'>
        <div>
          <p className='font-mono-label text-brass mb-1'>Analytics</p>
          <h1 className='font-display text-[1.5rem] font-bold tracking-tight text-foreground sm:text-[1.75rem]'>
            Reports
          </h1>
        </div>
        <p className='hidden text-sm text-muted-foreground sm:block'>
          Cash flow and category insights
        </p>
      </div>

      <div className='mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='stat-card fade-up fade-up-delay-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-mono-label text-muted-foreground'>
              Net Worth
            </CardTitle>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-brass-soft'>
              <DollarSign className='h-4 w-4 text-brass' strokeWidth={2.2} />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`font-display text-xl font-semibold tracking-tight ${
                balance >= 0 ? 'text-income' : 'text-expense'
              }`}
            >
              ${Math.abs(balance).toLocaleString()}
            </div>
            <Badge
              variant={balance >= 0 ? 'income' : 'expense'}
              className='mt-2'
            >
              {balance >= 0 ? 'Positive' : 'Negative'}
            </Badge>
          </CardContent>
        </Card>

        <Card className='stat-card fade-up fade-up-delay-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-mono-label text-muted-foreground'>
              Monthly Income
            </CardTitle>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-income-soft'>
              <TrendingUp className='h-4 w-4 text-income' strokeWidth={2.2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='font-display text-xl font-semibold tracking-tight text-income'>
              $
              {(
                totalIncome / (monthlyChartData.length || 1)
              ).toLocaleString()}
            </div>
            <p className='mt-1.5 text-sm text-muted-foreground'>
              Average per month
            </p>
          </CardContent>
        </Card>

        <Card className='stat-card fade-up fade-up-delay-3'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-mono-label text-muted-foreground'>
              Monthly Expenses
            </CardTitle>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-expense-soft'>
              <TrendingDown className='h-4 w-4 text-expense' strokeWidth={2.2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='font-display text-xl font-semibold tracking-tight text-expense'>
              $
              {(
                totalExpenses / (monthlyChartData.length || 1)
              ).toLocaleString()}
            </div>
            <p className='mt-1.5 text-sm text-muted-foreground'>
              Average per month
            </p>
          </CardContent>
        </Card>

        <Card className='stat-card fade-up fade-up-delay-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-mono-label text-muted-foreground'>
              Savings Rate
            </CardTitle>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-secondary'>
              <Percent className='h-4 w-4 text-foreground' strokeWidth={2.2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='font-display text-xl font-semibold tracking-tight text-foreground'>
              {totalIncome > 0
                ? Math.round((balance / totalIncome) * 100)
                : 0}
              %
            </div>
            <p className='mt-1.5 text-sm text-muted-foreground'>
              Of total income
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5'>
        <Card className='fade-up fade-up-delay-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='h-5 w-5 text-brass' strokeWidth={2.2} />
              <span>Monthly income vs expenses</span>
            </CardTitle>
            <CardDescription>Compare your monthly financial flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#e8eaf0' />
                  <XAxis
                    dataKey='month'
                    stroke='#5c6578'
                    fontSize={12}
                    tick={{ fill: '#5c6578' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke='#5c6578'
                    fontSize={12}
                    tick={{ fill: '#5c6578' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      '',
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey='income'
                    fill='#1B7A4E'
                    name='Income'
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey='expenses'
                    fill='#B8334A'
                    name='Expenses'
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className='fade-up fade-up-delay-3'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <PieChartIcon className='h-5 w-5 text-brass' strokeWidth={2.2} />
              <span>Expenses by category</span>
            </CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              {categoryChartData.length === 0 ? (
                <div className='flex h-full flex-col items-center justify-center text-center'>
                  <p className='text-sm font-medium text-foreground'>
                    No expenses yet
                  </p>
                  <p className='mt-1 max-w-xs text-sm text-muted-foreground'>
                    Add expense transactions to see category breakdown.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      innerRadius={48}
                      paddingAngle={2}
                      fill='#B8956C'
                      dataKey='value'
                      label={(props: PieLabelRenderProps) => {
                        const { name, percent } = props
                        const pct = (percent as number) || 0
                        return `${name} ${(pct * 100).toFixed(0)}%`
                      }}
                    >
                      {categoryChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        'Amount',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='fade-up fade-up-delay-3'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-brass' strokeWidth={2.2} />
              <span>Income sources</span>
            </CardTitle>
            <CardDescription>Your revenue streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              {incomeChartData.length === 0 ? (
                <div className='flex h-full flex-col items-center justify-center text-center'>
                  <p className='text-sm font-medium text-foreground'>
                    No income yet
                  </p>
                  <p className='mt-1 max-w-xs text-sm text-muted-foreground'>
                    Add income transactions to see source breakdown.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={incomeChartData}
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      innerRadius={48}
                      paddingAngle={2}
                      fill='#1B7A4E'
                      dataKey='value'
                      label={(props: PieLabelRenderProps) => {
                        const { name, percent } = props
                        const pct = (percent as number) || 0
                        return `${name} ${(pct * 100).toFixed(0)}%`
                      }}
                    >
                      {incomeChartData.map((_, index) => (
                        <Cell
                          key={`cell-income-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        'Amount',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='fade-up fade-up-delay-4'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingDown className='h-5 w-5 text-brass' strokeWidth={2.2} />
              <span>30-day spending trend</span>
            </CardTitle>
            <CardDescription>Your daily financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={dailySpendingData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id='expenseFill' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='#B8334A' stopOpacity={0.35} />
                      <stop offset='100%' stopColor='#B8334A' stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id='incomeFill' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='#1B7A4E' stopOpacity={0.35} />
                      <stop offset='100%' stopColor='#1B7A4E' stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e8eaf0' />
                  <XAxis
                    dataKey='date'
                    stroke='#5c6578'
                    fontSize={10}
                    tick={{ fill: '#5c6578' }}
                    interval='preserveStartEnd'
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke='#5c6578'
                    fontSize={12}
                    tick={{ fill: '#5c6578' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      '',
                    ]}
                  />
                  <Area
                    type='monotone'
                    dataKey='expenses'
                    stackId='1'
                    stroke='#B8334A'
                    fill='url(#expenseFill)'
                    name='Expenses'
                  />
                  <Area
                    type='monotone'
                    dataKey='income'
                    stackId='2'
                    stroke='#1B7A4E'
                    fill='url(#incomeFill)'
                    name='Income'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Reports
