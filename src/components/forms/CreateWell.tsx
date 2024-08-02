import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createWell, openWellForm } from '../../store/user/wellSlice'
import { toast } from 'react-toastify'
import { wellService } from '../../services/forms.service'
import { useNavigate } from 'react-router-dom'
import { IWell, IWellBore } from '../../types/types'
import TextField from '../textField'

const CreateWell: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [nameWell, setNameWell] = useState("")
  const [descriptionWell, setDescriptionWell] = useState("")
  const [locationWell, setLocationWell] = useState("")
  const [universalWellIdentifierWell, setUniversalWellIdentifier] = useState("")
  const [typeWell, setTypeWell] = useState("")
  const [wellNumberWell, setWellNumberWell] = useState("")
  const [workingGroupWell, setWorkingGroupWell] = useState("")
  const [activeWellUnitWell, setActiveWellUnitWell] = useState("")
  const [createdAtWell, setCreatedAt] = useState<Date>(new Date)
  const [wellBoresWell, setWellBoresWell] = useState<IWellBore[]>([])
  

  const wellCreateFormOpenHandler = () => {
    dispatch(openWellForm())
  }

  const createWellHandle = () => {
    console.log("It works 1")
    dispatch(createWell({
      id: "",
      name: nameWell,
      description: descriptionWell,
      location: locationWell,
      universalWellIdentifier: universalWellIdentifierWell,
      type: typeWell,
      wellNumber: wellNumberWell,
      workingGroup: workingGroupWell,
      activeWellUnit: activeWellUnitWell,
      createdAt: createdAtWell,
      wellBores: wellBoresWell
    }))
    toast.success('Well was successfully created')
    wellCreateFormOpenHandler()
  }

  const createWellHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = await wellService.createWell({
        id: "",
        name: nameWell,
        description: descriptionWell,
        location: locationWell,
        universalWellIdentifier: universalWellIdentifierWell,
        type: typeWell,
        wellNumber: wellNumberWell,
        workingGroup: workingGroupWell,
        activeWellUnit: activeWellUnitWell,
        createdAt: createdAtWell,
        wellBores: wellBoresWell
      })
      if (data){
        toast.success('Well was successfully created')
      }
    }
    catch (err: any) {
      const error = err.response?.data?.message || 'An error occurred during creating a company'
      toast.error(error.toString()) 
    }
  }

  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
        <div className="w-3/4 max-w-md justify-center items-center overflow-auto p-10">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">Создать скважину</h2>
          <form 
            // onSubmit={createWellHandler}
            className="mb-7">

            {/* Name of well */}
            <TextField
                labelText="Имя скважины"
                htmlForText="nameWell"
                idText="nameWell"
                placeholderText="Введите имя скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setNameWell(value);
                    }
                }}            
            />

            {/* Description of well */}
            <TextField
                labelText="Описание скважины"
                htmlForText="descriptionWell"
                idText="descriptionWell"
                placeholderText="Введите описание скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setDescriptionWell(value);
                    }
                }}
            />

            {/* Location of well */}
            <TextField
                labelText="Локация скважины"
                htmlForText="locationWell"
                idText="locationWell"
                placeholderText="Введите локацию скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setLocationWell(value);
                    }
                }}
            />

            {/* Universal Identifier Of Well of well */}
            <TextField
                labelText="Универсальный идентификатор скважины"
                htmlForText="universalWellIdentifierWell"
                idText="universalWellIdentifierWell"
                placeholderText="Введите универсальный идентификатор скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setUniversalWellIdentifier(value);
                    }
                }}
            />

            {/* Type of well */}
            <TextField
                labelText="Тип скважины"
                htmlForText="typeWell"
                idText="typeWell"
                placeholderText="Введите тип скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setTypeWell(value);
                    }
                }}
            />

            {/* Number of well */}
            <TextField
                labelText="Номер скважины"
                htmlForText="numberWell"
                idText="numberWell"
                placeholderText="Введите номер скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setWellNumberWell(value);
                    }
                }}
            />

            {/* Working group of well */}
            <TextField
                labelText="Рабочая группа скважины"
                htmlForText="workingGroupWell"
                idText="workingGroupWell"
                placeholderText="Введите рабочую группу скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setWorkingGroupWell(value);
                    }
                }}
            />

            {/* Active Well Unit */}
            <TextField
                labelText="Активная скважина"
                htmlForText="activeUnitWell"
                idText="workingGroupWell"
                placeholderText="Введите рабочую группу скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setActiveWellUnitWell(value);
                    }
                }}
            />
            
            <div className="flex items-center justify-between">
              <button
                onClick={createWellHandle}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" // type='submit'
              >Создать скважину</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default CreateWell
