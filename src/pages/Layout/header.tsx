import Button from '@/components/button'
import { useToast } from '@/components/Toast'
import { useAppDispatch } from '@/store'
import { clearCredentials, selectUser } from '@/store/slices/general'
import { BarChart3, LogOut, Wallet } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const userInfo = useSelector(selectUser)
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const handleLogout = () => {
    dispatch(clearCredentials())
    addToast('Logout successful', 'success')
    navigate('/login')
  }

  return (
    <>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div
              className='flex items-center space-x-3 cursor-pointer'
              onClick={() => navigate('/')}
            >
              <div className='flex items-center justify-center w-10 h-10 bg-primary rounded-xl'>
                <Wallet className='w-5 h-5 text-primary-foreground' />
              </div>
              <div>
                <h1 className='text-lg font-semibold text-gray-900'>
                  Expense Tracker
                </h1>
                <p className='text-sm text-gray-500'>
                  Welcome back,{' '}
                  <span className='font-bold'>{userInfo?.name}</span>
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <Button
              variant='outline'
              disabled
              size='sm'
              // onClick={onNavigateToReports}
              className='flex items-center space-x-2'
            >
              <BarChart3 className='w-4 h-4' />
              <span>Reports</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/settings')}
              className='text-gray-500 hover:text-gray-700'
            >
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
                  d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </Button>

            <div className='flex items-center space-x-3'>
              {/* <img
                src={'https://placehold.co/600x400'}
                alt='User Avatar'
                className='w-8 h-8 rounded-full'
              /> */}
              <Button
                variant='ghost'
                size='sm'
                onClick={handleLogout}
                className='text-gray-500 hover:text-gray-700'
              >
                <LogOut className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
