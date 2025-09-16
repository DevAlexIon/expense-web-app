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
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/badge'
import { useSelector } from 'react-redux'
import { selectTransactions } from '@/store/slices/transactionSlice'

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
  '#ff00ff',
]

const Reports = () => {
  const transactions = useSelector(selectTransactions)
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}`

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expenses: 0 }
    }

    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount
    } else {
      acc[monthKey].expenses += transaction.amount
    }

    return acc
  }, {} as Record<string, { month: string; income: number; expenses: number }>)

  const monthlyChartData = Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month),
  )

  // Calculate category data for expenses
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>)

  const categoryChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    }),
  )

  // Calculate income sources
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>)

  const incomeChartData = Object.entries(incomeByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    }),
  )

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // Calculate daily spending for the last 30 days
  const last30Days: string[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).filter(Boolean) as string[]

  const dailySpendingData = last30Days.map((date: string) => {
    const dayTransactions = transactions.filter(t => t.date === date)
    const dayExpenses = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const dayIncome = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      date: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      expenses: dayExpenses,
      income: dayIncome,
      net: dayIncome - dayExpenses,
    }
  })

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <Card className='border-0 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Net Worth
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
              <Badge
                variant={balance >= 0 ? 'default' : 'destructive'}
                className='mt-2 text-xs'
              >
                {balance >= 0 ? 'Positive' : 'Negative'}
              </Badge>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Monthly Income
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-semibold text-green-600'>
                $
                {(
                  totalIncome / (monthlyChartData.length || 1)
                ).toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>Average per month</p>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Monthly Expenses
              </CardTitle>
              <TrendingDown className='h-4 w-4 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-semibold text-red-600'>
                $
                {(
                  totalExpenses / (monthlyChartData.length || 1)
                ).toLocaleString()}
              </div>
              <p className='text-xs text-gray-500 mt-1'>Average per month</p>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Savings Rate
              </CardTitle>
              <Calendar className='h-4 w-4 text-blue-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-semibold text-blue-600'>
                {totalIncome > 0
                  ? Math.round((balance / totalIncome) * 100)
                  : 0}
                %
              </div>
              <p className='text-xs text-gray-500 mt-1'>Of total income</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Monthly Income vs Expenses */}
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <BarChart3 className='w-5 h-5' />
                <span>Monthly Income vs Expenses</span>
              </CardTitle>
              <CardDescription>
                Compare your monthly financial flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={monthlyChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis
                      dataKey='month'
                      stroke='#666'
                      fontSize={12}
                      tick={{ fill: '#666' }}
                    />
                    <YAxis
                      stroke='#666'
                      fontSize={12}
                      tick={{ fill: '#666' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: any) => [
                        `$${value.toLocaleString()}`,
                        '',
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey='income'
                      fill='#10b981'
                      name='Income'
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey='expenses'
                      fill='#ef4444'
                      name='Expenses'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <PieChartIcon className='w-5 h-5' />
                <span>Expenses by Category</span>
              </CardTitle>
              <CardDescription>Where your money goes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      fill='#8884d8'
                      dataKey='value'
                      label={(props: PieLabelRenderProps) => {
                        const { name, percent } = props
                        const pct = (percent as number) || 0
                        return `${name} ${(pct * 100).toFixed(0)}%`
                      }}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `$${value.toLocaleString()}`,
                        'Amount',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <TrendingUp className='w-5 h-5' />
                <span>Income Sources</span>
              </CardTitle>
              <CardDescription>Your revenue streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      fill='#8884d8'
                      dataKey='value'
                      label={(props: PieLabelRenderProps) => {
                        const { name, percent } = props
                        const pct = (percent as number) || 0
                        return `${name} ${(pct * 100).toFixed(0)}%`
                      }}
                    >
                      {incomeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `$${value.toLocaleString()}`,
                        'Amount',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Spending Trend */}
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <TrendingDown className='w-5 h-5' />
                <span>30-Day Spending Trend</span>
              </CardTitle>
              <CardDescription>Your daily financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={dailySpendingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis
                      dataKey='date'
                      stroke='#666'
                      fontSize={10}
                      tick={{ fill: '#666' }}
                      interval='preserveStartEnd'
                    />
                    <YAxis
                      stroke='#666'
                      fontSize={12}
                      tick={{ fill: '#666' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: any) => [
                        `$${value.toLocaleString()}`,
                        '',
                      ]}
                    />
                    <Area
                      type='monotone'
                      dataKey='expenses'
                      stackId='1'
                      stroke='#ef4444'
                      fill='#ef4444'
                      fillOpacity={0.3}
                      name='Expenses'
                    />
                    <Area
                      type='monotone'
                      dataKey='income'
                      stackId='2'
                      stroke='#10b981'
                      fill='#10b981'
                      fillOpacity={0.3}
                      name='Income'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Reports
