import {FC, useState} from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { IField } from '../../types/types'
import { instance } from '../../api/axios.api';
import { toast } from 'react-toastify';
import { InputString } from '../textField';

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
  onSuccess?: () => void
}


const CreateCompany: FC<ICompanyForm> = ({type="post", id, prevName, prevDivision, prevGroup, prevRepresentative, prevAddress, prevPhone, setIsEdit, onSuccess}) => {

  const [nameCompany, setNameCompany] = useState(prevName)
  const [divisionCompany, setDivisionCompany] = useState(prevDivision)
  const [groupCompany, setGroupCompany] = useState(prevGroup)
  const [representativeCompany, setRepresentativeCompany] = useState(prevRepresentative)
  const [addressCompany, setAddressCompany] = useState(prevAddress)
  const [phoneCompany, setPhoneCompany] = useState(prevPhone)

  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<ICompanyForm>();

  const onSubmit: SubmitHandler<ICompanyForm> = (data) => {
    console.log(data)
  }

  const handleSubmit1  = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (type == 'post') {
        const newCompany = {
          name: nameCompany,
          division: divisionCompany,
          group: groupCompany,
          representative: representativeCompany,
          address: addressCompany,
          phone: phoneCompany
        };
        await instance.post('/api/v1/companies', newCompany)
        toast.success("Company was added")
        navigate("/")
      }
      if (type == 'put' && id) {
        const updatedCompany = {
          name: nameCompany,
          division: divisionCompany,
          group: groupCompany,
          representative: representativeCompany,
          address: addressCompany,
          phone: phoneCompany
        };
        await instance.put(`/api/v1/companies/${id}`, updatedCompany);
        toast.success("Компания была успешно обновлено");
        if (onSuccess) onSuccess();
        navigate('/')
      }
    } catch (e) {
      toast.error('Не удалось обновить компанию');
    }
  }
  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
        <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
          <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">{type == "post" ? "Создать новую компанию" : "Обновить эту компанию"}</h2>
            <form 
              className='grid gap-2' 
              onSubmit={handleSubmit(onSubmit)}
              noValidate 
            >
              {/* Name of company */}
              <InputString {...register("prevName")} label="Имя компании" id="divisionCompany" placeholder="Введите имя компании" value={nameCompany} setValue={setNameCompany}/>

              {/* Division of company */}
              <InputString {...register("prevDivision")} label="Дивизия компании" id="divisionCompany" placeholder="Введите дивизию компании" value={divisionCompany} setValue={setDivisionCompany}/>

              {/* Group of company */}
              <InputString {...register("prevGroup")} label="Группа компании" id="groupCompany" placeholder="Введите группу компании" value={groupCompany} setValue={setGroupCompany}/>

              {/* Representative of company */}
              <InputString {...register("prevRepresentative")} label="ФИО представителя" id="representativeCompany" placeholder="Введите ФИО представителя" value={representativeCompany} setValue={setRepresentativeCompany}/>

              {/* Address of company */}
              <InputString {...register("prevAddress")} label="Адрес компании" id="addressCompany" placeholder="Введите адрес компании" value={addressCompany} setValue={setAddressCompany}/>

              {/* Phone Number of company */}
              <InputString {...register("prevPhone")} label="Телефонный номер компании" id="phoneNumberCompany" placeholder="Введите телефонный номер компании" value={phoneCompany} setValue={setPhoneCompany}/>

              {/* Submit button */}
                <div className="flex flex-col items-center justify-between mt-3 mx-6">
                  <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base'>
                      {type === 'put' ? 'Обновить' : 'Создать'}
                  </button>
                  { type === 'put' && (<button className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" onClick={() => {
                      if(setIsEdit) {setIsEdit(false);}
                  }}>Закрыть</button>)}
                </div>
            </form>
      </div>
      </div>
  )
}

export default CreateCompany
