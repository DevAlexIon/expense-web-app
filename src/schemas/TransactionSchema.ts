import * as Yup from 'yup'

export const TransactionSchema = Yup.object().shape({
  type: Yup.string().oneOf(['income', 'expense']).required('Required'),
  amount: Yup.number().positive('Must be positive').required('Required'),
  description: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  date: Yup.string().required('Required'),
})
