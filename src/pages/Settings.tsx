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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import { useToast } from '@/components/Toast'
import { selectUser, updateUser } from '@/store/slices/general'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/store'
import { AlertTriangle, KeyRound, UserRound } from 'lucide-react'
import { getErrorMessage } from '@/helpers/utils'
import { Navigate } from 'react-router'

export function Settings() {
  const user = useSelector(selectUser)
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const profileSchema = Yup.object({
    name: Yup.string().min(2, 'Name must be at least 2 characters'),
    email: Yup.string().email('Invalid email'),
    currency: Yup.string(),
  })

  const passwordSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'Min 6 chars')
      .required('New password required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm your password'),
  })

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return (
    <div className='page-container max-w-4xl'>
      <div className='mb-5 flex flex-wrap items-end justify-between gap-2 fade-up'>
        <div>
          <p className='font-mono-label text-brass mb-1'>Account</p>
          <h1 className='font-display text-[1.5rem] font-bold tracking-tight text-foreground sm:text-[1.75rem]'>
            Settings
          </h1>
        </div>
        <p className='hidden text-sm text-muted-foreground sm:block'>
          Profile, preferences, and security
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8'>
        <div className='space-y-6 lg:col-span-2'>
          <Card className='fade-up fade-up-delay-1'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <UserRound className='h-5 w-5 text-brass' strokeWidth={2.2} />
                Profile information
              </CardTitle>
              <CardDescription>
                Update your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  name: user.name,
                  email: user.email,
                  currency: user.currency,
                }}
                validationSchema={profileSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await dispatch(updateUser(values)).unwrap()
                    addToast('Profile updated successfully', 'success')
                  } catch (error) {
                    addToast(
                      getErrorMessage(error, 'Failed to update profile'),
                      'error',
                    )
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  setFieldValue,
                }) => (
                  <Form className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='name'>Full name</Label>
                        <Field
                          as={Input}
                          id='name'
                          name='name'
                          placeholder='Enter your name'
                        />
                        {touched.name && errors.name && (
                          <p className='text-sm text-expense'>{errors.name}</p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='email'>Email address</Label>
                        <Field
                          as={Input}
                          id='email'
                          name='email'
                          type='email'
                          placeholder='Enter your email'
                        />
                        {touched.email && errors.email && (
                          <p className='text-sm text-expense'>{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label>Currency</Label>
                      <Select
                        value={values.currency}
                        onValueChange={val => setFieldValue('currency', val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='RON'>RON (LEU)</SelectItem>
                          <SelectItem value='USD'>USD ($)</SelectItem>
                          <SelectItem value='EUR'>EUR (€)</SelectItem>
                          <SelectItem value='GBP'>GBP (£)</SelectItem>
                          <SelectItem value='JPY'>JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                      {touched.currency && errors.currency && (
                        <p className='text-sm text-expense'>{errors.currency}</p>
                      )}
                    </div>

                    <Button type='submit' disabled={isSubmitting}>
                      {isSubmitting ? 'Saving…' : 'Save changes'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>

          <Card className='fade-up fade-up-delay-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <KeyRound className='h-5 w-5 text-brass' strokeWidth={2.2} />
                Change password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={passwordSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  try {
                    await dispatch(
                      updateUser({
                        currentPassword: values.currentPassword,
                        newPassword: values.newPassword,
                      }),
                    ).unwrap()
                    addToast('Password updated successfully', 'success')
                    resetForm()
                  } catch (error) {
                    addToast(
                      getErrorMessage(error, 'Failed to update password'),
                      'error',
                    )
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='currentPassword'>Current password</Label>
                      <Field
                        as={Input}
                        id='currentPassword'
                        name='currentPassword'
                        type='password'
                        placeholder='Enter current password'
                      />
                      {touched.currentPassword && errors.currentPassword && (
                        <p className='text-sm text-expense'>
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='newPassword'>New password</Label>
                        <Field
                          as={Input}
                          id='newPassword'
                          name='newPassword'
                          type='password'
                          placeholder='Enter new password'
                        />
                        {touched.newPassword && errors.newPassword && (
                          <p className='text-sm text-expense'>
                            {errors.newPassword}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='confirmPassword'>
                          Confirm password
                        </Label>
                        <Field
                          as={Input}
                          id='confirmPassword'
                          name='confirmPassword'
                          type='password'
                          placeholder='Confirm new password'
                        />
                        {touched.confirmPassword &&
                          errors.confirmPassword && (
                            <p className='text-sm text-expense'>
                              {errors.confirmPassword}
                            </p>
                          )}
                      </div>
                    </div>
                    <Button type='submit' disabled={isSubmitting}>
                      {isSubmitting ? 'Updating…' : 'Update password'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='fade-up fade-up-delay-3 border-expense/20'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-expense'>
                <AlertTriangle className='h-5 w-5' strokeWidth={2.2} />
                Danger zone
              </CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant='outline'
                className='w-full border-expense/30 text-expense hover:bg-expense-soft hover:text-expense'
                onClick={() =>
                  addToast('Account deletion not implemented yet', 'info')
                }
              >
                Delete account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
