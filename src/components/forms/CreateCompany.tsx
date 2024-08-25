import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createCompany, openCompanyForm } from '../../store/user/companySlice'
import { toast } from 'react-toastify'
import { companyService } from '../../services/forms.service'
import { Form, useNavigate } from 'react-router-dom'
import { instance } from '../../api/axios.api'
import { ICompany, IField } from '../../types/types'

interface ICompanyForm {
  type: "post" | "patch";
  id?: number;
  prevName: string;
  prevDivision: string;
  prevGroup: string;
  prevRepresentative: string;
  prevAddress: string;
  prevPhone: string;
  fields?: IField[];
  setIsEdit?: (edit: boolean) => void;
}


const CreateCompany: FC<ICompanyForm> = ({type, id, prevName, prevDivision, prevGroup, prevRepresentative, prevAddress, prevPhone, fields, setIsEdit}) => {
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

  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
          <div className="w-3/4 max-w-md justify-center items-center bg-gray-200 rounded-lg p-5 m-5">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">Создать компанию</h2>
          <Form 
            className='grid gap-2' 
            method={type} 
            action='/companies'
          >
            {/* Name of company */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor="nameCompany">
                Имя компании
              </label>
              <input
                className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
                id="nameCompany"
                type="text"
                placeholder={type=="patch" ? prevName : "Введите имя компании"} 
                value={nameCompany}
                onChange={(e) => setNameCompany(e.target.value)}
                required
              />
              <input type="hidden" name="id" value={id}/>
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
                placeholder={type=="patch" ? prevDivision : "Введите дивизию компании"} 
                value={divisionCompany}
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
                placeholder={type=="patch" ? prevGroup : "Введите группу компании"} 
                value={groupCompany}
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
                placeholder={type=="patch" ? prevRepresentative : "Введите ФИО представителя"} 
                onChange={(e) => setRepresentativeCompany(e.target.value)}
                value={representativeCompany}
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
                placeholder={type=="patch" ? prevAddress : "Введите адрес компании"} 
                value={addressCompany}
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
                placeholder={type=="patch" ? prevPhone : "Введите телефонный номер компании"} 
                value={phoneCompany}
                onChange={(e) => setPhoneCompany(e.target.value)}
                required
              />
            </div>
            {/* Submit button */}
            <div className="flex items-center justify-between">
                <button type="submit" className='w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base'>
                    {type === 'patch' ? 'Обновить' : 'Создать'}
                </button>
                { type === 'patch' && (<button className="btn btn-red" onClick={() => {
                    if(setIsEdit) {setIsEdit(false);}
                }}>Close</button>)}
            </div>
          </Form>
      </div>
    </div>
  )
}

export default CreateCompany
