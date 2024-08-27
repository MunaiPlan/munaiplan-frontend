import { ISite } from "../../types/types"
import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createCompany, openCompanyForm } from '../../store/user/companySlice'
import { toast } from 'react-toastify'
import { companyService } from '../../services/forms.service'
import { Form, useNavigate } from 'react-router-dom'
import { instance } from '../../api/axios.api'
import { ICompany, IField } from '../../types/types'

interface IFieldForm {
  type: "post" | "patch";
  id?: string;
  companyId: string;
  prevName: string
  prevDescription: string;
  prevReductionLevel: string;
  prevActiveFieldUnit: string;
  sites?: ISite[];
  setIsEdit?: (edit: boolean) => void;
}


const CreateField: FC<IFieldForm> = ({type, id, prevName, prevDescription, prevReductionLevel, prevActiveFieldUnit, setIsEdit}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [nameField, setNameField] = useState("")
  const [descriptionField, setDescriptionField] = useState("")
  const [reductionLevelField, setReductionLevelField] = useState("")
  const [activeFieldUnitField, setActiveFieldUnitField] = useState("")


  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
        <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
          <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">Создать новое месторождение</h2>
          <Form 
            className='grid gap-2' 
            method={type} 
            action='fields'
          >
            {/* Name of field */}
            <div className="input-wrapper">
              <label htmlFor="nameField">
                Имя месторождении
              </label>
              <input
                id="nameField"
                type="text"
                name='name'
                placeholder={type=="patch" ? prevName : "Введите имя месторождении"} 
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
                required
              />
              <input type="hidden" name="id" value={id}/>
            </div>

            {/* Description of field */}
            <div className="input-wrapper">
              <label htmlFor="descriptionField">
                Описание месторождении
              </label>
              <input
                id="descriptionField"
                type="text"
                name='description'
                placeholder={type=="patch" ? prevDescription : "Введите описание месторождении"} 
                value={descriptionField}
                onChange={(e) => setDescriptionField(e.target.value)}
                required
              />
            </div>

            {/* Reduction Level of Field */}
            <div className="input-wrapper">
              <label htmlFor="reductionLevelField">
                Уровень редукции месторождении
              </label>
              <input
                id="reductionLevelField"
                type="text"
                name='reductionLevel'
                placeholder={type=="patch" ? prevReductionLevel : "Введите Уровень редукции месторождении"} 
                value={reductionLevelField}
                onChange={(e) => setReductionLevelField(e.target.value)}
                required
              />
            </div>

            {/* Active Unit Field */}
            <div className="input-wrapper">
              <label htmlFor="activeFieldField">
                Активная полевая единица месторождении
              </label>
              <input
                id="activeFieldUnitOfField"
                type="text"
                name='activeFieldUnitOfField'
                placeholder={type=="patch" ? prevActiveFieldUnit : "Введите активную полевую единицу месторождении"} 
                onChange={(e) => setActiveFieldUnitField(e.target.value)}
                value={activeFieldUnitField}
                required
              />
            </div>
            {/* Submit button */}
            <div className="flex items-center justify-between mt-3 mx-6">
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

export default CreateField
