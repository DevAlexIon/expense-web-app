import Button from '@/components/button'
import { BarChart3, LogOut, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router'

const Header: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-3'>
              <div className='flex items-center justify-center w-10 h-10 bg-primary rounded-xl'>
                <Wallet className='w-5 h-5 text-primary-foreground' />
              </div>
              <div>
                <h1 className='text-lg font-semibold text-gray-900'>
                  Expense Tracker
                </h1>
                <p className='text-sm text-gray'>Welcome back, John Doe</p>
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center space-x-2'
              onClick={() => navigate('/login')}
            >
              <BarChart3 className='w-4 h-4' />
              <span>Reports</span>
            </Button>

            <div className='flex items-center space-x-3'>
              <Button
                variant='ghost'
                size='sm'
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
