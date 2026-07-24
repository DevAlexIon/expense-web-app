import Button from '@/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/Card'
import { Input } from '@/components/input'
import { Label } from '@/components/Label'
import { AuthAtmosphere } from '@/components/AuthAtmosphere'
import { LedgerLogo } from '@/components/LedgerLogo'
import { useToast } from '@/components/Toast'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Formik, Form, ErrorMessage } from 'formik'
import { loginSchema } from '@/schemas/login'
import { useAppDispatch } from '@/store'
import { loginUser, selectToken } from '@/store/slices/general'
import { getUserTransactions } from '@/store/slices/transactionSlice'
import { SerializedError } from '@reduxjs/toolkit'
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { useSelector } from 'react-redux'

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const dispatch = useAppDispatch()
  const token = useSelector(selectToken)

  if (token) {
    return <Navigate to='/' replace />
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      await dispatch(loginUser(values)).unwrap()
      await dispatch(getUserTransactions()).unwrap()
      addToast('Login successful', 'success')
      navigate('/')
    } catch (error) {
      const err = error as SerializedError
      addToast(err.message ?? 'Something went wrong', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthAtmosphere>
      <div className='text-center mb-8'>
        <div className='mb-5 inline-flex justify-center'>
          <LedgerLogo markClassName='h-14 w-14 rounded-2xl shadow-lg shadow-primary/25' />
        </div>
        <p className='font-mono-label text-brass mb-2'>Expense Tracker</p>
        <h1 className='font-display text-[2.5rem] font-bold tracking-tight text-foreground sm:text-[2.75rem]'>
          Ledger
        </h1>
        <p className='mt-2 text-base text-muted-foreground'>
          Sign in to your finances
        </p>
      </div>

      <Card className='border-border/60 bg-card/90 shadow-[0_8px_40px_rgba(12,18,34,0.1)] backdrop-blur-md'>
        <CardHeader className='space-y-1 pb-4 pt-7 text-center'>
          <CardTitle className='text-lg'>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent className='px-6 pb-7 sm:px-7'>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, values }) => (
              <Form className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='you@example.com'
                    value={values.email}
                    onChange={handleChange}
                    autoComplete='email'
                  />
                  <ErrorMessage
                    name='email'
                    component='div'
                    className='text-sm text-expense'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password'>Password</Label>
                  <div className='relative'>
                    <Input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      value={values.password}
                      onChange={handleChange}
                      className='pr-11'
                      autoComplete='current-password'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 cursor-pointer text-muted-foreground'
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                  <ErrorMessage
                    name='password'
                    component='div'
                    className='text-sm text-expense'
                  />
                </div>

                <div className='pt-2'>
                  <Button
                    type='submit'
                    className='h-11 w-full cursor-pointer'
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowRight className='h-4 w-4' />
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className='mt-6 text-center text-sm text-muted-foreground'>
            No account yet?{' '}
            <Button
              variant='link'
              className='h-auto cursor-pointer p-0'
              onClick={() => navigate('/register')}
            >
              Create one
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
        <Lock className='h-3.5 w-3.5' strokeWidth={2.2} />
        <span>Protected with industry-standard encryption</span>
      </div>
    </AuthAtmosphere>
  )
}
