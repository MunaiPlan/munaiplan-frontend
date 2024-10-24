import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { instance } from '../../../api/axios.api';

export interface IPorePressureForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  porePressures?: IPorePressures[];
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

export interface IPorePressures {
  tvd: number;
  pressure: number;
  emw: number;
}

// Define the Zod schema to match the API structure with an array of pore pressures
// const porePressureSchema = z.object({
//   pore_pressures: z.array(
//     z.object({
//       tvd: z.number().positive("Вертикальная глубина обязателна"),
//       pressure: z.number().positive("Давление обязательно"),
//       emw: z.number().positive("Эквивалентная плотность бурового раствора обязательна"),
//     })
//   ),
// });

const porePressureSchema = z.object({
  tvd: z.number().positive("Вертикальная глубина обязателна"),
  pressure: z.number().positive("Давление обязательно"),
  emw: z.number().positive("Эквивалентная плотность бурового раствора обязательна"),
});

type FormData = z.infer<typeof porePressureSchema>;

const CreatePorePressureForm: FC<IPorePressureForm> = ({ type, id, porePressures, setIsEdit, onSuccess, caseId }) => {
  const navigate = useNavigate();

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(porePressureSchema),
    defaultValues: {
      tvd: 1, pressure: 1, emw: 1 ,
    }
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'pore_pressures',
  // });

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
      if (onSuccess) onSuccess();
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
          {type === "post" ? "Создать новое поровое давление" : "Обновить поровое давление"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          {/* Render dynamic fields
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 mb-4">
              <div className="input-wrapper">
                <label htmlFor={`pore_pressures.${index}.tvd`}>Истинная вертикальная глубина</label>
                <input
                  {...register(`pore_pressures.${index}.tvd`, { setValueAs: value => Number(value) })}
                  type="number"
                  placeholder="Введите истинную вертикальную глубину"
                />
                {errors.pore_pressures?.[index]?.tvd && <p>{errors.pore_pressures[index]?.tvd?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`porePressures.${index}.pressure`}>Давление</label>
                <input
                  {...register(`pore_pressures.${index}.pressure`, { setValueAs: value => Number(value) })}
                  type="number"
                  placeholder="Введите давление"
                />
                {errors.pore_pressures?.[index]?.pressure && <p>{errors.pore_pressures[index]?.pressure?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`pore_pressures.${index}.emw`}>Эквивалентная плотность бурового раствора</label>
                <input
                  {...register(`pore_pressures.${index}.emw`, { setValueAs: value => Number(value) })}
                  type="number"
                  placeholder="Введите EMW"
                />
                {errors.pore_pressures?.[index]?.emw && <p>{errors.pore_pressures[index]?.emw?.message}</p>}
              </div> */}

            <div className="border p-4 mb-4">
              <div className="input-wrapper">
                <label htmlFor={`pore_pressures.tvd`}>Истинная вертикальная глубина</label>
                <input
                  {...register(`tvd`, { setValueAs: value => Number(value) })}
                  type="number"
                  placeholder="Введите истинную вертикальную глубину"
                />
                {errors.tvd && <p>{errors.tvd?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`porePressures.pressure`}>Давление</label>
                <input
                  {...register(`pressure`, { setValueAs: value => Number(value) })}
                  type="number"
                  placeholder="Введите давление"
                />
                {errors.pressure && <p>{errors.pressure?.message}</p>}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`pore_pressures.emw`}>Эквивалентная плотность бурового раствора</label>
                <input
                  {...register(`emw`, { setValueAs: value => Number(value) })}
                  type="number"
                  placeholder="Введите EMW"
                />
                {errors.emw && <p>{errors.emw?.message}</p>}
              </div>
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