interface ModalHeaderProps {
  title?: string | React.ReactElement
  subTitle?: string
  icon?: React.ReactElement
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, subTitle, icon }) => {
  return (
    <div className='flex flex-row justify-center items-center gap-spacing-5xl'>
      {icon}
      <div className=''>
        <p className='text-primary-light dark:text-primary text-xl font-semibold first-letter:uppercase'>
          {title}
        </p>
        <p className='text-primary-light dark:text-primary text-sm'>
          {subTitle}
        </p>
      </div>
    </div>
  )
}

export default ModalHeader
