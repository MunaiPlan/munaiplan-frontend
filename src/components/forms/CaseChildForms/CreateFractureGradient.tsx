import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IpVersion, z } from 'zod';
import { instance } from '../../../api/axios.api';

export interface IFractureGradientForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  fractureGradients: IFractureGradient[]
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

export interface IFractureGradient {
    prevTempAtSurface: number;
    prevTempAtWellTVD: number;
    prevTempGradient: number;
    prevWellTVD: number;
}

const fractureGradientSchema = z.object({
    fracture_gradients: z.array(
      z.object({
        temperature_at_surface: z.number().positive("Температура на поверхности обязателна"),
        temperature_at_well_tvd: z.number().positive("Температура на истинной вертикальной глубине скважины обязательна"),
        temperature_at_well_gradient: z.number().positive("Градиент температуры обязателен"),
        well_tvd: z.number().positive("Истинная вертикальная глубина скважины обязательна"),
      })
    ),
  });

type FormData = z.infer<typeof fractureGradientSchema>;

const CreateFractureGradientForm: FC<IFractureGradientForm> = ({ type, id, fractureGradients, setIsEdit, onSuccess, caseId }) => {
  const navigate = useNavigate();

  const mappedFractureGradients = fractureGradients.map(gradient => ({
    temperature_at_surface: gradient.prevTempAtSurface ?? 0,
    temperature_at_well_tvd: gradient.prevTempAtWellTVD ?? 0,
    temperature_at_well_gradient: gradient.prevTempGradient ?? 0,
    well_tvd: gradient.prevWellTVD ?? 0,
  }));

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(fractureGradientSchema), // Use the correct schema for arrays
    defaultValues: {
      fracture_gradients: mappedFractureGradients.length > 0 ? mappedFractureGradients : [{
        temperature_at_surface: 1,
        temperature_at_well_tvd: 1,
        temperature_at_well_gradient: 1,
        well_tvd: 1
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fracture_gradients' 
  });

  const onSubmit = async (data: FormData) => {
    const newFractureGradientForm = {
      case_id: caseId,
      ...data
    };
    console.log(newFractureGradientForm)

    try {
      if (type === 'post') {
        await instance.post(`/api/v1/fracture-gradients/?caseId=${caseId}`, newFractureGradientForm);
        toast.success('Новое поровое давление была добавлена');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/fracture-gradients/${id}`, newFractureGradientForm);
        toast.success('Градиент разрыва пласта была обновлена');
      }
      navigate(`/cases/${caseId}`);
    } catch (error) {
      toast.error('Ошибка при обработке градиента разрыва пласта');
    }
  };

  return (
    <div className='w-screen flex flex-col justify-center items-center'>
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4">
          {type === "post" ? "Создать новый градиент разрыва пласта" : "Обновить этот градиент разрыва пласта"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          {fields.map((field, index) => (
            <div key={field.id}>
              <h2>{index + 1}-й градиент</h2>

              {/* Temperature at surface */}
              <div className="input-wrapper">
                <label htmlFor={`fracture_gradients[${index}].temperature_at_surface`}>Температура на поверхности</label>
                <input {...register(`fracture_gradients.${index}.temperature_at_surface`, {
                  setValueAs: (value) => Number(value),
                })} type="number" placeholder="Введите температуру на поверхности" />
                {errors.fracture_gradients?.[index]?.temperature_at_surface && <p>{errors.fracture_gradients[index]?.temperature_at_surface?.message}</p>}
              </div>

              {/* Temperature at well tvd */}
              <div className="input-wrapper">
                <label htmlFor={`fracture_gradients[${index}].temperature_at_well_tvd`}>Температура на истинной вертикальной глубине скважины</label>
                <input {...register(`fracture_gradients.${index}.temperature_at_well_tvd`, {
                  setValueAs: (value) => Number(value),
                  })} type="number" placeholder="Введите температуру на истинной вертикальной глубине скважины" />
                {errors.fracture_gradients?.[index]?.temperature_at_well_tvd && <p>{errors.fracture_gradients[index]?.temperature_at_well_tvd?.message}</p>}
              </div>

              { /* Temperature at well gradient */ }
              <div className="input-wrapper">
                <label htmlFor={`fracture_gradients[${index}].temperature_at_well_gradient`}>Градиент температуры</label>
                <input {...register(`fracture_gradients.${index}.temperature_at_well_gradient`, {
                  setValueAs: (value) => Number(value),
                })} type="number" placeholder="Введите градиент температуры" />
                {errors.fracture_gradients?.[index]?.temperature_at_well_gradient && <p>{errors.fracture_gradients[index]?.temperature_at_well_gradient?.message}</p>}
              </div>

              { /* Well tvd */ }
              <div className="input-wrapper">
                <label htmlFor={`fracture_gradients[${index}].well_tvd`}>Истинная вертикальная глубина скважины</label>
                <input {...register(`fracture_gradients.${index}.well_tvd`, {
                  setValueAs: (value) => Number(value),
                })} type="number" placeholder="Введите истинную вертикальную глубину скважины" />
                {errors.fracture_gradients?.[index]?.well_tvd && <p>{errors.fracture_gradients[index]?.well_tvd?.message}</p>}
              </div>

              <button type="button" onClick={() => remove(index)}>Удалить градиент разрыва пласта</button>
            </div>
          ))}

          <button type="button" onClick={() => append({
            temperature_at_surface: 0,
            temperature_at_well_gradient: 0,
            temperature_at_well_tvd: 0,
            well_tvd: 0
          })}>
            Добавить градиент разрыва пласта
          </button>

          <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg'>
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            {type === 'put' && (<button onClick={() => { if(setIsEdit) { setIsEdit(false); } }}>Закрыть</button>)}
          </div>
          {errors.root && <div className='text-red-400'>{errors.root.message}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateFractureGradientForm;