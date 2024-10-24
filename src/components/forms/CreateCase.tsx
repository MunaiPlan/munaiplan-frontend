import {FC, useState} from 'react'
import { useAppDispatch } from '../../store/hooks'
import { createCase, openCaseForm } from '../../store/user/caseSlice'
import { toast } from 'react-toastify'
import { store } from '../../store/store'
import { instance } from '../../api/axios.api'
import { Form, useNavigate } from 'react-router-dom'


interface ICaseForm {
  type: "put" | "post";
  id?: string;
  prevName: string;
  prevDescription: string;
  prevDrillDepth: number;
  prevPipeSize: number;
  prevIsComplete: boolean;
  trajectoryId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void
}

const CreateCase: FC<ICaseForm> = ({type, id, prevIsComplete, prevName, prevDescription, prevDrillDepth, prevPipeSize, trajectoryId, setIsEdit, onSuccess}) => {
  const navigate = useNavigate()


  const [nameCase, setNameCase] = useState(prevName)
  const [descriptionCase, setDescriptionCase] = useState(prevDescription)
  const [drillDepthCase, setDrillDepthCase] = useState<number>(prevDrillDepth)
  const [pipeSizeCase, setPipeSizeCase] = useState<number>(prevPipeSize)
  const [is_completeCase, setIsCompleteCase] = useState(prevIsComplete)
  

  const getTrajectoryIdFromStore = (): string | null => {
    const state = store.getState();
    return state.case.trajectoryId; 
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (type == 'post') {
      const newCase = {
        case_name: nameCase,
        case_description: descriptionCase,
        drill_depth: drillDepthCase,
        pipe_size: pipeSizeCase,
        is_complete: false
      };
        
      try {
        const trajectoryId = getTrajectoryIdFromStore()
        toast.success("ID: " + trajectoryId)
        const m = await instance.post(`/api/v1/cases?trajectoryId=${trajectoryId}`, newCase);
        console.log(m)
        toast.success("Новый кейс был добавлен");
        navigate("/");
      } catch (error) {
        toast.error("Ошибка при добавлении кейса");
        console.error(error);
      }
    }
    if (type == 'put' && id) {
      const updatedCase = {
        case_name: nameCase,
        case_description: descriptionCase,
        drill_depth: drillDepthCase,
        pipe_size: pipeSizeCase,
        is_complete: is_completeCase
      };
      try {
        await instance.put(`/api/v1/cases/${id}`, updatedCase);
        toast.success("Кейс был обновлен");
        navigate("/");
      } catch (error) {
        toast.error("Ошибка при обновлении кейса");
        console.error(error);
      }

    }
  }

  return (
    <div className='w-screen flex flex-col justify-center items-center '>  
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
          <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">{type == "post" ? "Создать новый кейс" : "Обновить этот кейс"}</h2>
          <Form 
            onSubmit={handleSubmit} 
          >

              {/* Name of case */}
              <div className="input-wrapper">
                <label htmlFor="nameCase">
                  Имя кейса
                </label>
                <input
                  id="nameCase"
                  type="text"
                  name='name'
                  placeholder={type=="put" ? prevName : "Введите имя кейса"} 
                  value={nameCase}
                  onChange={(e) => setNameCase(e.target.value)}
                  required
                />
                <input type="hidden" name="id" value={id}/>
              </div>

              {/* Description */}
              <div className="input-wrapper col-span-2">
                <label htmlFor="descriptionCase">Описание</label>
                <input
                  id="descriptionCase"
                  type="text"
                  value={descriptionCase}
                  placeholder={type == "put" ? descriptionCase : "Введите описание кейса"}
                  onChange={(e) => setDescriptionCase(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrapper">
                <label htmlFor="drillDepth">Буровая глубина</label>
                <input
                  id="drillDepth"
                  type="number"
                  value={drillDepthCase || ''}
                  placeholder={type === "put" && drillDepthCase ? drillDepthCase.toString() : "Введите буровую глубину кейса"} 
                  onChange={(e) => setDrillDepthCase(parseFloat(e.target.value))}
                  required
                />
              </div>

              <div className="input-wrapper">
                <label htmlFor="pipeSize">Размер трубы</label>
                <input
                  id="pipeSize"
                  type="number"
                  value={pipeSizeCase || ''}
                  placeholder={type === "put" && pipeSizeCase ? pipeSizeCase.toString() : "Введите размер трубы кейса"} 
                  onChange={(e) => setPipeSizeCase(parseFloat(e.target.value))}
                  required
                />
              </div>

              {/* Submit button */}
              <div className="flex flex-col items-center justify-between mt-3 mx-6">
                <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base'>
                    {type === 'put' ? 'Обновить' : 'Создать'}
                </button>
                { type === 'put' && (<button className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" onClick={() => {
                    if(setIsEdit) {setIsEdit(false);}
                }}>Закрыть</button>)}
            </div>
          </Form>
      </div>
    </div>
  )
}

export default CreateCase
