import Header from '@/pages/Layout/header'

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = props => {
  return (
    <div className='page-shell flex min-h-screen flex-1 flex-col overscroll-none pb-8'>
      <Header />
      <main className='relative z-0 flex-1'>{props.children}</main>
    </div>
  )
}

export default Layout
