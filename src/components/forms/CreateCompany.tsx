import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createCompany, openCompanyForm } from '../../store/user/companySlice'
import { toast } from 'react-toastify'
import { companyService } from '../../services/forms.service'
import { useNavigate } from 'react-router-dom'

const CreateCompany: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [nameCompany, setNameCompany] = useState("")
  const [divisionCompany, setDivisionCompany] = useState("")
  const [groupCompany, setGroupCompany] = useState("")
  const [representativeCompany, setRepresentativeCompany] = useState("")
  const [addressCompany, setAddressCompany] = useState("")
  const [phoneCompany, setPhoneCompany] = useState("")

  const companyCreateFormOpenHandler = () => {
    dispatch(openCompanyForm())
  }

  const createCompanyHandle = () => {
    console.log("It works 1")
    dispatch(createCompany({
      id: "",
      name: nameCompany,
      division: divisionCompany,
      group: groupCompany,
      representative: representativeCompany,
      address: addressCompany,
      phone: phoneCompany,
      fields: []
    }))
    toast.success('Company was successfully created')
    companyCreateFormOpenHandler()
  }

  const createCompanyHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = await companyService.createCompany({
        id: "",
        name: nameCompany,
        division: divisionCompany,
        group: groupCompany,
        representative: representativeCompany,
        address: addressCompany,
        phone: phoneCompany,
        fields: []
      })
      if (data){
        toast.success('Company was successfully created')
      }
    }
    catch (err: any) {
      const error = err.response?.data?.message || 'An error occurred during creating a company'
      toast.error(error.toString()) 
    }
  }

  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
          <div className="w-3/4 max-w-md justify-center items-center">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">Создать компанию</h2>
          <form 
            // onSubmit={createCompanyHandler}
            className="mb-7">
            {/* Name of company */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="nameCompany">
                Имя компании
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="nameCompany"
                type="text"
                placeholder="Введите имя компании"
                onChange={(e) => setNameCompany(e.target.value)}
                required
              />
            </div>

            {/* Division of company */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="divisionCompany">
                Дивизия компании
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="divisionCompany"
                type="text"
                placeholder="Введите дивизию компании"
                onChange={(e) => setDivisionCompany(e.target.value)}
                required
              />
            </div>

            {/* Group of company */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="groupCompany">
                Группа компании
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="groupCompany"
                type="text"
                placeholder="Введите группу компании"
                onChange={(e) => setGroupCompany(e.target.value)}
                required
              />
            </div>

            {/* Representative of company */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="representativeCompany">
                ФИО представителя
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="representativeCompany"
                type="text"
                placeholder="Введите ФИО представителя"
                onChange={(e) => setRepresentativeCompany(e.target.value)}
                required
              />
            </div>

            {/* Address of company */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="addressCompany">
                Адрес компании
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="addressCompany"
                type="text"
                placeholder="Введите адрес компании"
                onChange={(e) => setAddressCompany(e.target.value)}
                required
              />
            </div>

            {/* Phone Number of company */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="phoneNumberCompany">
                Телефонный номер компании
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="phoneNumberCompany"
                type="text"
                placeholder="Введите телефонный номер компании"
                onChange={(e) => setPhoneCompany(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={createCompanyHandle}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" // type='submit'
              >Создать компанию</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default CreateCompany
