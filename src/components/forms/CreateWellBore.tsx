import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createWellBore, openWellBoreForm } from '../../store/user/wellBoreSlice'
import { toast } from 'react-toastify'
import { wellBoreService } from '../../services/forms.service'
import { useNavigate } from 'react-router-dom'
import { IDesign, IWellBore } from '../../types/types'
import TextField from '../textField'

const CreateWellBore: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [nameWelBore, setNameWellBore] = useState("")
  const [bottomLocationWellBore, setBottomLocationWellBore] = useState("")
  const [wellBoreDepthWellBore, setWellBoreDepthWellBore] = useState<number>(0)
  const [averageHookLeadWellBore, setAverageHookLeadWellBore] = useState<number>(0)
  const [riserPressureWellBore, setRiserPressureWellBore] = useState<number>(0)
  const [averageInLetFlowWellBore, setAverageInLetFlow] = useState<number>(0)
  const [averageColumnRotationFrequencyWellBore, setAverageColumnRotationFrequencyWellBore] = useState<number>(0)
  const [maximumColumnRotationFrequencyWellBore, setMaximumColumnRotationFrequencyWellBore] = useState<number>(0)
  const [averageWeightOnBitWellBore, setAverageWeightOnBitWellBore] = useState<number>(0)
  const [maximumWeightOnBitWellBore, setMaximumWeightOnBitWellBore] = useState<number>(0)
  const [averageTorqueWellBore, setAverageTorqueWellBore] = useState<number>(0)
  const [maximumTorqueWellBore, setMaximumTorqueWellBore] = useState<number>(0)
  const [downStaticFrictionWellBore, setDownStaticFrictionWellBore] = useState<number>(0)
  const [depthIntervalWellBore, setDepthIntervalWellBore] = useState<number>(0)
  const [wellBoresDesigns, setWellBoresDesigns] = useState<IDesign[]>([])
  const [createdAtWellBore, setCreatedAtWellBore] = useState<Date>(new Date())
  

  const wellBoreCreateFormOpenHandler = () => {
    dispatch(openWellBoreForm())
  }

  const createWellBoreHandle = () => {
    console.log("It works 1")
    dispatch(createWellBore({
      id: "",
      name: nameWelBore,
      bottomLocation: bottomLocationWellBore,
      wellBoreDepth: wellBoreDepthWellBore,
      averageHookLead: averageHookLeadWellBore,
      riserPressure: riserPressureWellBore,
      averageInLetFlow: averageInLetFlowWellBore,
      averageColumnRotationFrequency: averageColumnRotationFrequencyWellBore,
      maximumColumnRotationFrequency: maximumColumnRotationFrequencyWellBore,
      averageWeightOnBit: averageWeightOnBitWellBore,
      maximumWeightOnBit: maximumWeightOnBitWellBore,
      averageTorque: averageTorqueWellBore,
      maximumTorque: maximumTorqueWellBore,
      downStaticFriction: downStaticFrictionWellBore,
      depthInterval: depthIntervalWellBore,
      designs: wellBoresDesigns,
      createdAt: createdAtWellBore
    }))
    toast.success('WellBore was successfully created')
    wellBoreCreateFormOpenHandler()
  }

  const createWellBoreHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = await wellBoreService.createWellBore({
        id: "",
        name: nameWelBore,
        bottomLocation: bottomLocationWellBore,
        wellBoreDepth: wellBoreDepthWellBore,
        averageHookLead: averageHookLeadWellBore,
        riserPressure: riserPressureWellBore,
        averageInLetFlow: averageInLetFlowWellBore,
        averageColumnRotationFrequency: averageColumnRotationFrequencyWellBore,
        maximumColumnRotationFrequency: maximumColumnRotationFrequencyWellBore,
        averageWeightOnBit: averageWeightOnBitWellBore,
        maximumWeightOnBit: maximumWeightOnBitWellBore,
        averageTorque: averageTorqueWellBore,
        maximumTorque: maximumTorqueWellBore,
        downStaticFriction: downStaticFrictionWellBore,
        depthInterval: depthIntervalWellBore,
        designs: wellBoresDesigns,
        createdAt: createdAtWellBore
      })
      if (data){
        toast.success('WellBore was successfully created')
      }
    }
    catch (err: any) {
      const error = err.response?.data?.message || 'An error occurred during creating a wellbore'
      toast.error(error.toString()) 
    }
  }

  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
        <div className="w-screen max-w-md justify-center items-center overflow-auto p-10">
          <h2 className="text-3xl font-bold mb-8 justify-center flex font-montserrat">Создать ствол скважины</h2>
          <form 
            // onSubmit={createWellBoreHandler}
            className="mb-7">

            {/* Name of wellBore */}
            <TextField
                labelText="Имя ствола скважины"
                htmlForText="nameWellBore"
                idText="nameWellBore"
                placeholderText="Введите имя ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setNameWellBore(value);
                    }
                }}            
            />

            {/* Bottom location of wellBore */}
            <TextField
                labelText="Местоположение дна ствола скважины"
                htmlForText="bottomLocationWellBore"
                idText="bottomLocationWellBore"
                placeholderText="Введите местоположение дна ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'string') {
                        setBottomLocationWellBore(value);
                    }
                }}
            />

            {/* Depth of wellBore */}
            <TextField
                labelText="Глубина ствола скважины"
                htmlForText="depthWellBore"
                idText="depthWellBore"
                placeholderText="Введите глубину ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setWellBoreDepthWellBore(value);
                    }
                }}
            />

            {/* Average hook lead Of WellBore */}
            <TextField
                labelText="Среднее натяжение крюка ствола скважины"
                htmlForText="averageHookLeadWellBore"
                idText="averageHookLeadWellBore"
                placeholderText="Введите среднее натяжение крюка ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setAverageHookLeadWellBore(value);
                    }
                }}
            />

            {/* Riser pressure of wellBore */}
            <TextField
                labelText="Давление в колонне ствола скважины"
                htmlForText="riserPressureWellBore"
                idText="riserPressureWellBore"
                placeholderText="Введите давление в колонне ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setRiserPressureWellBore(value);
                    }
                }}
            />

            {/* Average In Let Flow WellBore */}
            <TextField
                labelText="Средний входной поток ствола скважины"
                htmlForText="averageInLetFlowWellBore"
                idText="averageInLetFlowWellBore"
                placeholderText="Введите Средний входной поток ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setAverageInLetFlow(value);
                    }
                }}
            />

            {/* Average Column Rotation Frequency of WellBore */}
            <TextField
                labelText="Средняя частота вращения колонны ствола скважины"
                htmlForText="averageInLetFlowWellBore"
                idText="averageInLetFlowWellBore"
                placeholderText="Введите среднюю частоту вращения колонны ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setAverageColumnRotationFrequencyWellBore(value);
                    }
                }}
            />

            {/* Maximum Column Rotation Frequency of WellBore */}
            <TextField
                labelText="Максимальная частота вращения колонны ствола скважины"
                htmlForText="maximumInLetFlowWellBore"
                idText="maximumInLetFlowWellBore"
                placeholderText="Введите максимальную частоту вращения колонны ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setMaximumColumnRotationFrequencyWellBore(value);
                    }
                }}
            />

            {/* Average Weight On Bit WellBore */}
            <TextField
                labelText="Средняя нагрузка на долото ствола скважины"
                htmlForText="averageWeightOnBitWellBore"
                idText="averageWeightOnBitWellBore"
                placeholderText="Введите cреднюю нагрузку на долото ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setAverageWeightOnBitWellBore(value);
                    }
                }}
            />

            {/* Maximum Weight On Bit WellBore */}
            <TextField
                labelText="Максимальная нагрузка на долото ствола скважины"
                htmlForText="maximumWeightOnBitWellBore"
                idText="maximumWeightOnBitWellBore"
                placeholderText="Введите максимальную нагрузку на долото ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setMaximumWeightOnBitWellBore(value);
                    }
                }}
            />

            {/* Average Torque of WellBore */}
            <TextField
                labelText="Средний крутящий момент ствола скважины"
                htmlForText="averageTorqueWellBore"
                idText="averageTorqueWellBore"
                placeholderText="Введите средний крутящий момент ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setAverageTorqueWellBore(value);
                    }
                }}
            />

            {/* Maximum Torque of WellBore */}
            <TextField
                labelText="Максимальный крутящий момент ствола скважины"
                htmlForText="maximumTorqueWellBore"
                idText="maximumTorqueWellBore"
                placeholderText="Введите максимальный крутящий момент ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setMaximumTorqueWellBore(value);
                    }
                }}
            />

            {/* Down Static Friction of WellBore */}
            <TextField
                labelText="Нижнее статическое трение ствола скважины"
                htmlForText="downStaticFrictionWellBore"
                idText="downStaticFrictionWellBore"
                placeholderText="Введите нижнее статическое трение ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setDownStaticFrictionWellBore(value);
                    }
                }}
            />

            {/* Depth Interval of WellBore */}
            <TextField
                labelText="Интервал глубины ствола скважины"
                htmlForText="depthIntervalWellBore"
                idText="depthIntervalWellBore"
                placeholderText="Введите интервал глубины ствола скважины"
                onChangeFunction={(value) => {
                    if (typeof value === 'number') {
                        setDepthIntervalWellBore(value);
                    }
                }}
            />
            
            <div className="flex items-center justify-between">
              <button
                onClick={createWellBoreHandle}
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" // type='submit'
              >Создать ствол скважины</button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default CreateWellBore
