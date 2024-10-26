import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { instance } from '../../../api/axios.api';
import { IPorePressure } from '../../../types/types';

export interface IPorePressureForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  porePressures?: IPorePressures;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: (updatedPore?: IPorePressure) => void;
}

export interface IPorePressures {
  id?: string;
  tvd?: number;
  pressure?: number;
  emw?: number;
}

// Define the Zod schema for form validation
const porePressureSchema = z.object({
  tvd: z.number().positive("Вертикальная глубина обязателна"),
  pressure: z.number().positive("Давление обязательно"),
  emw: z.number().positive("Эквивалентная плотность бурового раствора обязательна"),
});

type FormData = z.infer<typeof porePressureSchema>;

const CreatePorePressureForm: FC<IPorePressureForm> = ({ type, porePressures, setIsEdit, onSuccess, caseId }) => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(porePressureSchema),
    defaultValues: {
      tvd: porePressures?.tvd || 1,
      pressure: porePressures?.pressure || 1,
      emw: porePressures?.emw || 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    const newPorePressureForm = {
      case_id: caseId,
      ...data,
    };
    
    try {
      if (type === 'post') {
        await instance.post(`/api/v1/pore-pressures/?caseId=${caseId}`, newPorePressureForm);
        toast.success('Новое поровое давление было добавлено');
      } else if (type === 'put' && porePressures?.id) {
        await instance.put(`/api/v1/pore-pressures/${porePressures.id}`, newPorePressureForm);
        toast.success('Поровое давление было обновлено');
      }
      if (onSuccess) onSuccess(newPorePressureForm);
      navigate(`/cases/${caseId}`);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при обработке порового давления');
    }
  };

  return (
    <div className='w-screen mb-8'>
      <div className="w-3/4 max-w-md rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4">
          {type === "post" ? "Создать новое поровое давление" : "Обновить поровое давление"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          <div className="input-wrapper">
            <label htmlFor="tvd">Истинная вертикальная глубина</label>
            <input
              {...register("tvd", { setValueAs: value => Number(value) })}
              type="number"
              step="any"
              placeholder="Введите истинную вертикальную глубину"
            />
            {errors.tvd && <p className="text-red-400">{errors.tvd.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="pressure">Давление</label>
            <input
              {...register("pressure", { setValueAs: value => Number(value) })}
              type="number"
              step="any"
              placeholder="Введите давление"
            />
            {errors.pressure && <p className="text-red-400">{errors.pressure.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="emw">Эквивалентная плотность бурового раствора</label>
            <input
              {...register("emw", { setValueAs: value => Number(value) })}
              type="number"
              step="any"
              placeholder="Введите EMW"
            />
            {errors.emw && <p className="text-red-400">{errors.emw.message}</p>}
          </div>

          <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg'>
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            {type === 'put' && (
              <button
                type="button"
                onClick={() => { if (onSuccess) onSuccess(); }}
              >
                Закрыть
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePorePressureForm;