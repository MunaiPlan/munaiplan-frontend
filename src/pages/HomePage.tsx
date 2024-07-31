import {FC} from 'react'
import { useCompanyFormOpen, useFieldFormOpen } from '../hooks/useForms'
import CreateCompany from '../components/forms/CreateCompany'
import CreateField from '../components/forms/CreateField'


const Home: FC = () => {
  const isCompanyFormOpened = useCompanyFormOpen()
  const isFieldFormOpened = useFieldFormOpen()

  let content;
  if (isCompanyFormOpened && !isFieldFormOpened) {
    content = <CreateCompany />
  } else if (!isCompanyFormOpened && isFieldFormOpened) {
    content = <CreateField />
  } else {
    content = <div className='w-screen flex flex-col justify-start items-center'>Тут ваши компании</div>
  }

  return (
    <div className='flex h-screen'>
      {content}
    </div>
  )
}

export default Home
