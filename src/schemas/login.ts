import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email('Invalid email')
    .max(254, 'Email is too long')
    .required('Email is required'),
  // Keep min 6 for existing accounts; new accounts require 8 via registerSchema
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password is too long')
    .required('Password is required'),
})
