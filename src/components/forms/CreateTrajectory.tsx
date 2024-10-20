import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { instance } from '../../api/axios.api';
import { ITrajectoryHeader, ITrajectoryUnit } from '../../types/types';
import { store } from '../../store/store';

// Define the Zod schema for the trajectory units
const unitSchema = z.object({
  md: z.number().positive("MD must be a positive number").nullable(),
  incl: z.number().positive("Inclination must be a positive number").nullable(),
  azim: z.number().positive("Azimuth must be a positive number").nullable(),
  sub_sea: z.number().positive("Sub-Sea must be a positive number").nullable(),
  tvd: z.number().positive("TVD must be a positive number").nullable(),
  local_n_coord: z.number().positive("Local North Coord must be a positive number").nullable(),
  local_e_coord: z.number().positive("Local East Coord must be a positive number").nullable(),
  global_n_coord: z.number().positive("Global North Coord must be a positive number").nullable(),
  global_e_coord: z.number().positive("Global East Coord must be a positive number").nullable(),
  dogleg: z.number().positive("Dogleg must be a positive number").nullable(),
  vertical_section: z.number().positive("Vertical Section must be a positive number").nullable()
});

// Define the Zod schema for the trajectory headers
const headerSchema = z.object({
  customer: z.string().min(1, "Customer is required").nullable(),
  project: z.string().min(1, "Project is required").nullable(),
  profile: z.string().min(1, "Profile Type is required").nullable(),
  field: z.string().min(1, "Field is required").nullable(),
  your_ref: z.string().min(1, "Your Ref is required").nullable(),
  structure: z.string().min(1, "Structure is required").nullable(),
  job_number: z.string().min(1, "Job Number is required").nullable(),
  wellhead: z.string().min(1, "Wellhead is required").nullable(),
  kelly_bushing_elev: z.number().positive("Kelly Bushing Elev must be a positive number").nullable(),
});

// Define the Zod schema for the main form
const trajectorySchema = z.object({
  name_trajectory: z.string().min(1, "Trajectory name is required"),
  description_trajectory: z.string().min(1, "Description is required"),
  headers: z.array(headerSchema).min(1, "At least one header is required"),
  units: z.array(unitSchema).min(1, "At least one trajectory unit is required")
});

// TypeScript type inference from Zod schema
type FormData = z.infer<typeof trajectorySchema>;

interface ITrajcetoryForm {
  type: "post" | "put";
  id?: string;
  designId: string;
  prevName: string;
  prevDescription: string;
  prevHeader: ITrajectoryHeader[];
  prevUnit: ITrajectoryUnit[];
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

// The form component
const CreateTrajectory: FC<ITrajcetoryForm> = ({
  type = 'post',
  id,
  designId,
  prevName,
  prevDescription,
  prevHeader,
  prevUnit,
  setIsEdit,
  onSuccess
}) => {
  const navigate = useNavigate();

  // Initialize the form with react-hook-form and zodResolver
  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(trajectorySchema),
    defaultValues: {
      name_trajectory: prevName || '',
      description_trajectory: prevDescription || '',
      headers: prevHeader ? prevHeader : [{}], 
      units: prevUnit ? prevUnit : [{}], 
    }
  });

  // useFieldArray to dynamically manage the trajectory units
  const { fields: unitFields, append: appendUnit, remove: removeUnit } = useFieldArray({
    control,
    name: 'units'
  });

  // useFieldArray to manage trajectory headers
  const { fields: headerFields, append: appendHeader, remove: removeHeader } = useFieldArray({
    control,
    name: 'headers'
  });

  const getDesignIdFromStore = (): string => {
    const state = store.getState();
    return state.trajectory.designId;
  };
  // Handle form submission
  const onSubmit = async (data: FormData) => {
    designId = getDesignIdFromStore();
    toast.success(designId)
    try {
      const newTrajectory = {
        name: data.name_trajectory,
        description: data.description_trajectory,
        headers: data.headers,
        units: data.units,
      };

      if (type === 'post') {
        await instance.post(`/api/v1/trajectories/?designId=${designId}`, newTrajectory);
        toast.success('Trajectory was added');
        navigate('/');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/trajectories/${id}`, newTrajectory);
        toast.success('Trajectory was updated');
        navigate('/');
      }

      onSuccess && onSuccess();
    } catch (error) {
      toast.error('Error while processing trajectory');
      console.error(error);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center overflow-y-auto">
      <div className="w-full max-w-2xl justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto overflow-y-auto">
        <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">
          {type === 'post' ? 'Create New Trajectory' : 'Update Trajectory'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-x-2">
          
          {/* Trajectory Name */}
          <div className="input-wrapper col-span-2">
            <label htmlFor="name_trajectory">Имя траектории</label>
            <input
              {...register('name_trajectory')}
              type="text"
              placeholder="Введите имя траектории"
            />
            {errors.name_trajectory && <p>{errors.name_trajectory.message}</p>}
          </div>

          {/* Description */}
          <div className="input-wrapper col-span-2">
            <label htmlFor="description_trajectory">Описание</label>
            <input
              {...register('description_trajectory')}
              type="text"
              placeholder="Введите описание траектории"
            />
            {errors.description_trajectory && <p>{errors.description_trajectory.message}</p>}
          </div>

          {/* Trajectory Headers */}
          {headerFields.map((field, index) => (
            <div key={field.id} className="input-wrapper col-span-2">
              <h3>Header {index + 1}</h3>
              
              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.customer`}>Клиент</label>
                <input
                  {...register(`headers.${index}.customer`)}
                  type="text"
                  placeholder="Введите клиента"
                />
                {errors.headers?.[index]?.customer && <p>{errors.headers[index]?.customer?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.project`}>Проект</label>
                <input
                  {...register(`headers.${index}.project`)}
                  type="text"
                  placeholder="Введите проект"
                />
                {errors.headers?.[index]?.project && <p>{errors.headers[index]?.project?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.profile`}>Профиль</label>
                <input
                  {...register(`headers.${index}.profile`)}
                  type="text"
                  placeholder="Введите тип профиля"
                />
                {errors.headers?.[index]?.profile && <p>{errors.headers[index]?.profile?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.field`}>Поле</label>
                <input
                  {...register(`headers.${index}.field`)}
                  type="text"
                  placeholder="Введите поле"
                />
                {errors.headers?.[index]?.field && <p>{errors.headers[index]?.field?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.your_ref`}>Ваш референс</label>
                <input
                  {...register(`headers.${index}.your_ref`)}
                  type="text"
                  placeholder="Введите референс"
                />
                {errors.headers?.[index]?.your_ref && <p>{errors.headers[index]?.your_ref?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.structure`}>Структура</label>
                <input
                  {...register(`headers.${index}.structure`)}
                  type="text"
                  placeholder="Введите структуру"
                />
                {errors.headers?.[index]?.structure && <p>{errors.headers[index]?.structure?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.job_number`}>Номер работы</label>
                <input
                  {...register(`headers.${index}.job_number`)}
                  type="text"
                  placeholder="Введите номер работы"
                />
                {errors.headers?.[index]?.job_number && <p>{errors.headers[index]?.job_number?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.wellhead`}>Устье</label>
                <input
                  {...register(`headers.${index}.wellhead`)}
                  type="text"
                  placeholder="Введите устье"
                />
                {errors.headers?.[index]?.wellhead && <p>{errors.headers[index]?.wellhead?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`headers.${index}.kelly_bushing_elev`}>Высота Kelly Bushing</label>
                <input
                  {...register(`headers.${index}.kelly_bushing_elev`, {
                    setValueAs: (value) => Number(value),
                  })}
                  type="number"
                  placeholder="Введите высоту Kelly Bushing"
                />
                {errors.headers?.[index]?.kelly_bushing_elev && <p>{errors.headers[index]?.kelly_bushing_elev?.message}</p>}
              </div>

              <button type="button" onClick={() => removeHeader(index)}>Удалить заголовок</button>
            </div>
          ))}

          <button type="button" onClick={() => appendHeader({
            customer: null,
            project: null,
            profile: null,
            field: null,
            your_ref: null,
            structure: null,
            job_number: null,
            wellhead: null,
            kelly_bushing_elev: null
          })}>Добавить заголовок</button>

          {/* Trajectory Units */}
          {unitFields.map((field, index) => (
            <div key={field.id} className="input-wrapper col-span-2">
              <h3>Единица {index + 1}</h3>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.md`}>MD</label>
                <input
                  {...register(`units.${index}.md`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="MD"
                />
                {errors.units?.[index]?.md && <p>{errors.units[index]?.md?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.incl`}>Уклон</label>
                <input
                  {...register(`units.${index}.incl`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Введите уклон"
                />
                {errors.units?.[index]?.incl && <p>{errors.units[index]?.incl?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.azim`}>Азимут</label>
                <input
                  {...register(`units.${index}.azim`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Введите Азимут"
                />
                {errors.units?.[index]?.azim && <p>{errors.units[index]?.azim?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.sub_sea`}>Под уровнем моря</label>
                <input
                  {...register(`units.${index}.sub_sea`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Введите под уровнем моря"
                />
                {errors.units?.[index]?.sub_sea && <p>{errors.units[index]?.sub_sea?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.tvd`}>TVD</label>
                <input
                  {...register(`units.${index}.tvd`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Введите TVD"
                />
                {errors.units?.[index]?.tvd && <p>{errors.units[index]?.tvd?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.local_n_coord`}>Местные координаты (север)</label>
                <input
                  {...register(`units.${index}.local_n_coord`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Местные северные координаты"
                />
                {errors.units?.[index]?.local_n_coord && <p>{errors.units[index]?.local_n_coord?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.local_e_coord`}>Местные координаты (восток)</label>
                <input
                  {...register(`units.${index}.local_e_coord`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Местные восточные координаты"
                />
                {errors.units?.[index]?.local_e_coord && <p>{errors.units[index]?.local_e_coord?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.global_n_coord`}>Глобальные координаты (север)</label>
                <input
                  {...register(`units.${index}.global_n_coord`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Глобальные северные координаты"
                />
                {errors.units?.[index]?.global_n_coord && <p>{errors.units[index]?.global_n_coord?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.global_e_coord`}>Глобальные координаты (восток)</label>
                <input
                  {...register(`units.${index}.global_e_coord`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Глобальные восточные координаты"
                />
                {errors.units?.[index]?.global_e_coord && <p>{errors.units[index]?.global_e_coord?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.dogleg`}>Dogleg</label>
                <input
                  {...register(`units.${index}.dogleg`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Dogleg"
                />
                {errors.units?.[index]?.dogleg && <p>{errors.units[index]?.dogleg?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`units.${index}.vertical_section`}>Вертикальная секция</label>
                <input
                  {...register(`units.${index}.vertical_section`, { setValueAs: (value) => Number(value) })}
                  type="number"
                  placeholder="Вертикальная секция"
                />
                {errors.units?.[index]?.vertical_section && <p>{errors.units[index]?.vertical_section?.message}</p>}
              </div>

              <button type="button" onClick={() => removeUnit(index)}>Удалить единицу</button>
            </div>
          ))}

          <button type="button" onClick={() => appendUnit({
            md: null,
            incl: null,
            azim: null,
            sub_sea: null,
            tvd: null,
            local_n_coord: null,
            local_e_coord: null,
            global_n_coord: null,
            global_e_coord: null,
            dogleg: null,
            vertical_section: null
          })}>Добавить единицу</button>

          {/* Submit Button */}
          <div className="flex flex-col col-span-2 items-center justify-between mt-3 mx-6">
            <button
              type="submit"
              className="w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
            >
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrajectory;