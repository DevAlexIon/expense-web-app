import { Formik, Form, Field, ErrorMessage } from 'formik'
import Button from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/Label'
import { Textarea } from '@/components/Textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import { createNewTransaction } from '@/store/slices/transactionSlice'
import { useAppDispatch } from '@/store'
import { TransactionSchema } from '@/schemas/TransactionSchema'
import { useToast } from '@/components/Toast'
import { SerializedError } from '@reduxjs/toolkit'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { DatePickerField } from '@/components/DatePickerField'

const expenseCategories = [
  'Food',
  'Transportation',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Insurance',
  'Other',
]

const incomeCategories = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Other',
]

export interface TransactionFormValues {
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
}

interface TransactionFormProps {
  mode: 'create' | 'edit'
  initialValues?: TransactionFormValues
  onSubmit?: (values: TransactionFormValues) => void
}

export const TransactionForm = ({
  mode,
  initialValues,
  onSubmit,
}: TransactionFormProps) => {
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const defaultValues: TransactionFormValues = {
    type: 'income',
    amount: 0,
    description: '',
    category: '',
    date: '',
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues || defaultValues}
      validationSchema={TransactionSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          if (mode === 'edit' && onSubmit) {
            await onSubmit(values)
          } else {
            await dispatch(createNewTransaction(values)).unwrap()
            addToast('Transaction created successfully!', 'success')
          }
          resetForm()
        } catch (error) {
          const err = error as SerializedError
          addToast(err.message || 'Failed to save transaction', 'error')
        }
      }}
    >
      {({ values, setFieldValue }) => {
        const categories =
          values.type === 'income' ? incomeCategories : expenseCategories

        const handleTypeChange = (type: 'income' | 'expense') => {
          if (type === values.type) return
          const nextCategories =
            type === 'income' ? incomeCategories : expenseCategories
          setFieldValue('type', type)
          // Clear category when switching type — lists don't overlap meaningfully
          if (!nextCategories.includes(values.category)) {
            setFieldValue('category', '')
          }
        }

        return (
          <Form className='space-y-3'>
            <div className='space-y-1.5'>
              <Label>Transaction type*</Label>
              <div className='grid grid-cols-2 gap-1.5 rounded-xl bg-secondary/60 p-1'>
                <button
                  type='button'
                  onClick={() => handleTypeChange('income')}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    values.type === 'income'
                      ? 'bg-card text-income shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TrendingUp className='h-4 w-4' strokeWidth={2.2} />
                  Income
                </button>
                <button
                  type='button'
                  onClick={() => handleTypeChange('expense')}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    values.type === 'expense'
                      ? 'bg-card text-expense shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TrendingDown className='h-4 w-4' strokeWidth={2.2} />
                  Expense
                </button>
              </div>
              <ErrorMessage
                name='type'
                component='div'
                className='text-sm text-expense'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='amount'>Amount*</Label>
              <Field
                as={Input}
                id='amount'
                name='amount'
                type='number'
                step='0.01'
              />
              <ErrorMessage
                name='amount'
                component='div'
                className='text-sm text-expense'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='description'>Description</Label>
              <Field
                as={Textarea}
                id='description'
                name='description'
                rows={2}
              />
              <ErrorMessage
                name='description'
                component='div'
                className='text-sm text-expense'
              />
            </div>

            <div className='space-y-1.5'>
              <Label>Category*</Label>
              <Select
                value={values.category}
                onValueChange={value => setFieldValue('category', value)}
              >
                <SelectTrigger className='cursor-pointer'>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage
                name='category'
                component='div'
                className='text-sm text-expense'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='date'>Date*</Label>
              <DatePickerField
                id='date'
                value={values.date}
                onChange={next => setFieldValue('date', next)}
              />
              <ErrorMessage
                name='date'
                component='div'
                className='text-sm text-expense'
              />
            </div>

            <Button
              type='submit'
              className='w-full cursor-pointer'
              variant={values.type === 'income' ? 'default' : 'destructive'}
            >
              {mode === 'create' ? 'Add transaction' : 'Update transaction'}
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}
