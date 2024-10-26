import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { instance } from '../../../api/axios.api';
import { IFractureGradient } from '../../../pages/DetailedPages/CaseComponents/FractureGradientsDetail';

export interface IFractureGradientForm {
  type: "put" | "post";
  caseId: string;
  fractureGradients?: IFractureGradient
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: (updatedFrac?: IFractureGradient) => void;
}

const fractureGradientSchema = z.object({
    temperature_at_surface: z.number().positive("Температура на поверхности обязателна"),
    temperature_at_well_tvd: z.number().positive("Температура на истинной вертикальной глубине скважины обязательна"),
    temperature_gradient: z.number().positive("Градиент температуры обязателен"),
    well_tvd: z.number().positive("Истинная вертикальная глубина скважины обязательна"),
  })

type FormData = z.infer<typeof fractureGradientSchema>;

const CreateFractureGradientForm: FC<IFractureGradientForm> = ({ type, fractureGradients, setIsEdit, onSuccess, caseId }) => {
  const navigate = useNavigate();


  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(fractureGradientSchema), // Use the correct schema for arrays
    defaultValues: {
      temperature_at_surface: fractureGradients?.temperature_at_surface ?? 1,
      temperature_at_well_tvd: fractureGradients?.temperature_at_well_tvd ?? 1,
      temperature_gradient: fractureGradients?.temperature_gradient ?? 1,
      well_tvd: fractureGradients?.well_tvd ?? 1
    }
  });


  const onSubmit = async (data: FormData) => {

    const newFractureGradientForm = {
      temperature_at_surface: data.temperature_at_surface ?? 1,
      temperature_at_well_tvd: data.temperature_at_well_tvd ?? 1,
      temperature_gradient: data.temperature_gradient ?? 1,
      well_tvd: data.well_tvd ?? 1
    };
    try {
      if (type === 'post') {
        await instance.post(`/api/v1/fracture-gradients/?caseId=${caseId}`, newFractureGradientForm);
        toast.success('Новое разрыва пласта была добавлена');
        if (onSuccess) {
          onSuccess();
        }
      } else if (type === 'put' && fractureGradients?.id) {
        await instance.put(`/api/v1/fracture-gradients/${fractureGradients?.id}`, newFractureGradientForm);
        toast.success('Градиент разрыва пласта была обновлена');
        if (onSuccess) {
          onSuccess(newFractureGradientForm);
        }
      }
      navigate(`/cases/${caseId}`);
    } catch (error) {
      console.log(error)
      toast.error('Ошибка при обработке градиента разрыва пласта');
    }
  };

  return (
    <div className='w-screen'>
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4">
          {type === "post" ? "Создать новый градиент разрыва пласта" : "Обновить этот градиент разрыва пласта"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          <div>
              {/* Temperature at surface */}
              <div className="input-wrapper">
                <label htmlFor={`temperature_at_surface`}>Температура на поверхности</label>
                <input step="any" {...register(`temperature_at_surface`, {
                  setValueAs: (value) => Number(value),
                })} type="number" placeholder="Введите температуру на поверхности" />
                {errors.temperature_at_surface && <p>{errors.temperature_at_surface?.message}</p>}
              </div>

              {/* Temperature at well tvd */}
              <div className="input-wrapper">
                <label htmlFor={`temperature_at_well_tvd`}>Температура на истинной вертикальной глубине скважины</label>
                <input step="any" {...register(`temperature_at_well_tvd`, {
                  setValueAs: (value) => Number(value),
                  })} type="number" placeholder="Введите температуру на истинной вертикальной глубине скважины" />
                {errors.temperature_at_well_tvd && <p>{errors.temperature_at_well_tvd?.message}</p>}
              </div>

              { /* Temperature at well gradient */ }
              <div className="input-wrapper">
                <label htmlFor={`temperature_at_well_gradient`}>Градиент температуры</label>
                <input step="any" {...register(`temperature_gradient`, {
                  setValueAs: (value) => Number(value),
                })} type="number" placeholder="Введите градиент температуры" />
                {errors.temperature_gradient && <p>{errors.temperature_gradient?.message}</p>}
              </div>

              { /* Well tvd */ }
              <div className="input-wrapper">
                <label htmlFor={`well_tvd`}>Истинная вертикальная глубина скважины</label>
                <input step="any" {...register(`well_tvd`, {
                  setValueAs: (value) => Number(value),
                })} type="number" placeholder="Введите истинную вертикальную глубину скважины" />
                {errors.well_tvd && <p>{errors.well_tvd?.message}</p>}
              </div>

              </div>

          <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg'>
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            {type === 'put' && (<button onClick={() => {
              if (onSuccess) {
                onSuccess();
              }
            }}>Закрыть</button>)}
          </div>
          {errors.root && <div className='text-red-400'>{errors.root.message}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateFractureGradientForm;