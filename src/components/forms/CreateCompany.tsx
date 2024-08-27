import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createCompany, openCompanyForm } from '../../store/user/companySlice'
import { Form, useNavigate } from 'react-router-dom'
import { ICompany, IField } from '../../types/types'

interface ICompanyForm {
  type: "post" | "put";
  id?: string;
  prevName: string;
  prevDivision: string;
  prevGroup: string;
  prevRepresentative: string;
  prevAddress: string;
  prevPhone: string;
  fields?: IField[];
  setIsEdit?: (edit: boolean) => void;
}


const CreateCompany: FC<ICompanyForm> = ({type="post", id, prevName, prevDivision, prevGroup, prevRepresentative, prevAddress, prevPhone, fields, setIsEdit}) => {
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
        <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
          <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">Создать новую компанию</h2>
          <Form 
            className='grid gap-2' 
            method={type} 
            action="/"
          >
            {/* Name of company */}
            <div className="input-wrapper">
              <label htmlFor="nameCompany">
                Имя компании
              </label>
              <input
                id="nameCompany"
                type="text"
                name='name'
                placeholder={type=="put" ? prevName : "Введите имя компании"} 
                value={type=="put" ? prevName : nameCompany}
                onChange={(e) => setNameCompany(e.target.value)}
                required
              />
              <input type="hidden" name="id" value={id}/>
            </div>

            {/* Division of company */}
            <div className="input-wrapper">
              <label htmlFor="divisionCompany">
                Дивизия компании
              </label>
              <input
                id="divisionCompany"
                type="text"
                name='division'
                placeholder={type=="put" ? prevDivision : "Введите дивизию компании"} 
                value={type=="put" ? prevDivision : divisionCompany}
                onChange={(e) => setDivisionCompany(e.target.value)}
                required
              />
            </div>

            {/* Group of company */}
            <div className="input-wrapper">
              <label htmlFor="groupCompany">
                Группа компании
              </label>
              <input
                id="groupCompany"
                type="text"
                name='group'
                placeholder={type=="put" ? prevGroup : "Введите группу компании"} 
                value={type=="put" ? prevGroup : groupCompany}
                onChange={(e) => setGroupCompany(e.target.value)}
                required
              />
            </div>

            {/* Representative of company */}
            <div className="input-wrapper">
              <label htmlFor="representativeCompany">
                ФИО представителя
              </label>
              <input
                id="representativeCompany"
                type="text"
                name='representative'
                placeholder={type=="put" ? prevRepresentative : "Введите ФИО представителя"} 
                onChange={(e) => setRepresentativeCompany(e.target.value)}
                value={type=="put" ? prevRepresentative : representativeCompany}
                required
              />
            </div>

            {/* Address of company */}
            <div className="input-wrapper">
              <label htmlFor="addressCompany">
                Адрес компании
              </label>
              <input
                id="addressCompany"
                type="text"
                name='address'
                placeholder={type=="put" ? prevAddress : "Введите адрес компании"} 
                value={type=="put" ? prevAddress : addressCompany}
                onChange={(e) => setAddressCompany(e.target.value)}
                required
              />
            </div>

            {/* Phone Number of company */}
            <div className="input-wrapper">
              <label htmlFor="phoneNumberCompany">
                Телефонный номер компании
              </label>
              <input
                id="phoneNumberCompany"
                type="text"
                name='phone'
                placeholder={type=="put" ? prevPhone : "Введите телефонный номер компании"} 
                value={type=="put" ? prevPhone : phoneCompany}
                onChange={(e) => setPhoneCompany(e.target.value)}
                required
              />
            </div>
            {/* Submit button */}
            <div className="flex items-center justify-between mt-3 mx-6">
                <button type="submit" className='w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base'>
                    {type === 'put' ? 'Обновить' : 'Создать'}
                </button>
                { type === 'put' && (<button className="btn btn-red" onClick={() => {
                    if(setIsEdit) {setIsEdit(false);}
                }}>Close</button>)}
            </div>
          </Form>
      </div>
    </div>
  )
}

export default CreateCompany
