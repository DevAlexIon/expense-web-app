import React, { useState } from 'react'

import { Transaction, TransactionForm } from './TransactionForm'
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import Button from '@/components/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/alertDialog'
import { Badge } from '@/components/badge'

interface TransactionListProps {
  transactions: Transaction[]
  onUpdate: (id: string, transaction: Omit<Transaction, 'id'>) => void
  onDelete: (id: string) => void
}

export function TransactionList({
  transactions,
  onUpdate,
  onDelete,
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (updatedTransaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      onUpdate(editingTransaction.id, updatedTransaction)
      setIsEditDialogOpen(false)
      setEditingTransaction(null)
    }
  }

  const handleDelete = (id: string) => {
    onDelete(id)
    // toast.success('Transaction deleted successfully')
  }

  if (transactions.length === 0) {
    return (
      <div className='p-8 text-center'>
        <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
          <TrendingUp className='w-6 h-6 text-gray-400' />
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          No transactions yet
        </h3>
        <p className='text-gray-500'>
          Start by adding your first transaction using the form on the left.
        </p>
      </div>
    )
  }

  return (
    <div className='divide-y divide-gray-200'>
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          className='p-4 hover:bg-gray-50 transition-colors'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {transaction.type === 'income' ? (
                  <TrendingUp className='w-4 h-4 text-green-600' />
                ) : (
                  <TrendingDown className='w-4 h-4 text-red-600' />
                )}
              </div>

              <div className='min-w-0 flex-1'>
                <div className='flex items-center space-x-2 mb-1'>
                  <p className='font-medium text-gray-900 truncate'>
                    {transaction.description}
                  </p>
                  <Badge variant='secondary' className='text-xs'>
                    {transaction.category}
                  </Badge>
                </div>
                <p className='text-sm text-gray-500'>
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='text-right'>
                <p
                  className={`font-semibold ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toLocaleString()}
                </p>
              </div>

              <div className='flex items-center space-x-1'>
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(transaction)}
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                      <DialogTitle>Edit Transaction</DialogTitle>
                    </DialogHeader>
                    {editingTransaction && (
                      <TransactionForm
                        mode='edit'
                        initialData={editingTransaction}
                        onSubmit={handleUpdate}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this transaction? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(transaction.id)}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
