import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  deleteTransaction,
  editTransaction,
  selectTransactions,
} from '@/store/slices/transactionSlice'
import { TransactionResponse } from '@/services/modules/transactions/getUserTransactions'
import { formatAmount, formatDateForInput, getErrorMessage } from '@/helpers/utils'

import { TransactionForm, TransactionFormValues } from './TransactionForm'
import { Edit, Trash2, TrendingUp, TrendingDown, Inbox } from 'lucide-react'

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
import { selectUser } from '@/store/slices/general'

export const TransactionList = () => {
  const transactions = useSelector(selectTransactions)
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const currency = useSelector(selectUser)?.currency ?? 'RON'

  const [editingTransaction, setEditingTransaction] =
    useState<TransactionResponse | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (transaction: TransactionResponse) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (values: TransactionFormValues) => {
    if (!editingTransaction?._id) return
    try {
      await dispatch(
        editTransaction({
          id: editingTransaction._id,
          ...values,
        }),
      ).unwrap()
      addToast('Transaction edited successfully!', 'success')
      setIsEditDialogOpen(false)
      setEditingTransaction(null)
    } catch (error) {
      addToast(getErrorMessage(error, 'Failed to edit transaction'), 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap()
      addToast('Transaction deleted successfully!', 'success')
    } catch (error) {
      addToast(getErrorMessage(error, 'Failed to delete transaction'), 'error')
    }
  }

  if (transactions.length === 0) {
    return (
      <div className='px-6 py-12 text-center sm:px-5'>
        <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary'>
          <Inbox className='h-6 w-6 text-muted-foreground' strokeWidth={2.2} />
        </div>
        <h3 className='mb-1.5 text-base font-semibold text-foreground'>
          No transactions yet
        </h3>
        <p className='mx-auto max-w-xs text-sm text-muted-foreground'>
          Start by adding your first transaction using the form on the left.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='divide-y divide-border'>
        {transactions.map(transaction => (
          <div
            key={transaction._id}
            className='flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-secondary/40 sm:px-5'
          >
            <div className='flex min-w-0 items-center gap-3'>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  transaction.type === 'income'
                    ? 'bg-income-soft'
                    : 'bg-expense-soft'
                }`}
              >
                {transaction.type === 'income' ? (
                  <TrendingUp
                    className='h-4 w-4 text-income'
                    strokeWidth={2.2}
                  />
                ) : (
                  <TrendingDown
                    className='h-4 w-4 text-expense'
                    strokeWidth={2.2}
                  />
                )}
              </div>
              <div className='min-w-0'>
                <div className='mb-1 flex flex-wrap items-center gap-2'>
                  <p className='truncate font-medium text-foreground'>
                    {transaction.description || transaction.category}
                  </p>
                  <Badge
                    variant={
                      transaction.type === 'income' ? 'income' : 'expense'
                    }
                  >
                    {transaction.category}
                  </Badge>
                </div>
                <p className='font-mono-label !normal-case !tracking-normal text-muted-foreground'>
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
              <p
                className={`text-sm font-semibold tabular-nums sm:text-base ${
                  transaction.type === 'income' ? 'text-income' : 'text-expense'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatAmount(transaction.amount)} {currency}
              </p>

              <div className='flex items-center'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleEdit(transaction)}
                  aria-label='Edit transaction'
                >
                  <Edit className='h-4 w-4' />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-expense hover:bg-expense-soft hover:text-expense'
                      aria-label='Delete transaction'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete transaction</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this transaction? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(transaction._id)}
                        className='bg-expense hover:bg-expense/90'
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit transaction</DialogTitle>
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
