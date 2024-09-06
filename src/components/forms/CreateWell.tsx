import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { Form, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { store } from '../../store/store';
import { IWellBore } from '../../types/types';

interface IWellForm {
  type: 'post' | 'put';
  id?: string;
  prevName: string;
  prevDescription: string;
  prevLocation: string;
  prevType: string;
  prevUniversalWellIdentifier: string;
  prevWellNumber: string;
  prevWorkingGroup: string;
  prevActiveWellUnit: string;
  wellbores?: IWellBore[];
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
  siteId: string | null;
}

const CreateWell: FC<IWellForm> = ({
  type,
  id,
  prevName = '',
  prevDescription = '',
  prevLocation = '',
  prevActiveWellUnit = '',
  prevType = '',
  prevUniversalWellIdentifier = '',
  prevWellNumber = '',
  prevWorkingGroup = '',
  setIsEdit,
  siteId,
}) => {
  const navigate = useNavigate();

  const [nameWell, setNameWell] = useState(prevName || '');
  const [descriptionWell, setDescriptionWell] = useState(prevDescription || '');
  const [locationWell, setLocationWell] = useState(prevLocation || '');
  const [typeWell, setTypeWell] = useState(prevType || '');
  const [universalWellIdentifier, setUniversalWellIdentifier] = useState(prevUniversalWellIdentifier || '');
  const [wellNumber, setWellNumber] = useState(prevWellNumber || '');
  const [workingGroupWell, setWorkingGroupWell] = useState(prevWorkingGroup || '');
  const [activeWellUnit, setActiveWellUnit] = useState(prevActiveWellUnit || '');

  const getSiteIdFromStore = (): string | null => {
    const state = store.getState();
    return state.well.siteId;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newWell = {
      name: nameWell,
      description: descriptionWell,
      location: locationWell,
      universal_well_identifier: universalWellIdentifier,
      type: typeWell,
      well_number: wellNumber,
      working_group: workingGroupWell,
      active_well_unit: activeWellUnit,
    };

    try {
      if (type === 'post') {
        siteId = getSiteIdFromStore();
        await instance.post(`/api/v1/wells/?siteId=${siteId}`, newWell);
        toast.success('Новая скважина была добавлена');
        navigate('/');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/wells/${id}`, newWell);
        toast.success('Скважина была обновлена');
        navigate('/');
      }
    } catch (error) {
      toast.error('Ошибка при добавлении/обновлении скважины');
      console.error(error);
    }
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">
          {type === 'post' ? 'Создать новую скважину' : 'Обновить скважину'}
        </h2>
        <Form className="grid gap-2" onSubmit={handleSubmit}>
          {/* Name of Well */}
          <div className="input-wrapper">
            <label htmlFor="nameWell">Имя скважины</label>
            <input
              id="nameWell"
              type="text"
              name="name"
              placeholder={type === 'put' ? prevName : 'Введите имя скважины'}
              value={nameWell}
              onChange={(e) => setNameWell(e.target.value)}
              required
            />
          </div>

          {/* Description of Well */}
          <div className="input-wrapper">
            <label htmlFor="descriptionWell">Описание скважины</label>
            <input
              id="descriptionWell"
              type="text"
              name="description"
              placeholder={type === 'put' ? prevDescription : 'Введите описание скважины'}
              value={descriptionWell}
              onChange={(e) => setDescriptionWell(e.target.value)}
              required
            />
          </div>

          {/* Location of Well */}
          <div className="input-wrapper">
            <label htmlFor="locationWell">Локация скважины</label>
            <input
              id="locationWell"
              type="text"
              name="locationWell"
              placeholder={type === 'put' ? prevLocation : 'Введите локацию скважины'}
              value={locationWell}
              onChange={(e) => setLocationWell(e.target.value)}
              required
            />
          </div>

          {/* Type of Well */}
          <div className="input-wrapper">
            <label htmlFor="typeWell">Тип скважины</label>
            <input
              id="typeWell"
              type="text"
              name="typeWell"
              placeholder={type === 'put' ? prevType : 'Введите тип скважины'}
              value={typeWell}
              onChange={(e) => setTypeWell(e.target.value)}
              required
            />
          </div>

          {/* Universal Well Identifier */}
          <div className="input-wrapper">
            <label htmlFor="universalWellIdentifier">Универсальный идентификатор скважины</label>
            <input
              id="universalWellIdentifier"
              type="text"
              name="universalWellIdentifier"
              placeholder={type === 'put' ? prevUniversalWellIdentifier : 'Введите универсальный идентификатор'}
              value={universalWellIdentifier}
              onChange={(e) => setUniversalWellIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Well Number */}
          <div className="input-wrapper">
            <label htmlFor="wellNumber">Номер скважины</label>
            <input
              id="wellNumber"
              type="text"
              name="wellNumber"
              placeholder={type === 'put' ? prevWellNumber : 'Введите номер скважины'}
              value={wellNumber}
              onChange={(e) => setWellNumber(e.target.value)}
              required
            />
          </div>

          {/* Working Group Well */}
          <div className="input-wrapper">
            <label htmlFor="workingGroupWell">Рабочая группа скважины</label>
            <input
              id="workingGroupWell"
              type="text"
              name="workingGroupWell"
              placeholder={type === 'put' ? prevWorkingGroup : 'Введите рабочую группу скважины'}
              value={workingGroupWell}
              onChange={(e) => setWorkingGroupWell(e.target.value)}
              required
            />
          </div>

          {/* Active Well Unit */}
          <div className="input-wrapper">
            <label htmlFor="activeWellUnit">Активная скважина</label>
            <input
              id="activeWellUnit"
              type="text"
              name="activeWellUnit"
              placeholder={type === 'put' ? prevActiveWellUnit : 'Введите активную скважину'}
              value={activeWellUnit}
              onChange={(e) => setActiveWellUnit(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button type="submit" className="w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base">
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            {type === 'put' && setIsEdit && (
              <button
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
                onClick={() => setIsEdit(false)}
              >
                Закрыть
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateWell;