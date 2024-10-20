import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { instance } from '../../../api/axios.api';

export interface IPorePressureForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  porePressures?: IPorePressures;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

export interface IPorePressures {
  tvd: number;
  pressure: number;
  emw: number;
}

// Define the Zod schema to match the API structure
const porePressureSchema = z.object({
  tvd: z.number().positive("Вертикальная глубина обязателна"),
  pressure: z.number().positive("Давление обязательно"),
  emw: z.number().positive("Эквивалентная плотность бурового раствора обязательна"),
});

type FormData = z.infer<typeof porePressureSchema>;

const CreatePorePressureForm: FC<IPorePressureForm> = ({ type, id, porePressures, setIsEdit, onSuccess, caseId }) => {
  const navigate = useNavigate();

  // UseForm with individual tvd, pressure, and emw fields
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(porePressureSchema),
    defaultValues: {
      tvd: porePressures?.tvd ?? 1,
      pressure: porePressures?.pressure ?? 1,
      emw: porePressures?.emw ?? 1
    }
  });

  const onSubmit = async (data: FormData) => {
    const newPorePressureForm = {
      case_id: caseId,
      ...data
    };
    console.log(newPorePressureForm);

    try {
      if (type === 'post') {
        await instance.post(`/api/v1/pore-pressures/?caseId=${caseId}`, newPorePressureForm);
        toast.success('Новое поровое давление было добавлено');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/pore-pressures/${id}`, newPorePressureForm);
        toast.success('Поровое давление было обновлено');
      }
      if (onSuccess) onSuccess(); // Trigger success callback
      navigate(`/cases/${caseId}`);
    } catch (error) {
      console.log(error);
      toast.error('Ошибка при обработке порового давления');
    }
  };

  return (
    <div className='w-screen flex flex-col justify-center items-center mb-8'>
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4">
          {type === "post" ? "Создать новое поровое давление" : "Обновить это поровое давление"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          {/* Inputs for TVD, Pressure, and EMW */}
          <div className="input-wrapper">
            <label htmlFor="tvd">Истинная вертикальная глубина</label>
            <input 
              {...register("tvd", { setValueAs: value => Number(value) })} 
              type="number" 
              placeholder="Введите истинную вертикальную глубину" 
            />
            {errors.tvd && <p>{errors.tvd.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="pressure">Давление</label>
            <input 
              {...register("pressure", { setValueAs: value => Number(value) })} 
              type="number" 
              placeholder="Введите давление" 
            />
            {errors.pressure && <p>{errors.pressure.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="emw">Эквивалентная плотность бурового раствора</label>
            <input 
              {...register("emw", { setValueAs: value => Number(value) })} 
              type="number" 
              placeholder="Введите EMW" 
            />
            {errors.emw && <p>{errors.emw.message}</p>}
          </div>

          <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg'>
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            {type === 'put' && (<button onClick={() => { if (setIsEdit) { setIsEdit(false); } }}>Закрыть</button>)}
          </div>
          {errors.root && <div className='text-red-400'>{errors.root.message}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreatePorePressureForm;