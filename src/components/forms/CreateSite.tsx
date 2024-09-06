import {FC, useState} from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { IWell } from '../../types/types'
import { instance } from '../../api/axios.api';
import { toast } from 'react-toastify';
import { store } from '../../store/store';

interface ISiteForm {
  type: "post" | "put";
  id?: string;
  fieldId: string;
  prevName: string;
  prevArea: number;
  prevBlock: string;
  prevAzimuth: number;
  prevCountry: string;
  prevState: string;
  prevRegion: string;
  wells?: IWell[];
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void
}


const CreateSite: FC<ISiteForm> = ({type="post", id, prevName, prevArea, prevBlock, prevAzimuth, prevCountry, prevState, prevRegion, setIsEdit, fieldId}) => {

  const [nameSite, setNameSite] = useState(prevName)
  const [areaSite, setAreaSite] = useState(prevArea)
  const [blockSite, setBlockSite] = useState(prevName)
  const [azimuthSite, setAzimuthSite] = useState(prevArea)
  const [countrySite, setCountrySite] = useState(prevName)
  const [stateSite, setStateSite] = useState(prevState)
  const [regionSite, setRegionSite] = useState(prevRegion)

  const navigate = useNavigate()

  const getFieldIdFromStore = (): string | null => {
    const state = store.getState(); // Access the current state
    return state.site.fieldId; // Assuming your userSlice is named 'user' and stores the user info in 'user'
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (type == 'post') {
        const newSite = {
          name: nameSite,
          area: areaSite,
          block: blockSite,
          azimuth: azimuthSite,
          country: countrySite,
          state: stateSite,
          region: regionSite
        };
        try {
          const fieldId = getFieldIdFromStore()
          await instance.post(`/api/v1/sites/?fieldId=${fieldId}`, newSite)
          toast.success("Site was added")
          navigate("/")
        } catch (error) {
          toast.error("Ошибка при добавлении куста");
          console.error(error);
        }
      }
      if (type == 'put' && id) {
        const updatedSite = {
          name: nameSite,
          area: areaSite,
          block: blockSite,
          azimuth: azimuthSite,
          country: countrySite,
          state: stateSite,
          region: regionSite
        };
        await instance.put(`/api/v1/sites/${id}?fieldId=${fieldId}`, updatedSite);
        toast.success("Куст был успешно обновлен");
        navigate('/')
      }
    } catch (e) {
      toast.error('Не удалось обновить куст');
    }
  }
  return (
    <div className='w-screen flex flex-col justify-center items-center'>  
        <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
          <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">{type == "post" ? "Создать новый куст" : "Обновить этот куст"}</h2>
          <Form 
            className='grid gap-2' 
            onSubmit={handleSubmit} 
          >
            {/* Name of site */}
            <div className="input-wrapper">
              <label htmlFor="nameSite">
                Имя куста
              </label>
              <input
                id="nameSite"
                type="text"
                name='name'
                placeholder={type=="put" ? prevName : "Введите имя куста"} 
                value={nameSite}
                onChange={(e) => setNameSite(e.target.value)}
                required
              />
              <input type="hidden" name="id" value={id}/>
            </div>

            {/* Area of site */}
            <div className="input-wrapper">
              <label htmlFor="areaSite">
                Площадь куста
              </label>
              <input
                id="areaSite"
                type="text"
                name='area'
                value={areaSite}
                placeholder={type=="put" ? prevArea.toString() : "Введите площадь куста"} 
                onChange={(e) => setAreaSite(parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Block of site */}
            <div className="input-wrapper">
              <label htmlFor="blockSite">
                Блок куста
              </label>
              <input
                id="blockSite"
                type="text"
                name='block'
                placeholder={type=="put" ? prevBlock : "Введите блок куста"} 
                value={blockSite}
                onChange={(e) => setBlockSite(e.target.value)}
                required
              />
            </div>

            {/* Azimuth of site */}
            <div className="input-wrapper">
              <label htmlFor="azimuthSite">
                Азимут куста
              </label>
              <input
                id="azimuthSite"
                type="text"
                name='azimuth'
                value={azimuthSite}
                placeholder={type=="put" ? prevAzimuth.toString() : "Введите азимут куста"} 
                onChange={(e) => setAzimuthSite(parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Country of site */}
            <div className="input-wrapper">
              <label htmlFor="countrySite">
                Страна куста
              </label>
              <input
                id="countrySite"
                type="text"
                name='country'
                placeholder={type=="put" ? prevCountry : "Введите страну куста"} 
                value={countrySite}
                onChange={(e) => setCountrySite(e.target.value)}
                required
              />
            </div>

            {/* State of site */}
            <div className="input-wrapper">
              <label htmlFor="stateSite">
                Штат куста
              </label>
              <input
                id="stateSite"
                type="text"
                name='state'
                placeholder={type=="put" ? prevState : "Введите штат куста"} 
                value={stateSite}
                onChange={(e) => setStateSite(e.target.value)}
                required
              />
            </div>

            {/* Region of site */}
            <div className="input-wrapper">
              <label htmlFor="regionSite">
                Регион куста
              </label>
              <input
                id="regionSite"
                type="text"
                name='region'
                placeholder={type=="put" ? prevRegion : "Введите регион куста"} 
                value={regionSite}
                onChange={(e) => setRegionSite(e.target.value)}
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

export default CreateSite
