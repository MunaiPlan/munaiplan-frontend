import {FC, useState} from 'react'
import { toast } from 'react-toastify'
import { store } from '../../../store/store'
import { instance } from '../../../api/axios.api'
import { Form, useNavigate } from 'react-router-dom'
import { z } from 'zod'


interface IFluidForm {
  type: "put" | "post";
  id?: string;
  prevName: string;
  prevDescription: string;
  prevDensity: number;
  prev_fluid_base_type_id: string;
  prev_base_fluid_id: string;
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void
}


const CreateFluid: FC<IFluidForm> = ({type, id, prevName, prevDescription, prevDensity, prev_base_fluid_id, prev_fluid_base_type_id, setIsEdit, onSuccess, caseId}) => {
  const navigate = useNavigate()


  const [nameFluid, setNameFluid] = useState(prevName)
  const [descriptionFluid, setDescriptionFluid] = useState(prevDescription)
  const [densityFluid, setDensityFluid] = useState<number>(prevDensity)
  const [baseTypeFluid, setBaseTypeFluid] = useState<string>(prev_fluid_base_type_id)
  const [baseFluid, setBaseFluid] = useState<string>(prev_base_fluid_id)

  // const fluids = instance.get(`/api/v1/fluids?caseId=${caseId}`);
  const fluids = new Map<string, string>();
  fluids.set("c06eab84-120d-42ab-842c-a145200f378b", "first")
  fluids.set("c06eab84-120d-42ab-842c-a145200f378e", "second")
  fluids.set("c06eab84-120d-42ab-842c-a145200f378f", "third")

  const fluids_ids = ["c06eab84-120d-42ab-842c-a145200f378b", "c06eab84-120d-42ab-842c-a145200f378e", "c06eab84-120d-42ab-842c-a145200f378f"];

  const all_fluid_types = instance.get(`/api/v1/fluids/types`)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (type == 'post') {
      toast.success(baseFluid)
      const newFluid = {
        name: nameFluid,
        description: descriptionFluid,
        density: densityFluid,
        fluid_base_type_id: baseTypeFluid,
        base_fluid_id: baseFluid
      };
        
      try {
        await instance.post(`/api/v1/fluids?caseId=${caseId}`, newFluid);
        toast.success("Новый раствор был добавлен");
        navigate("/");
      } catch (error) {
        toast.error("Ошибка при добавлении раствора");
        console.error(error);
      }
    }
    if (type == 'put' && id) {
        const updatedFluid = {
            name: nameFluid,
            description: descriptionFluid,
            density: densityFluid,
            fluid_base_type_id: baseTypeFluid,
            base_fluid_id: baseFluid
          };
      try {
        await instance.put(`/api/v1/fluids/${id}`, updatedFluid);
        toast.success("Раствор был обновлен");
        navigate("/");
      } catch (error) {
        toast.error("Ошибка при обновлении раствора");
        console.error(error);
      }

    }
  }

  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
          <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">{type == "post" ? "Создать новый раствор" : "Обновить этот раствор"}</h2>
          <Form 
            onSubmit={handleSubmit} 
          >
              {/* Name of case */}
              <div className="input-wrapper">
                <label htmlFor="nameFluid">
                  Имя раствора
                </label>
                <input
                  id="nameFluid"
                  type="text"
                  name='name'
                  placeholder={type=="put" ? prevName : "Введите имя раствора"} 
                  value={nameFluid}
                  onChange={(e) => setNameFluid(e.target.value)}
                  required
                />
                <input type="hidden" name="id" value={id}/>
              </div>

              {/* Description */}
              <div className="input-wrapper col-span-2">
                <label htmlFor="descriptionFluid">Описание раствора</label>
                <input
                  id="descriptionFluid"
                  type="text"
                  value={descriptionFluid}
                  placeholder={type == "put" ? descriptionFluid : "Введите описание раствора"}
                  onChange={(e) => setDescriptionFluid(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrapper">
                <label htmlFor="densityFluid">Плотность раствора</label>
                <input
                  id="densityFluid"
                  type="number"
                  value={densityFluid || ''}
                  placeholder={type === "put" && densityFluid ? densityFluid.toString() : "Введите плотность раствора"} 
                  onChange={(e) => setDensityFluid(parseFloat(e.target.value))}
                  required
                />
              </div>

              <div className='w-full mt-4'>
                <select 
                  className='w-full rounded-md' 
                  name="fluids" 
                  id="fluids" 
                  onChange={(e) => {
                    setBaseFluid(e.target.value)
                    setBaseTypeFluid(e.target.value)
                  }}
                >
                  {fluids_ids.map((element: string) => (
                    <option key={element} value={element}>
                      {fluids.get(element)}
                    </option>
                  ))}
                </select>
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

export default CreateFluid;
