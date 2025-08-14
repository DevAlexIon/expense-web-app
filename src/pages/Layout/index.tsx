import Header from '@/pages/Layout/header'

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = props => {
  return (
    <div className='min-h-screen flex flex-1 flex-col bg-background-light dark:bg-background pb-spacing-12xl'>
      <Header />
      {props.children}
    </div>
  )
}

export default Layout
