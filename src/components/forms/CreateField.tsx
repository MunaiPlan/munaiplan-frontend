import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { openFieldForm, createField } from '../../store/user/fieldSlice'
import { toast } from 'react-toastify'
import { fieldService } from '../../services/forms.service'
import { useNavigate } from 'react-router-dom'
import { ICompany, ISite } from '../../types/types'

const CreateField: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [nameField, setNameField] = useState("")
  const [descriptionField, setDescriptionField] = useState("")
  const [reductionLevelField, setReductionLevelField] = useState("")
  const [activeFieldUnitField, setActiveFieldUnitField] = useState("")
  const [fieldCompany, setFieldCompant] = useState<ICompany>()
  const [fieldSites, setFieldSites] = useState<ISite[]>([])

  const fieldCreateFormOpenHandler = () => {
    dispatch(openFieldForm())
  }

  const createFieldHandle = () => {
    dispatch(createField({
      companyId: "",
      name: nameField,
      description: descriptionField,
      reductionLevel: reductionLevelField,
      activeFieldUnit: activeFieldUnitField,
      company: fieldCompany,
      sites: fieldSites,
    }))
    toast.success('Field was successfully created')
    fieldCreateFormOpenHandler()
  }

  const createFieldHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = await fieldService.createField({
        companyId: "",
        name: nameField,
        description: descriptionField,
        reductionLevel: reductionLevelField,
        activeFieldUnit: activeFieldUnitField,
        company: fieldCompany,
        sites: fieldSites,
      })
      if (data){
        toast.success('Field was successfully created')
      }
    }
    catch (err: any) {
      const error = err.response?.data?.message || 'An error occurred during creating a field'
      toast.error(error.toString()) 
    }
  }

  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
          <div className="w-3/4 max-w-md justify-center items-center">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">Создать месторождение</h2>
          <form 
            // onSubmit={createFieldHandler}
            className="mb-7">
            {/* Name of field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="nameOfField">
                Имя месторождении
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="nameOfField"
                type="text"
                placeholder="Введите имя месторождении"
                onChange={(e) => setNameField(e.target.value)}
                required
              />
            </div>

            {/* Description of company */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="descriptionOfField">
                Описание месторождении
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="descriptionOfField"
                type="text"
                placeholder="Введите описание месторождении"
                onChange={(e) => setDescriptionField(e.target.value)}
                required
              />
            </div>

            {/* Reduction Level of company */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="reductionLevelOfField">
                Уровень редукции месторождении
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="reductionLevelOfField"
                type="text"
                placeholder="Введите уровень редукции месторождении"
                onChange={(e) => setReductionLevelField(e.target.value)}
                required
              />
            </div>

            {/* Active Field Unit of Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="activeFieldUnitOfField">
                Уровень редукции месторождении
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="activeFieldUnitOfField"
                type="text"
                placeholder="Введите активную полевую единицу месторождении"
                onChange={(e) => setActiveFieldUnitField(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={createFieldHandle}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" // type='submit'
              >Создать месторождение</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default CreateField
