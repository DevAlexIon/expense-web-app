import Button from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import { Textarea } from '@/components/Textarea'
import React, { useState } from 'react'

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void
  initialData?: Omit<Transaction, 'id'>
  mode?: 'create' | 'edit'
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  category: string
  date: string
}

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

export function TransactionForm({
  onSubmit,
  initialData,
  mode = 'create',
}: TransactionFormProps) {
  const [type, setType] = useState('')
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !description || !category || !date) {
      //   toast.error('Please fill in all fields')
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      //   toast.error('Please enter a valid amount')
      return
    }

    onSubmit({
      type,
      amount: numAmount,
      description,
      category,
      date,
    })

    // toast.success(
    //   mode === 'create'
    //     ? 'Transaction added successfully!'
    //     : 'Transaction updated successfully!',
    // )

    if (mode === 'create') {
      // Reset form
      setAmount('')
      setDescription('')
      setCategory('')
      setDate(new Date().toISOString().split('T')[0])
    }
  }

  const categories = type === 'income' ? incomeCategories : expenseCategories

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label>Transaction Type</Label>
        <Select value={type} onValueChange={value => setType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='income'>Income</SelectItem>
            <SelectItem value='expense'>Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='amount'>Amount ($)</Label>
        <Input
          id='amount'
          type='number'
          step='0.01'
          placeholder='0.00'
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          placeholder='Enter transaction description'
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
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
      </div>

      <div className='space-y-2'>
        <Label htmlFor='date'>Date</Label>
        <Input
          id='date'
          type='date'
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>

      <Button type='submit' className='w-full'>
        {mode === 'create' ? 'Add Transaction' : 'Update Transaction'}
      </Button>
    </form>
  )
}
