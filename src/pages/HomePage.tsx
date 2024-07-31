import {FC} from 'react'
import { useCompanyFormOpen, useFieldFormOpen, useSiteFormOpen } from '../hooks/useForms'
import CreateCompany from '../components/forms/CreateCompany'
import CreateField from '../components/forms/CreateField'
import CreateSite from '../components/forms/CreateSite'


const Home: FC = () => {
  const isCompanyFormOpened = useCompanyFormOpen()
  const isFieldFormOpened = useFieldFormOpen()
  const isSiteFormOpened = useSiteFormOpen()

  let content;
  if (isCompanyFormOpened && !isFieldFormOpened && !isSiteFormOpened) {
    content = <CreateCompany />
  } else if (!isCompanyFormOpened && isFieldFormOpened  && !isSiteFormOpened) {
    content = <CreateField />
  } else if (!isCompanyFormOpened && !isFieldFormOpened  && isSiteFormOpened) { 
    content = <CreateSite />
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
