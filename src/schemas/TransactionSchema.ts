import * as Yup from 'yup'

const categories = [
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
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
]

export const TransactionSchema = Yup.object().shape({
  type: Yup.string().oneOf(['income', 'expense']).required('Required'),
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .max(1_000_000_000, 'Amount is too large')
    .required('Required'),
  description: Yup.string()
    .trim()
    .max(280, 'Description is too long')
    .required('Description is required'),
  category: Yup.string()
    .oneOf(categories, 'Invalid category')
    .required('Category is required'),
  date: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')
    .required('Date is required'),
})
