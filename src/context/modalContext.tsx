import BiosModal from '@/components/modal'
import { ModalSize } from '@/types/common.interface'
import { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextProps {
  openModal: (
    modalContent: ReactNode,
    modalHeader: ReactNode,
    size?: ModalSize,
    title?: string,
  ) => void
  closeModal: () => void
  updateModalContent: (
    content: ReactNode,
    modalHeader: ReactNode,
    size?: ModalSize,
    title?: string,
  ) => void
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)
  const [modalHeader, setModalHeader] = useState<ReactNode | null>(null)
  const [modalSize, setModalSize] = useState<ModalSize>('large')
  const [modalTitle, setModalTitle] = useState<string>('')

  const openModal = (
    content: ReactNode,
    modalHeader: ReactNode,
    size: ModalSize = 'large',
    title: string = '',
  ) => {
    document.body.style.overflow = 'hidden'
    setModalContent(content)
    setModalSize(size)
    setModalHeader(modalHeader)
    setModalTitle(title)
    setTimeout(() => {
      setIsOpen(true)
    }, 200)
  }

  const closeModal = () => {
    document.body.style.overflow = 'auto'
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const updateModalContent = (
    content: ReactNode,
    modalHeader: ReactNode,
    size: ModalSize = 'large',
    title: string = '',
  ) => {
    setModalContent(content)
    setModalHeader(modalHeader)
    setModalSize(size)
    setModalTitle(title)
  }

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, updateModalContent }}
    >
      {children}
      <BiosModal
        size={modalSize}
        title={modalTitle}
        modalHeader={modalHeader}
        open={isOpen}
        onClose={closeModal}
      >
        {modalContent}
      </BiosModal>
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
