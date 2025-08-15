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
import { useToast } from '@/components/Toast'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Formik, Form, ErrorMessage } from 'formik'
import { loginSchema } from '@/schemas/login'
import { useAppDispatch } from '@/store'
import { loginUser } from '@/store/slices/general'
import { getUserTransactions } from '@/store/slices/transactionSlice'

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const dispatch = useAppDispatch()

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      await dispatch(loginUser(values)).unwrap()
      await dispatch(getUserTransactions())
      addToast('Login successful', 'success')
      navigate('/')
    } catch (error) {
      console.error(error)
      addToast('Something went wrong', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50/50 w-full'>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Cg fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className='relative z-10 min-h-screen flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-lg'>
              <svg
                className='w-8 h-8 text-primary-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
            </div>
            <h1 className='text-3xl font-semibold text-gray-900 mb-2'>
              Welcome Back
            </h1>
            <p className='text-gray-600'>
              Sign in to continue to ExpenseTracker
            </p>
          </div>

          <Card className='border-0 shadow-lg bg-white'>
            <CardHeader className='space-y-2 pb-6 pt-6'>
              <CardTitle className='text-xl text-gray-900 text-center'>
                Sign In
              </CardTitle>
              <CardDescription className='text-gray-600 text-center'>
                Access your expense tracker dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={handleLogin}
              >
                {({ handleChange, values }) => (
                  <Form className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='email' className='text-gray-700'>
                        Email Address
                      </Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='john@example.com'
                        value={values.email}
                        onChange={handleChange}
                        className='h-11 bg-input-background border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20'
                      />
                      <ErrorMessage
                        name='email'
                        component='div'
                        className='text-red-500 text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='password' className='text-gray-700'>
                        Password
                      </Label>
                      <div className='relative'>
                        <Input
                          id='password'
                          name='password'
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Enter your password'
                          value={values.password}
                          onChange={handleChange}
                          className='h-11 bg-input-background border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 pr-11'
                        />
                        <ErrorMessage
                          name='password'
                          component='div'
                          className='text-red-500 text-sm'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg
                              className='h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                              />
                            </svg>
                          ) : (
                            <svg
                              className='h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                              />
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                              />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className='pt-4'>
                      <Button
                        type='submit'
                        className='w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200 group'
                        disabled={loading}
                      >
                        <span className='flex items-center justify-center space-x-2'>
                          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                          {!loading && (
                            <svg
                              className='w-4 h-4 group-hover:translate-x-1 transition-transform'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 5l7 7-7 7'
                              />
                            </svg>
                          )}
                        </span>
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className='mt-6 text-center'>
                <p className='text-gray-600'>
                  Don't have an account?{' '}
                  <Button
                    variant='link'
                    className='p-0 h-auto text-primary font-medium hover:text-primary/80'
                    onClick={() => navigate('/register')}
                  >
                    Create one now
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className='text-center mt-6'>
            <p className='text-gray-500 text-sm'>
              Protected by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
