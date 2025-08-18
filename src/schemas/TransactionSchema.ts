import * as Yup from 'yup'

export const TransactionSchema = Yup.object().shape({
  type: Yup.string().oneOf(['income', 'expense']).required('Required'),
  amount: Yup.number().positive('Amount must be positive').required('Required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  date: Yup.string().required('Date is required'),
})
