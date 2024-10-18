import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IpVersion, z } from 'zod';
import { instance } from '../../../api/axios.api';

export interface IPorePressureForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  porePressures: IPorePressures[];
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

export interface IPorePressures {
  prevTVD: number;
  prevPressure: number;
  prevEMV: number;
}

// Define the Zod schema for a pore pressure
const porePressureSchema = z.object({
  tvd: z.number().positive("Вертикальная глубина обязателна"),
  pressure: z.number().positive("Давление обязательно"),
  emw: z.number().positive("Эквивалентная плотность бурового раствора"),
});


const formSchema = z.object({
  pore_pressures: z.array(porePressureSchema),
});

type FormData = z.infer<typeof formSchema>;

const CreatePorePressureForm: FC<IPorePressureForm> = ({ type, id, porePressures, setIsEdit, onSuccess, caseId }) => {
  const navigate = useNavigate();

  // Initialize the form
  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(porePressureSchema),
    defaultValues: {
      pore_pressures: [{ tvd: 0, pressure: 0, emw: 0 }]
    }
  });

  // useFieldArray for managing the caisings
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pore_pressures' 
  });

  const onSubmit = async (data: FormData) => {
    toast.success("clicks")
    const newPorePressureForm = {
      case_id: caseId,
      ...data
    };
    console.log(newPorePressureForm)

    try {
      if (type === 'post') {
        await instance.post(`/api/v1/pore-pressures/?caseId=${caseId}`, newPorePressureForm);
        toast.success('Новое поровое давление была добавлена');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/pore-pressures/${id}`, newPorePressureForm);
        toast.success('Поровое давление было обновлено');
      }
      navigate('/');
    } catch (error) {
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
          {fields.map((field, index) => (
            <div key={field.id}>
              <h2>{index + 1}-ое поровое давление</h2>

              <div className="input-wrapper">
                <label htmlFor={`pore_pressures[${index}].tvd`}>Истинная вертикальная глубина</label>
                <input {...register(`pore_pressures.${index}.tvd`, {
                  setValueAs: (value) => Number(value),
                })} type="number" placeholder="Введите истинную вертикальную глубину" />
                {errors.pore_pressures?.[index]?.tvd && <p>{errors.pore_pressures[index]?.tvd?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`pore_pressures[${index}].pressure`}>Давление</label>
                <input {...register(`pore_pressures.${index}.pressure`, {
                  setValueAs: (value) => Number(value),
                  })} type="number" placeholder="Введите давление" />
                {errors.pore_pressures?.[index]?.pressure && <p>{errors.pore_pressures[index]?.pressure?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`pore_pressures[${index}].emw`}>Эквивалентная плотность бурового раствора</label>
                <input {...register(`pore_pressures.${index}.emw`, {
                  setValueAs: (value) => Number(value),
                })} type="number" placeholder="Введите emw" />
                {errors.pore_pressures?.[index]?.emw && <p>{errors.pore_pressures[index]?.emw?.message}</p>}
              </div>

              <button type="button" onClick={() => remove(index)}>Удалить поровое давление</button>
            </div>
          ))}

          <button type="button" onClick={() => append({
            tvd: 10,
            pressure: 1,
            emw: 1
          })}>
            Добавить поровое давление
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

export default CreatePorePressureForm;