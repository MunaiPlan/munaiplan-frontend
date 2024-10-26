import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { instance } from '../../../api/axios.api';
import { Form, useNavigate } from 'react-router-dom';
import { IFluidType } from '../../../types/types';

interface IFluidForm {
  type: 'put' | 'post';
  id?: string;
  prevName?: string;
  prevDescription?: string;
  prevDensity?: number;
  prev_fluid_base_type_id?: string;
  prev_base_fluid_id?: string;
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

const CreateFluid: FC<IFluidForm> = ({
  type,
  id,
  prevName,
  prevDescription,
  prevDensity,
  prev_base_fluid_id,
  prev_fluid_base_type_id,
  setIsEdit,
  onSuccess,
  caseId,
}) => {
  const [nameFluid, setNameFluid] = useState(prevName);
  const [descriptionFluid, setDescriptionFluid] = useState(prevDescription);
  const [densityFluid, setDensityFluid] = useState<number>(prevDensity ? prevDensity : 0);
  const [baseTypeFluid, setBaseTypeFluid] = useState<string>();
  const [baseFluid, setBaseFluid] = useState<string>();
  const [fluidTypes, setFluidTypes] = useState<Array<{ id: string; name: string }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFluidTypes = async () => {
      try {
        const response = await instance.get('/api/v1/fluids/types');
        setFluidTypes(response.data);
      } catch (error) {
        toast.error('Ошибка при получении типов растворов');
        console.error(error);
      }
    };

    fetchFluidTypes();
  }, [caseId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (type === 'post') {
      const newFluid = {
        case_id: caseId,
        name: nameFluid,
        description: descriptionFluid,
        density: densityFluid,
        fluid_base_type_id: baseTypeFluid,
        base_fluid_id: baseFluid,
      };

      try {
        await instance.post(`/api/v1/fluids?caseId=${caseId}`, newFluid);
        toast.success('Новый раствор был добавлен');
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        toast.error('Ошибка при добавлении раствора');
        console.error(error);
      }
    } else if (type === 'put' && id) {
      toast.success(id);
      const updatedFluid = {
        id: id,
        name: nameFluid,
        description: descriptionFluid,
        density: densityFluid,
        fluid_base_type_id: baseTypeFluid,
        base_fluid_id: baseFluid,
      };
      try {
        console.log(updatedFluid);
        await instance.put(`/api/v1/fluids/${id}`, updatedFluid);
        toast.success('Раствор был обновлен');
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        toast.error('Ошибка при обновлении раствора');
        console.error(error);
      }
    }
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">
          {type === 'post' ? 'Создать новый раствор' : 'Обновить этот раствор'}
        </h2>
        <Form onSubmit={handleSubmit}>
          {/* Name of case */}
          <div className="input-wrapper">
            <label htmlFor="nameFluid">Имя раствора</label>
            <input
              id="nameFluid"
              type="text"
              name="name"
              placeholder={type === 'put' ? prevName : 'Введите имя раствора'}
              value={nameFluid}
              onChange={(e) => setNameFluid(e.target.value)}
              required
            />
            <input type="hidden" name="id" value={id} />
          </div>

          {/* Description */}
          <div className="input-wrapper col-span-2">
            <label htmlFor="descriptionFluid">Описание раствора</label>
            <input
              id="descriptionFluid"
              type="text"
              value={descriptionFluid}
              placeholder={type === 'put' ? descriptionFluid : 'Введите описание раствора'}
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
              placeholder={type === 'put' && densityFluid ? densityFluid.toString() : 'Введите плотность раствора'}
              onChange={(e) => setDensityFluid(parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="w-full mt-4">
            <select
              className="w-full rounded-md"
              name="fluids"
              value={baseTypeFluid}
              id="fluids"
              onChange={(e) => {
                setBaseFluid(e.target.value);
                setBaseTypeFluid(e.target.value);
              }}
            >
              {fluidTypes.map((element) => (
                <option key={element.id} value={element.id}>
                  {element.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button
              type="submit"
              className="w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
            >
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
          </div>
        </Form>
        {/* "Закрыть" button outside the form */}
        {type === 'put' && (
          <button
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base mt-3"
            onClick={() => {
              if (onSuccess) {
                onSuccess();
              }
            }}
          >
            Закрыть
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateFluid;