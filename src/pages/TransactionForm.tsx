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
      s
    >
      {({ values, setFieldValue }) => {
        const categories =
          values.type === 'income' ? incomeCategories : expenseCategories

        return (
          <Form className='space-y-4'>
            {/* Transaction Type */}
            <div className='space-y-2'>
              <Label>Transaction Type*</Label>
              <Select
                value={values.type}
                onValueChange={value =>
                  setFieldValue('type', value as 'income' | 'expense')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='income'>Income</SelectItem>
                  <SelectItem value='expense'>Expense</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage
                name='type'
                component='div'
                className='text-red-500 text-sm'
              />
            </div>

            {/* Amount */}
            <div className='space-y-2'>
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
                className='text-red-500 text-sm'
              />
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Field
                as={Textarea}
                id='description'
                name='description'
                rows={3}
              />
              <ErrorMessage
                name='description'
                component='div'
                className='text-red-500 text-sm'
              />
            </div>

            {/* Category */}
            <div className='space-y-2'>
              <Label>Category*</Label>
              <Select
                value={values.category}
                onValueChange={value => setFieldValue('category', value)}
              >
                <SelectTrigger>
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
                className='text-red-500 text-sm'
              />
            </div>

            {/* Date */}
            <div className='space-y-2'>
              <Label htmlFor='date'>Date*</Label>
              <Field
                as={Input}
                id='date'
                name='date'
                type='date'
                min={new Date().toISOString().split('T')[0]}
              />
              <ErrorMessage
                name='date'
                component='div'
                className='text-red-500 text-sm'
              />
            </div>

            {/* Submit button */}
            <Button type='submit' className='w-full'>
              {mode === 'create' ? 'Add Transaction' : 'Update Transaction'}
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}
