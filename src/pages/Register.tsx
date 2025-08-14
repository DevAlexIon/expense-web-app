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
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Formik, Form } from 'formik'
import { registerSchema } from '@/schemas/register'
import { useAppDispatch } from '@/store'
import { registerUser } from '@/store/slices/general'
import { useToast } from '@/components/Toast'

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  interface RegisterValues {
    name: string
    email: string
    password: string
    confirmPassword: string
  }

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const handleSubmitFormik = async (values: RegisterValues) => {
    setIsLoading(true)
    try {
      const response = await dispatch(registerUser(values)).unwrap()
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
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Cg fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className='relative z-10 min-h-screen flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md'>
          {/* Header */}
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
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
            <h1 className='text-3xl font-semibold text-gray-900 mb-2'>
              Join ExpenseTracker
            </h1>
            <p className='text-gray-600'>
              Create your account to start tracking expenses
            </p>
          </div>

          {/* Register Card */}
          <Card className='border-0 shadow-lg bg-white'>
            <CardHeader className='space-y-2 pb-6 pt-6'>
              <CardTitle className='text-xl text-gray-900 text-center'>
                Create Account
              </CardTitle>
              <CardDescription className='text-gray-600 text-center'>
                Get started with your personal finance tracking
              </CardDescription>
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              <Formik
                initialValues={initialValues}
                validationSchema={registerSchema}
                onSubmit={handleSubmitFormik}
              >
                {({ values, handleChange, touched, errors }) => (
                  <Form className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name' className='text-gray-700'>
                        Full Name
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        type='text'
                        placeholder='John Doe'
                        value={values.name}
                        onChange={handleChange}
                        className='h-11 bg-input-background border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20'
                        required
                      />
                      {touched.name && errors.name && (
                        <div className='text-red text-sm mt-1'>
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email' className='text-gray-700'>
                        Email Address
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        name='email'
                        placeholder='john@example.com'
                        value={values.email}
                        onChange={handleChange}
                        className='h-11 bg-input-background border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20'
                        required
                      />
                      {touched.email && errors.email && (
                        <div className='text-red text-sm mt-1'>
                          {errors.email}
                        </div>
                      )}
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
                          placeholder='Create a strong password'
                          value={values.password}
                          onChange={handleChange}
                          className='h-11 bg-input-background border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 pr-11'
                          required
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
                      {touched.password && errors.password && (
                        <div className='text-red text-sm mt-1'>
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='confirmPassword'
                        className='text-gray-700'
                      >
                        Confirm Password
                      </Label>
                      <div className='relative'>
                        <Input
                          id='confirmPassword'
                          name='confirmPassword'
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='Confirm your password'
                          value={values.confirmPassword}
                          onChange={handleChange}
                          className='h-11 bg-input-background border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 pr-11'
                          required
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
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
                      {touched.confirmPassword && errors.confirmPassword && (
                        <div className='text-red text-sm mt-1'>
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>

                    <div className='pt-4'>
                      <Button
                        type='submit'
                        className='w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200 group'
                        disabled={isLoading}
                      >
                        <span className='flex items-center justify-center space-x-2'>
                          <span>
                            {isLoading
                              ? 'Creating Account...'
                              : 'Create Account'}
                          </span>
                          {!isLoading && (
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
                  Already have an account?{' '}
                  <Button
                    variant='link'
                    className='p-0 h-auto text-primary font-medium hover:text-primary/80'
                    onClick={() => navigate('/login')}
                  >
                    Sign in instead
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className='text-center mt-6 space-y-2'>
            <div className='flex items-center justify-center space-x-2 text-gray-500 text-sm'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
              <span>Your data is encrypted and secure</span>
            </div>
            <p className='text-gray-500 text-xs'>
              By creating an account, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
