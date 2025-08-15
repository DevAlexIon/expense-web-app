import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  deleteTransaction,
  editTransaction,
  selectTransactions,
} from '@/store/slices/transactionSlice'
import { TransactionResponse } from '@/services/modules/transactions/getUserTransactions'
import { formatDateForInput } from '@/helpers/utils'

import { TransactionForm, TransactionFormValues } from './TransactionForm'
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog'
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
import Button from '@/components/button'
import { Badge } from '@/components/badge'
import { useAppDispatch } from '@/store'
import { useToast } from '@/components/Toast'

export const TransactionList = () => {
  const transactions = useSelector(selectTransactions)
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const [editingTransaction, setEditingTransaction] =
    useState<TransactionResponse | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (transaction: TransactionResponse) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (values: TransactionFormValues) => {
    await dispatch(
      editTransaction({
        id: editingTransaction!._id,
        ...values,
      }),
    )
    addToast('Transaction edited successfully!', 'success')
    setIsEditDialogOpen(false)
    setEditingTransaction(null)
  }

  const handleDelete = async (id: string) => {
    dispatch(deleteTransaction(id))
    addToast('Transaction deleted successfully!', 'success')
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
    <>
      <div className='divide-y divide-gray-200'>
        {transactions.map(transaction => (
          <div
            key={transaction._id}
            className='p-4 hover:bg-gray-50 transition-colors flex justify-between items-center'
          >
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
              <div className='min-w-0'>
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

              <div className='flex items-center space-x-1'>
                {/* Edit Button */}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleEdit(transaction)}
                >
                  <Edit className='w-4 h-4' />
                </Button>

                {/* Delete Alert */}
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
                        onClick={() => handleDelete(transaction._id)}
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
        ))}
      </div>

      {/* Global Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the details of your transaction and save the changes.
            </DialogDescription>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              mode='edit'
              initialValues={{
                type: editingTransaction.type,
                amount: editingTransaction.amount,
                description: editingTransaction.description,
                category: editingTransaction.category,
                date: formatDateForInput(editingTransaction.date),
              }}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
