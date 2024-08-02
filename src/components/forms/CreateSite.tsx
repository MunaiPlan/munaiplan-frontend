import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { openSiteForm, createSite } from '../../store/user/siteSlice'
import { toast } from 'react-toastify'
import { siteService } from '../../services/forms.service'
import { IWell } from '../../types/types'

const CreateSite: FC = () => {
  const dispatch = useAppDispatch()

  const [nameSite, setNameSite] = useState("")
  const [areaSite, setAreaSite] = useState<number>(0)
  const [blockSite, setBlockSite] = useState("")
  const [azimuthSite, setAzimuthSite] = useState<number>(0)
  const [countrySite, setCountrySite] = useState("")
  const [stateSite, setStateSite] = useState("")
  const [regionSite, setRegionSite] = useState("")
  const [wellsSite, setWellsSite] = useState<IWell[]>([])

  const siteCreateFormOpenHandler = () => {
    dispatch(openSiteForm())
  }

  const createSiteHandle = () => {
    dispatch(createSite({
      id: "",
      name: nameSite,
      area: areaSite,
      block: blockSite,
      azimuth: azimuthSite,
      country: countrySite,
      state: stateSite,
      region: regionSite,
      wells: wellsSite,
    }))
    toast.success('Site was successfully created')
    siteCreateFormOpenHandler()
  }

  const createSiteHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = await siteService.createSite({
        id: "",
        name: nameSite,
        area: areaSite,
        block: blockSite,
        azimuth: azimuthSite,
        country: countrySite,
        state: stateSite,
        region: regionSite,
        wells: wellsSite,
      })
      if (data){
        toast.success('Site was successfully created')
      }
    }
    catch (err: any) {
      const error = err.response?.data?.message || 'An error occurred during creating a field'
      toast.error(error.toString()) 
    }
  }

  return (
    <div className='w-screen flex flex-col justify-center items-center overflow-auto'>  
        <div className="w-3/4 max-w-md justify-center items-center">
          <h2 className="text-3xl font-bold mt-16 mb-8 justify-center flex font-montserrat">Создать куст</h2>
          <form 
            // onSubmit={createSiteHandler}
            className="mb-7">
            {/* Name of site */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="nameOfSite">
                Имя месторождении
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="nameOfSite"
                type="text"
                placeholder="Введите имя куста"
                onChange={(e) => setNameSite(e.target.value)}
                required
              />
            </div>

            {/* Area of site */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="areaOfSite">
                Площадь куста
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="areaOfSite"
                type="text"
                placeholder="Введите площадь куста"
                onChange={(e) => setAreaSite(parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Block of site */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="blockOfSite">
                Блок куста
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="areaOfSite"
                type="text"
                placeholder="Введите уровень редукции месторождении"
                onChange={(e) => setBlockSite(e.target.value)}
                required
              />
            </div>

            {/* Azimuth of Site */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="azimuthOfSite">
                Азимут куста
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="azimuthOfSite"
                type="text"
                placeholder="Введите азимут куста"
                onChange={(e) => setAzimuthSite(parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Country of Site */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="countryOfSite">
                Страна куста
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="countryOfSite"
                type="text"
                placeholder="Введите страну куста"
                onChange={(e) => setCountrySite(e.target.value)}
                required
              />
            </div>

            {/* State of Site */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="siteOfSite">
                Штат куста
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="siteOfSite"
                type="text"
                placeholder="Введите штат куста"
                onChange={(e) => setStateSite(e.target.value)}
                required
              />
            </div>

            {/* Region of Site */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="regionOfSite">
                Регион куста
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="regionOfSite"
                type="text"
                placeholder="Введите регион куста"
                onChange={(e) => setRegionSite(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={createSiteHandle}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" // type='submit'
              >Создать куст</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default CreateSite
