import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createCase, openCaseForm } from '../../store/user/caseSlice'
import { toast } from 'react-toastify'
import TextField from '../textField'

const CreateCase: FC = () => {
  const dispatch = useAppDispatch()

  const [nameCase, setNameCase] = useState("")
  const [descriptionCase, setDescriptionCase] = useState("")
  const [drillDepthCase, setDrillDepthCase] = useState<number>(0)
  const [pipeSizeCase, setPipeSizeCase] = useState<number>(0)
  const [createdAtCase, setCreatedAtCase] = useState<Date>(new Date)
  

  const caseCreateFormOpenHandler = () => {
    dispatch(openCaseForm())
  }

  const createCaseHandle = () => {
    console.log("It works 1")
    dispatch(createCase({
      id: "",
      caseName: nameCase,
      caseDescription: descriptionCase,
      drillDepth: drillDepthCase,
      pipeSize: pipeSizeCase,
      createdAt: createdAtCase
    }))
    toast.success('Case was successfully created')
    caseCreateFormOpenHandler()
  }

  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
        <div className="w-3/4 max-w-md justify-center items-center overflow-auto p-10">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">Создать кейс</h2>
          <form 
            // onSubmit={createCaseHandler}
            className="mb-7">

            {/* Name of Case */}
            <TextField
                labelText="Имя кейса"
                htmlForText="caseName"
                idText="caseName"
                placeholderText="Введите имя кейса"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setNameCase(value);
                    }
                }}            
            />

            {/* Description of Case */}
            <TextField
                labelText="Описание кейса"
                htmlForText="descriptionName"
                idText="descriptionName"
                placeholderText="Введите описание кейса"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setDescriptionCase(value);
                    }
                }}            
            />

            {/* Drill Depth of Case */}
            <TextField
                labelText="Глубина сверления кейса"
                htmlForText="drillDepthCase"
                idText="drillDepthCase"
                placeholderText="Введите глубину сверления кейса"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setDrillDepthCase(value);
                    }
                }}            
            />

            {/* Pipe Size of Case */}
            <TextField
                labelText="Размер насоса кейса"
                htmlForText="pipeSizeCase"
                idText="pipeSizeCase"
                placeholderText="Введите размер насоса кейса"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setPipeSizeCase(value);
                        setCreatedAtCase(new Date());
                    }
                }}            
            />

            <div className="flex items-center justify-between">
              <button
                onClick={createCaseHandle}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" // type='submit'
              >Создать кейс</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default CreateCase
