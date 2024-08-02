import {FC} from 'react'
import { useCompanyFormOpen, useFieldFormOpen, useSiteFormOpen, useWellFormOpen } from '../hooks/useForms'
import CreateCompany from '../components/forms/CreateCompany'
import CreateField from '../components/forms/CreateField'
import CreateSite from '../components/forms/CreateSite'
import CreateWell from '../components/forms/CreateWell'


const Home: FC = () => {
  const isCompanyFormOpened = useCompanyFormOpen()
  const isFieldFormOpened = useFieldFormOpen()
  const isSiteFormOpened = useSiteFormOpen()
  const isWellFormOpened = useWellFormOpen()

  let content;
  if (isCompanyFormOpened) {
    content = <CreateCompany />
  } else if (isFieldFormOpened) {
    content = <CreateField />
  } else if (isSiteFormOpened) { 
    content = <CreateSite />
  } else if (isWellFormOpened){
    content = <CreateWell />
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
