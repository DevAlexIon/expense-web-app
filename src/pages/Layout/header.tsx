import Button from '@/components/button'
import { LedgerLogo } from '@/components/LedgerLogo'
import { useToast } from '@/components/Toast'
import { useAppDispatch } from '@/store'
import { clearCredentials, selectUser } from '@/store/slices/general'
import { setTransactions } from '@/store/slices/transactionSlice'
import { api } from '@/services/api'
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router'
import { resetDashboardSession } from '@/helpers/dashboardSession'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const userInfo = useSelector(selectUser)
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const handleLogout = () => {
    dispatch(clearCredentials())
    dispatch(setTransactions([]))
    dispatch(api.util.resetApiState())
    resetDashboardSession()
    addToast('Logout successful', 'success')
    navigate('/login')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground',
    ].join(' ')

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 sm:px-8'>
        <button
          type='button'
          className='flex cursor-pointer items-center gap-2.5 text-left transition-opacity hover:opacity-90'
          onClick={() => navigate('/')}
        >
          <LedgerLogo />
          <div className='hidden min-w-0 sm:block'>
            <p className='font-display text-lg font-bold leading-none tracking-tight text-foreground'>
              Ledger
            </p>
            <p className='mt-0.5 truncate text-xs text-muted-foreground'>
              {userInfo?.name ? `Hi, ${userInfo.name}` : 'Expense Tracker'}
            </p>
          </div>
        </button>

        <nav className='flex items-center gap-1 sm:gap-1.5'>
          <NavLink to='/' end className={navLinkClass}>
            <LayoutDashboard className='h-4 w-4' strokeWidth={2.2} />
            <span className='hidden md:inline'>Dashboard</span>
          </NavLink>
          <NavLink to='/reports' className={navLinkClass}>
            <BarChart3 className='h-4 w-4' strokeWidth={2.2} />
            <span className='hidden md:inline'>Reports</span>
          </NavLink>
          <NavLink to='/settings' className={navLinkClass}>
            <Settings className='h-4 w-4' strokeWidth={2.2} />
            <span className='hidden md:inline'>Settings</span>
          </NavLink>

          <div className='mx-1 hidden h-5 w-px bg-border sm:block' />

          <Button
            variant='ghost'
            size='icon'
            onClick={handleLogout}
            className='h-8 w-8 cursor-pointer text-muted-foreground'
            aria-label='Log out'
          >
            <LogOut className='h-4 w-4' strokeWidth={2.2} />
          </Button>
        </nav>
      </div>
    </header>
  )
}

export default Header
