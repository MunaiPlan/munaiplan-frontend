import {FC} from 'react'
import { useCompanyFormOpen, useDesignFormOpen, useFieldFormOpen, useSiteFormOpen, useWellBoreFormOpen, useWellFormOpen } from '../hooks/useForms'
import CreateCompany from '../components/forms/CreateCompany'
import CreateField from '../components/forms/CreateField'
import CreateSite from '../components/forms/CreateSite'
import CreateWell from '../components/forms/CreateWell'
import CreateWellBore from '../components/forms/CreateWellBore'
import CreateDesign from '../components/forms/CreateDesign'

const Home: FC = () => {
  const isCompanyFormOpened = useCompanyFormOpen()
  const isFieldFormOpened = useFieldFormOpen()
  const isSiteFormOpened = useSiteFormOpen()
  const isWellFormOpened = useWellFormOpen()
  const isWellBoreFormOpened = useWellBoreFormOpen()
  const isDesignFormOpened = useDesignFormOpen()

  let content;
  if (isCompanyFormOpened) {
    content = <CreateCompany />
  } else if (isFieldFormOpened) {
    content = <CreateField />
  } else if (isSiteFormOpened) { 
    content = <CreateSite />
  } else if (isWellFormOpened){
    content = <CreateWell />
  } else if (isWellBoreFormOpened) {
    content = <CreateWellBore />
  } else if (isDesignFormOpened) {
    content = <CreateDesign />
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
