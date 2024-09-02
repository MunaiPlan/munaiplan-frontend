import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createDesign, openDesignForm } from '../../store/user/designSlice'
import { toast } from 'react-toastify'
import TextField from '../textField'

const CreateDesign: FC = () => {
  const dispatch = useAppDispatch()

  const [namePlanDesign, setNamePlanDesign] = useState("")
  const [stageDesign, setStageDesign] = useState("")
  const [versionDesign, setVersionDesign] = useState("")
  const [actualDateDesign, setActualDateDesign] = useState<Date>(new Date)
  const [createdAtDesign, setCreatedAtDesign] = useState<Date>(new Date)
  

  const designCreateFormOpenHandler = () => {
    dispatch(openDesignForm())
  }

  const createDesignHandle = () => {
    console.log("It works 1")
    dispatch(createDesign({
      id: "",
      planName: namePlanDesign,
      stage: stageDesign,
      version: versionDesign,
      actualDate: actualDateDesign,
      cases: [],
      trajectories: [],
      createdAt: createdAtDesign
    }))
    toast.success('Design was successfully created')
    designCreateFormOpenHandler()
  }


  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
        <div className="w-3/4 max-w-md justify-center items-center overflow-auto p-10">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">Создать дизайн</h2>
          <form 
            // onSubmit={createDesignHandler}
            className="mb-7">

            {/* Plan Name of design */}
            <TextField
                labelText="Имя плана дизайна"
                htmlForText="planNameWell"
                idText="planNameWell"
                placeholderText="Введите имя плана дизайна"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setNamePlanDesign(value);
                    }
                }}            
            />

            {/* Stage of design */}
            <TextField
                labelText="Этап дизайна"
                htmlForText="stageDesign"
                idText="stageDesign"
                placeholderText="Введите этап дизайна"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setStageDesign(value);
                        setActualDateDesign(new Date())
                        setCreatedAtDesign(new Date())
                    }
                }}
            />

            {/* Version of Design */}
            <TextField
                labelText="Версия дизайна"
                htmlForText="versionDesign"
                idText="versionDesign"
                placeholderText="Введите версию дизайна"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setVersionDesign(value);
                    }
                }}
            />

            <div className="flex items-center justify-between">
              <button
                onClick={createDesignHandle}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" // type='submit'
              >Создать дизайн</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default CreateDesign
