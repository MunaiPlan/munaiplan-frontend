import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { instance } from '../../../api/axios.api';
import { IRig } from '../../../types/types';

interface IRigForm {
  type: "put" | "post";
  caseId: string; 
  rig?: IRig;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: (updatedRig?: IRig) => void;
}

const rigSchema = z.object({
  block_rating: z.number().positive("").nullable(),
  torque_rating: z.number().positive("").nullable(),
  rated_working_pressure: z.number().positive(""),
  bop_pressure_rating: z.number().positive(""),
  surface_pressure_loss: z.number().default(0),
  standpipe_length: z.number().positive("").nullable(),
  standpipe_internal_diameter: z.number().positive("").nullable(),
  hose_length: z.number().positive("").nullable(),
  hose_internal_diameter: z.number().positive("").nullable(),
  swivel_length: z.number().positive("").nullable(),
  swivel_internal_diameter: z.number().positive("").nullable(),
  kelly_length: z.number().positive("").nullable(),
  kelly_internal_diameter: z.number().positive("").nullable(),
  pump_discharge_line_length: z.number().positive("").nullable(),
  pump_discharge_line_internal_diameter: z.number().positive("").nullable(),
  top_drive_stackup_length: z.number().positive("").nullable(),
  top_drive_stackup_internal_diameter: z.number().positive("").nullable()
});

type FormData = z.infer<typeof rigSchema>;

const CreateRig: FC<IRigForm> = ({ type, rig, setIsEdit, onSuccess, caseId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(rigSchema),
    defaultValues: rig || {},
  });

  const onSubmit = async (data: FormData) => {
    const newRig = {
      block_rating: data.block_rating ?? null,
      torque_rating: data.torque_rating ?? null,
      rated_working_pressure: data.rated_working_pressure,
      bop_pressure_rating: data.bop_pressure_rating,
      surface_pressure_loss: data.surface_pressure_loss,
      standpipe_length: data.standpipe_length ?? null,
      standpipe_internal_diameter: data.standpipe_internal_diameter ?? null,
      hose_length: data.hose_length ?? null,
      hose_internal_diameter: data.hose_internal_diameter ?? null,
      swivel_length: data.swivel_length ?? null,
      swivel_internal_diameter: data.swivel_internal_diameter ?? null,
      kelly_length: data.kelly_length ?? null,
      kelly_internal_diameter: data.kelly_internal_diameter ?? null,
      pump_discharge_line_length: data.pump_discharge_line_length ?? null,
      pump_discharge_line_internal_diameter: data.pump_discharge_line_internal_diameter ?? null,
      top_drive_stackup_length: data.top_drive_stackup_length ?? null,
      top_drive_stackup_internal_diameter: data.top_drive_stackup_internal_diameter ?? null
    };

    try {
      if (type === 'post') {
        await instance.post(`/api/v1/rigs?caseId=${caseId}`, newRig);
        toast.success('Новая буровая была добавлена');
      } else if (type === 'put' && rig?.id) {
        await instance.put(`/api/v1/rigs/${rig.id}`, newRig);
        toast.success('Буровая была обновлена');
      }
      if (onSuccess) onSuccess(newRig);
    } catch (error) {
      toast.error('Ошибка при обработке буровой');
    }
  };

  return (
    <div className='w-screen flex flex-col justify-center items-center'>
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4">
          {type === "post" ? "Создать новую буровую" : "Обновить эту буровую"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          {/* Rigs */}
          <div className="input-wrapper">
            <label htmlFor={`block_rating`}>Рейтинг блока</label>
            <input
                step="any"
                {...register(`block_rating`, {
                setValueAs: (value) => Number(value),
              })}
              type="number"
              placeholder="Введите рейтинг блока"
            />
            {errors.block_rating && (
                <p>{errors.block_rating?.message}</p>
                )}
          </div>

              <div className="input-wrapper">
                <label htmlFor={`torque_rating`}>Предельно допустимый крутящий момент</label>
                <input
                  {...register(`torque_rating`, {
                    setValueAs: (value) => Number(value),
                  })}
                  step="any"
                  type="number"
                  placeholder="Введите предельно допустимый крутящий момент"
                />                
                {errors.torque_rating && (
                    <p>{errors.torque_rating?.message}</p>
                    )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`rated_working_pressure`}>Номинальное рабочее давление</label>
                <input
                  {...register(`rated_working_pressure`, {
                    setValueAs: (value) => Number(value),
                  })}
                  step="any"
                  type="number"
                  placeholder="Введите номинальное рабочее давление"
                />              
                {errors.rated_working_pressure && (
                    <p>{errors.rated_working_pressure?.message}</p>
                    )}  
              </div>

              <div className="input-wrapper">
                <label htmlFor={`bop_pressure_rating`}>Давление номинальной пропускной способности превентера</label>
                <input
                  {...register(`bop_pressure_rating`, {
                    setValueAs: (value) => Number(value),
                  })}
                  step="any"
                  type="number"
                  placeholder="Введите давление номинальной пропускной способности превентера"
                />        
                {errors.bop_pressure_rating && (
                    <p>{errors.bop_pressure_rating?.message}</p>
                    )}        
              </div>

              <div className="input-wrapper">
                <label htmlFor={`surface_pressure_loss`}>Потеря давления на поверхности</label>
                <input
                  {...register(`surface_pressure_loss`, {
                    setValueAs: (value) => Number(value),
                  })}
                  step="any"
                  type="number"
                  placeholder="Введите потерю давления на поверхности"
                />                
                {errors.surface_pressure_loss && (
                    <p>{errors.surface_pressure_loss?.message}</p>
                    )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`standpipe_length`}>Длина стояка</label>
                <input
                  {...register(`standpipe_length`, {
                    setValueAs: (value) => Number(value),
                  })}
                  step="any"
                  type="number"
                  placeholder="Введите длину стояка"
                />    
                {errors.standpipe_length&& (
                    <p>{errors.standpipe_length?.message}</p>
                    )}            
              </div>

              <div className="input-wrapper">
                  <label htmlFor={`standpipe_internal_diameter`}>Внутренний диаметр стояка</label>
                    <input
                        {...register(`standpipe_internal_diameter`, {
                          setValueAs: (value) => Number(value),
                        })}
                        step="any"
                        type="number"
                        placeholder="Введите внутренний диаметр стояка"
                    />
                    {errors.standpipe_internal_diameter && (
                    <p>{errors.standpipe_internal_diameter?.message}</p>
                    )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`hose_length`}>Длина шланги</label>
                <input
                    {...register(`hose_length`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="number"
                    placeholder="Введите длину шланги"
                />
                {errors.hose_length && (
                    <p>{errors.hose_length?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`hose_internal_diameter`}>Внутренний диаметр шланги</label>
                <input
                    {...register(`hose_internal_diameter`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="number"
                    placeholder="Введитe внутренний диаметр шланги"
                />
                {errors.hose_internal_diameter && (
                    <p>{errors.hose_internal_diameter?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`swivel_length`}>Длина вертлюги</label>
                <input
                    {...register(`swivel_length`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="number"
                    placeholder="Введите длину вертлюги"
                />
                {errors.swivel_length && (
                    <p>{errors.swivel_length?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`swivel_internal_diameter`}>Внутренний диаметр вертлюги</label>
                <input
                    {...register(`swivel_internal_diameter`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="number"
                    placeholder="Введите внутренний диаметр вертлюги"
                />
                {errors.swivel_internal_diameter && (
                    <p>{errors.swivel_internal_diameter?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`kelly_length`}>Длина ведущей трубы</label>
                <input
                    {...register(`kelly_length`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="text"
                    placeholder="Введите длину ведущей трубы"
                />
                {errors.kelly_length && (
                    <p>{errors.kelly_length?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`kelly_internal_diameter`}>Внутренний диаметр ведущей трубы</label>
                <input
                    {...register(`kelly_internal_diameter`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="text"
                    placeholder="Введите внутренний диаметр ведущей трубы"
                />
                {errors.kelly_internal_diameter && (
                    <p>{errors.kelly_internal_diameter?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`pump_discharge_line_length`}>Длина напорной линии насоса</label>
                <input
                    {...register(`pump_discharge_line_length`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="number"
                    placeholder="Введите длину напорной линии насоса"
                />
                {errors.pump_discharge_line_length && (
                    <p>{errors.pump_discharge_line_length?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`pump_discharge_line_internal_diameter`}>Внутренний диаметр напорной линии насоса</label>
                <input
                    {...register(`pump_discharge_line_internal_diameter`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="number"
                    placeholder="Введите внутренний диаметр напорной линии насоса"
                />
                {errors.pump_discharge_line_internal_diameter && (
                    <p>{errors.pump_discharge_line_internal_diameter?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`top_drive_stackup_length`}>Длина компоновки верхнего привода</label>
                <input
                    {...register(`top_drive_stackup_length`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="number"
                    placeholder="Введите длину компоновки верхнего привода"
                />
                {errors.top_drive_stackup_length && (
                    <p>{errors.top_drive_stackup_length?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`top_drive_stackup_internal_diameter`}>Внутренний диаметр компоновки верхнего привода</label>
                <input
                    {...register(`top_drive_stackup_internal_diameter`, {
                      setValueAs: (value) => Number(value),
                    })}
                    step="any"
                    type="number"
                    placeholder="Введите внутренний диаметр компоновки верхнего привода"
                />
                {errors.top_drive_stackup_internal_diameter && (
                    <p>{errors.top_drive_stackup_internal_diameter?.message}</p>
                )}
              </div>


              <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg'>
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            {type === 'put' && (<button className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg' onClick={() => {
              if (onSuccess) {
                onSuccess();
              }
            }}>Закрыть</button>)}
          </div>
          {errors.root && <div className='text-red-400'>{errors.root.message}</div>}
        </form>
      </div>
  </div>
  )
};

export default CreateRig;