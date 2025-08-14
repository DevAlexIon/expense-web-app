import Button from '@/components/button'
import { useModal } from '@/context/modalContext'

type VersionProps = {
  storageName: string
  version: string
}

const Version: React.FC<VersionProps> = props => {
  const { closeModal } = useModal()

  const handleChangeVersion = () => [
    //TODO: add backend call to change version
    closeModal(),
  ]

  return (
    <div className='flex flex-col justify-center items-center  pt-spacing-12xl gap-spacing-8xl'>
      <p className='text-primary-light dark:text-primary text-lg text-center'>
        You are going to install the version{' '}
        <span className='font-bold text-deep-purple dark:text-accent-2'>
          {props.version}
        </span>{' '}
        on{' '}
        <span className='font-bold text-deep-purple dark:text-accent-2'>
          {props.storageName}
        </span>
      </p>
      <Button
        category='primary'
        caption='Confirm'
        size='xl'
        onClick={() => handleChangeVersion()}
      />
    </div>
  )
}

export default Version
