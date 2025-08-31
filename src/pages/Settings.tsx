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
import { SerializedError } from '@reduxjs/toolkit'

export function Settings() {
  const user = useSelector(selectUser)!
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const profileSchema = Yup.object({
    name: Yup.string().min(6, 'Name must be at least 6 characters'),
    email: Yup.string().email('Invalid email'),
    currency: Yup.string(),
  })

  const passwordSchema = Yup.object({
    currentPassword: Yup.string(),
    newPassword: Yup.string()
      .min(6, 'Min 6 chars')
      .when('currentPassword', {
        is: (val: string) => val && val.length > 0,
        then: schema => schema.required('New password required'),
      }),
    confirmPassword: Yup.string().when('newPassword', {
      is: (val: string) => val && val.length > 0,
      then: schema =>
        schema
          .oneOf([Yup.ref('newPassword')], 'Passwords must match')
          .required('Confirm your password'),
    }),
  })

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className='max-w-4xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Information + Preferences */}
          <div className='lg:col-span-2 space-y-6'>
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
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
                    setSubmitting(true)
                    await dispatch(updateUser(values))
                    addToast('Profile updated successfully', 'success')
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
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='name'>Full Name</Label>
                          <Field
                            as={Input}
                            id='name'
                            name='name'
                            placeholder='Enter your name'
                          />
                          {touched.name && errors.name && (
                            <p className='text-sm text-red-500'>
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='email'>Email Address</Label>
                          <Field
                            as={Input}
                            id='email'
                            name='email'
                            type='email'
                            placeholder='Enter your email'
                          />
                          {touched.email && errors.email && (
                            <p className='text-sm text-red-500'>
                              {errors.email}
                            </p>
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
                          <p className='text-sm text-red-500'>
                            {errors.currency}
                          </p>
                        )}
                      </div>

                      <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
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
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      await dispatch(updateUser(values)).unwrap()
                      addToast('Profile updated successfully', 'success')
                    } catch (error) {
                      const err = error as SerializedError
                      addToast(
                        err.message || 'Failed to update profile',
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
                        <Label htmlFor='currentPassword'>
                          Current Password
                        </Label>
                        <Field
                          as={Input}
                          id='currentPassword'
                          name='currentPassword'
                          type='password'
                          placeholder='Enter current password'
                        />
                        {touched.currentPassword && errors.currentPassword && (
                          <p className='text-sm text-red-500'>
                            {errors.currentPassword}
                          </p>
                        )}
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='newPassword'>New Password</Label>
                          <Field
                            as={Input}
                            id='newPassword'
                            name='newPassword'
                            type='password'
                            placeholder='Enter new password'
                          />
                          {touched.newPassword && errors.newPassword && (
                            <p className='text-sm text-red-500'>
                              {errors.newPassword}
                            </p>
                          )}
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='confirmPassword'>
                            Confirm Password
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
                              <p className='text-sm text-red-500'>
                                {errors.confirmPassword}
                              </p>
                            )}
                        </div>
                      </div>
                      <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          <div className='space-y-6'>
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-red-600'>Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant='outline'
                  className='w-full text-red-600 border-red-200 hover:bg-red-50'
                  onClick={() =>
                    addToast('Account deletion not implemented yet', 'info')
                  }
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
