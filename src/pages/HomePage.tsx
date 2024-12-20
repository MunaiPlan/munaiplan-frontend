import {FC} from 'react'
import { useCaseFormOpen, useCompanyFormOpen, useDesignFormOpen, useFieldFormOpen, useSiteFormOpen, useTrajectoryFormOpen, useWellBoreFormOpen, useWellFormOpen } from '../hooks/useForms'
import CreateCompany from '../components/forms/CreateCompany'
import CreateSite from '../components/forms/CreateSite'
import CreateWell from '../components/forms/CreateWell'
import CreateWellBore from '../components/forms/CreateWellBore'
import CreateDesign from '../components/forms/CreateDesign'
import CreateCase from '../components/forms/CreateCase'
import { instance } from '../api/axios.api'
import { ICompany, IResponseLoader } from '../types/types'
import { useLoaderData } from 'react-router-dom'
import SideBar from '../components/SideBar'
import CreateField from '../components/forms/CreateField'
import CreateTraj from '../components/forms/CreateTrajectory'
import CreateTrajectory from '../components/forms/CreateTrajectory'

export const companiesLoader = async() => {
  try {
    const companies = await instance.get<ICompany[]>('/api/v1/companies');
    const data = { companies: companies.data };
    return data;
  } catch (error) {
    console.error('Failed to load companies:', error);
    return { companies: [] };  // Return an empty array if there's an error
  }
};


const Home: FC = () => {
  const isCompanyFormOpened = useCompanyFormOpen()
  const isFieldFormOpened = useFieldFormOpen()
  const isSiteFormOpened = useSiteFormOpen()
  const isWellFormOpened = useWellFormOpen()
  const isWellBoreFormOpened = useWellBoreFormOpen()
  const isDesignFormOpened = useDesignFormOpen()
  const isCaseFormOpened = useCaseFormOpen()
  const isTrajectoryFormOpened = useTrajectoryFormOpen()
  const { companies: initialCompanies = [] } = useLoaderData() as IResponseLoader || {};

  let content;
  if (isCompanyFormOpened) {
    content = <CreateCompany type={"post"} prevName={""} prevDivision={""} prevAddress={""} prevGroup={""} prevPhone={""} prevRepresentative={""}/>
  } else if (isFieldFormOpened) {
    content = <CreateField type={"post"} prevName={""} prevDescription={""} prevReductionLevel={""} prevActiveFieldUnit={""} companyId=''/>
  } else if (isSiteFormOpened) { 
    content = <CreateSite type={"post"} prevName={""} prevArea={0} prevAzimuth={0} prevBlock={""} fieldId='' prevCountry={""} prevRegion={""} prevState={""} />
  } else if (isWellFormOpened){
    content = <CreateWell type={"post"} prevName={""} prevDescription={""} prevLocation={""} prevType={""} prevActiveWellUnit={""} prevUniversalWellIdentifier={""} prevWellNumber={""} prevWorkingGroup={""} siteId='' />
  } else if (isWellBoreFormOpened) {
    content = <CreateWellBore type={"post"} prevName={""} prevAverageColumnRotationFrequency={0} prevAverageHookLead={0} prevAverageInLetFlow={0} prevAverageTorque={0} prevAverageWeightOnBit={0} wellId='' prevBottomLocation={""} prevDepth={0} prevDepthIntervalWellBore={0} prevDownStaticFriction={0} prevMaximumColumnRotationFrequency={0} prevMaximumTorque={0} prevMaximumWeightOnBit={0} prevRiserPressure={0}/>
  } else if (isDesignFormOpened) {
    content = <CreateDesign type={"post"} prevName={""} prevActualDate={new Date()} prevStage={""} prevVersion={""} wellBoreId=''/>
  } else if (isTrajectoryFormOpened) {
    content = <CreateTrajectory type={"post"} prevName={""} prevDescription={""} designId={""} prevHeader={[]} prevUnit={[]}/>
  } else if (isCaseFormOpened) {
    content = <CreateCase prevIsComplete={false} type={"post"} prevName={""} prevDescription={""} prevDrillDepth={0} prevPipeSize={0} trajectoryId={""}/>
  }
  
  else {
    content = <div className='w-screen flex flex-col justify-start items-center'>
      {initialCompanies.length > 0 ? 
      <div className='flex font-medium font-montserrat justify-center'>
        Тут ваши компании
        <ul>
          {initialCompanies.map((company, i) => <li className='' key={i}>
            {company.name}
          </li>)}
        </ul>
      </div> : "Создайте компнанию"}
    </div>
  }

  return (
    <div className="'h-screen w-full">
        <SideBar />
        <div className="flex h-screen">
            {content}    
        </div>
    </div>
  )
}

export default Home
