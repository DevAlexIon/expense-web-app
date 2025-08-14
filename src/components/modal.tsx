import Button from '@/components/button'
import { AnimatePresence, motion } from 'framer-motion'
import { ModalSize } from '@/types/common.interface'
import { LogOut } from 'lucide-react'

interface BiosModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  modalHeader: React.ReactNode
  size?: ModalSize
  title?: string
}

const BiosModal: React.FC<BiosModalProps> = ({
  open,
  onClose,
  children,
  modalHeader,
  size,
  title = '',
}) => {
  //   const activeTab = useSelector(selectActiveModalTab)
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-1/3 max-w-sm'
      case 'medium':
        return 'w-[50%] max-w-[720px] h-[50%] max-h-[537px]'
      case 'large':
        return 'w-[70%] max-h-[90%] overflow-auto'
      case 'xlarge':
        return 'w-[85%] h-[90%] overflow-auto'
      default:
        return 'w-1/2 max-w-lg'
    }
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        // if (activeTab !== 0) {
        //     dispatch(setActiveModalTab(0))
        // }
      }}
    >
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose()}
            className={`backdrop-blur-sm fixed inset-0 z-10 grid place-items-center`}
          >
            <motion.div
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100vh', opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              layout
              onClick={e => e.stopPropagation()}
              className={`
                bg-secondary-light dark:bg-secondary pb-spacing-6xl rounded-radius-4xl shadow relative
                ${getSizeClass()}
              `}
            >
              <div className='flex justify-between rounded-radius-4xl px-spacing-6xl pt-spacing-4xl sticky top-0 bg-secondary-light dark:bg-secondary z-1 items-center'>
                {modalHeader}
                {title && (
                  <p className='text-primary-light dark:text-primary text-xl font-semibold'>
                    {title}
                  </p>
                )}
                <div className='ml-auto'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-500 hover:text-gray-700'
                  >
                    <LogOut className='w-4 h-4' />
                  </Button>
                </div>
              </div>
              <div className='px-spacing-6xl'>{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BiosModal
