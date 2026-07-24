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
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Formik, Form } from 'formik'
import { registerSchema } from '@/schemas/register'
import { useAppDispatch } from '@/store'
import { registerUser, selectToken } from '@/store/slices/general'
import { useToast } from '@/components/Toast'
import { SerializedError } from '@reduxjs/toolkit'
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useSelector } from 'react-redux'

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const token = useSelector(selectToken)

  if (token) {
    return <Navigate to='/' replace />
  }

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
      await dispatch(
        registerUser({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        }),
      ).unwrap()
      addToast('Account created — sign in to continue', 'success')
      navigate('/login')
    } catch (error) {
      const err = error as SerializedError
      addToast(err.message ?? 'Something went wrong', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthAtmosphere>
      <div className='mb-8 text-center'>
        <div className='mb-5 inline-flex justify-center'>
          <LedgerLogo markClassName='h-14 w-14 rounded-2xl shadow-lg shadow-primary/25' />
        </div>
        <p className='font-mono-label mb-2 text-brass'>Get started</p>
        <h1 className='font-display text-[2.5rem] font-bold tracking-tight text-foreground sm:text-[2.75rem]'>
          Join Ledger
        </h1>
        <p className='mt-2 text-base text-muted-foreground'>
          Create your personal finance workspace
        </p>
      </div>

      <Card className='border-border/60 bg-card/90 shadow-[0_8px_40px_rgba(12,18,34,0.1)] backdrop-blur-md'>
        <CardHeader className='space-y-1 pb-4 pt-7 text-center'>
          <CardTitle className='text-lg'>Create account</CardTitle>
          <CardDescription>
            A few details and you&apos;re ready to track
          </CardDescription>
        </CardHeader>
        <CardContent className='px-6 pb-7 sm:px-7'>
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmitFormik}
          >
            {({ values, handleChange, touched, errors }) => (
              <Form className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Full name</Label>
                  <Input
                    id='name'
                    name='name'
                    type='text'
                    placeholder='Alex Ion'
                    value={values.name}
                    onChange={handleChange}
                    autoComplete='name'
                  />
                  {touched.name && errors.name && (
                    <div className='text-sm text-expense'>{errors.name}</div>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    name='email'
                    placeholder='you@example.com'
                    value={values.email}
                    onChange={handleChange}
                    autoComplete='email'
                  />
                  {touched.email && errors.email && (
                    <div className='text-sm text-expense'>{errors.email}</div>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password'>Password</Label>
                  <div className='relative'>
                    <Input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='At least 8 characters'
                      value={values.password}
                      onChange={handleChange}
                      className='pr-11'
                      autoComplete='new-password'
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
                  {touched.password && errors.password && (
                    <div className='text-sm text-expense'>{errors.password}</div>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>Confirm password</Label>
                  <div className='relative'>
                    <Input
                      id='confirmPassword'
                      name='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm your password'
                      value={values.confirmPassword}
                      onChange={handleChange}
                      className='pr-11'
                      autoComplete='new-password'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 cursor-pointer text-muted-foreground'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className='text-sm text-expense'>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className='pt-2'>
                  <Button
                    type='submit'
                    className='h-11 w-full cursor-pointer'
                    disabled={isLoading}
                  >
                    <span>
                      {isLoading ? 'Creating account…' : 'Create account'}
                    </span>
                    {!isLoading && <ArrowRight className='h-4 w-4' />}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className='mt-6 text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Button
              variant='link'
              className='h-auto cursor-pointer p-0'
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
        <ShieldCheck className='h-3.5 w-3.5' strokeWidth={2.2} />
        <span>Your data is encrypted and secure</span>
      </div>
    </AuthAtmosphere>
  )
}
