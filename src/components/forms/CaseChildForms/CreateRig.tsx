// import { FC } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { z } from 'zod';
// import { ISection } from '../../../types/types';
// import { instance } from '../../../api/axios.api';

// interface IRigForm {
//   type: "put" | "post";
//   id?: string;
//   caseId: string; 
//   rigs: IRig[];
//   setIsEdit?: (edit: boolean) => void;
//   onSuccess?: () => void;
// }

// interface IRig {
//   block_rating: number;
//   torque_rating: number;

//   rated_working_pressure: number;
//   bop_pressure_rating: number;
//   surface_pressure_loss: number;

//   standpipe_length: number;
//   standpipe_internal_diameter: number;
//   hose_length: number;
//   hose_internal_diameter: number;
//   swivel_length: number;
//   swivel_internal_diameter: number;
//   kelly_length: number;
//   kelly_internal_diameter: number;
//   pump_discharge_line_length: number;
//   pump_discharge_line_internal_diameter: number;
//   top_drive_stackup_length: number;
//   top_drive_stackup_internal_diameter: number;
// }

// // Define the Zod schema for each section
// const rigSchema = z.object({
//     rigs: z.array(
//         z.object({
//             id: z.string(),
//             block_rating: z.number().positive(""),
//             torque_rating: z.number().positive(""),
//             rated_working_pressure: z.number().positive(""),
//             bop_pressure_rating: z.number().positive(""),
//             surface_pressure_loss: z.number().positive(""),
            
//             standpipe_length: z.number().positive(""),
//             standpipe_internal_diameter: z.number().positive(""),
//             hose_length: z.number().positive(""),
//             hose_internal_diameter: z.number().positive(""),
//             swivel_length: z.number().positive(""),
//             swivel_internal_diameter: z.number().positive(""),
//             kelly_length: z.number().positive(""),
//             kelly_internal_diameter: z.number().positive(""),
//             pump_discharge_line_length: z.number().positive(""),
//             pump_discharge_line_internal_diameter: z.number().positive(""),
//             top_drive_stackup_length: z.number().positive(""),
//             top_drive_stackup_internal_diameter: z.number().positive("")
//         })
//     )
// });
  

// type FormData = z.infer<typeof rigSchema>; // TypeScript type inference from Zod schema


// const CreateRig: FC<IRigForm> = ({ type, id, rigs, setIsEdit, onSuccess, caseId }) => {
//   const navigate = useNavigate();

//   const mappedRigs = rigs.map(rig => ({
//     block_rating: rig.block_rating ?? 0,
//     torque_rating: rig.torque_rating ?? 0,
//     rated_working_pressure: rig.rated_working_pressure ?? 0,
//     bop_pressure_rating: rig.bop_pressure_rating ?? 0,
//     surface_pressure_loss: rig.surface_pressure_loss ?? 0,
//     standpipe_length: rig.standpipe_length ?? 0,
//     standpipe_internal_diameter: rig.standpipe_internal_diameter ?? 0,
//     hose_length: rig.hose_length ?? 0,
//     hose_internal_diameter: rig.hose_internal_diameter ?? 0,
//     swivel_length: rig.swivel_length ?? 0,
//     swivel_internal_diameter: rig.swivel_internal_diameter ?? 0,
//     kelly_length: rig.kelly_length ?? 0,
//     kelly_internal_diameter: rig.kelly_internal_diameter ?? 0,
//     pump_discharge_line_length: rig.pump_discharge_line_length ?? 0,
//     pump_discharge_line_internal_diameter: rig.pump_discharge_line_internal_diameter ?? 0,
//     top_drive_stackup_length: rig.top_drive_stackup_length ?? 0,
//     top_drive_stackup_internal_diameter: rig.top_drive_stackup_internal_diameter ?? 0
//   }));

//   const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
//     resolver: zodResolver(rigSchema),
//     defaultValues: {
//       rigs: mappedRigs.length > 0 ? mappedRigs : [{
//         block_rating: 1,
//         torque_rating: 1,
//         rated_working_pressure: 1,
//         bop_pressure_rating: 1,
//         surface_pressure_loss: 1,
//         standpipe_length: 1,
//         standpipe_internal_diameter: 1,
//         hose_length: 1,
//         hose_internal_diameter: 1,
//         swivel_length: 1,
//         swivel_internal_diameter: 1,
//         kelly_length: 1,
//         kelly_internal_diameter: 1,
//         pump_discharge_line_length: 1,
//         pump_discharge_line_internal_diameter: 1,
//         top_drive_stackup_length: 1,
//         top_drive_stackup_internal_diameter: 1
//       }]
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'rigs' 
//   });

//   const onSubmit = async (data: any) => {
//     const newRig = {
//         rigs: data.rigs
//       };

//     try {
//       if (type === 'post') {
//         await instance.post(`/api/v1/rigs?caseId=${caseId}`, newRig);
//         toast.success('Новая буровая была добавлена');
//       } else if (type === 'put' && id) {
//         await instance.put(`/api/v1/rigs/${id}`, newRig);
//         toast.success('Буровая была обновлена');
//       }
//       navigate(`/cases/${caseId}`);
//     } catch (error) {
//       toast.error('Ошибка при обработке буровой');
//     }
//   };

//   return (
//     <div className='w-screen flex flex-col justify-center items-center'>
//       <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
//         <h2 className="text-xl font-medium mb-4">
//           {type === "post" ? "Создать новую буровую" : "Обновить эту буровую"}
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
//           {/* Rigs */}
//           {fields.map((field, index) => (
//             <div key={field.id}>
//               <h2>{index + 1}-я буровая</h2>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs[${index}].block_rating`}>Рейтинг блока</label>
//                 <input
//                   {...register(`rigs.${index}.block_rating`, {
//                     setValueAs: (value) => Number(value),
//                   })}
//                   type="number"
//                   placeholder="Введите рейтинг блока"
//                 />
//                 {errors.rigs?.[index]?.block_rating && (
//                     <p>{errors.rigs[index]?.block_rating?.message}</p>
//                     )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs[${index}].torque_rating`}>Предельно допустимый крутящий момент</label>
//                 <input
//                   {...register(`rigs.${index}.torque_rating`, {
//                     setValueAs: (value) => Number(value),
//                   })}
//                   type="number"
//                   placeholder="Введите предельно допустимый крутящий момент"
//                 />                
//                 {errors.rigs?.[index]?.torque_rating && (
//                     <p>{errors.rigs[index]?.torque_rating?.message}</p>
//                     )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs[${index}].rated_working_pressure`}>Номинальное рабочее давление</label>
//                 <input
//                   {...register(`rigs.${index}.rated_working_pressure`, {
//                     setValueAs: (value) => Number(value),
//                   })}
//                   type="number"
//                   placeholder="Введите номинальное рабочее давление"
//                 />              
//                 {errors.rigs?.[index]?.rated_working_pressure && (
//                     <p>{errors.rigs[index]?.rated_working_pressure?.message}</p>
//                     )}  
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs[${index}].bop_pressure_rating`}>Давление номинальной пропускной способности превентера</label>
//                 <input
//                   {...register(`rigs.${index}.bop_pressure_rating`, {
//                     setValueAs: (value) => Number(value),
//                   })}
//                   type="number"
//                   placeholder="Введите давление номинальной пропускной способности превентера"
//                 />        
//                 {errors.rigs?.[index]?.bop_pressure_rating && (
//                     <p>{errors.rigs[index]?.bop_pressure_rating?.message}</p>
//                     )}        
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs[${index}].surface_pressure_loss`}>Потеря давления на поверхности</label>
//                 <input
//                   {...register(`rigs.${index}.surface_pressure_loss`, {
//                     setValueAs: (value) => Number(value),
//                   })}
//                   type="number"
//                   placeholder="Введите потерю давления на поверхности"
//                 />                
//                 {errors.rigs?.[index]?.surface_pressure_loss && (
//                     <p>{errors.rigs[index]?.surface_pressure_loss?.message}</p>
//                     )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs[${index}].standpipe_length`}>Длина стояка</label>
//                 <input
//                   {...register(`rigs.${index}.standpipe_length`, {
//                     setValueAs: (value) => Number(value),
//                   })}
//                   type="number"
//                   placeholder="Введите длину стояка"
//                 />    
//                 {errors.rigs?.[index]?.standpipe_length&& (
//                     <p>{errors.rigs[index]?.standpipe_length?.message}</p>
//                     )}            
//               </div>

//               <div className="input-wrapper">
//                   <label htmlFor={`rigs.${index}.standpipe_internal_diameter`}>Внутренний диаметр стояка</label>
//                     <input
//                         {...register(`rigs.${index}.standpipe_internal_diameter`, {
//                           setValueAs: (value) => Number(value),
//                         })}
//                         type="number"
//                         placeholder="Введите внутренний диаметр стояка"
//                     />
//                     {errors.rigs?.[index]?.standpipe_internal_diameter && (
//                     <p>{errors.rigs[index]?.standpipe_internal_diameter?.message}</p>
//                     )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.hose_length`}>Длина шланги</label>
//                 <input
//                     {...register(`rigs.${index}.hose_length`, {
//                       setValueAs: (value) => Number(value),
//                     })}
//                     type="number"
//                     placeholder="Введите длину шланги"
//                 />
//                 {errors.rigs?.[index]?.hose_length && (
//                     <p>{errors.rigs[index]?.hose_length?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.hose_internal_diameter`}>Внутренний диаметр шланги</label>
//                 <input
//                     {...register(`rigs.${index}.hose_internal_diameter`, {
//                       setValueAs: (value) => Number(value),
//                     })}
//                     type="number"
//                     placeholder="Введитe внутренний диаметр шланги"
//                 />
//                 {errors.rigs?.[index]?.hose_internal_diameter && (
//                     <p>{errors.rigs[index]?.hose_internal_diameter?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.swivel_length`}>Длина вертлюги</label>
//                 <input
//                     {...register(`rigs.${index}.swivel_length`, {
//                       setValueAs: (value) => Number(value),
//                     })}
//                     type="number"
//                     placeholder="Введите длину вертлюги"
//                 />
//                 {errors.rigs?.[index]?.swivel_length && (
//                     <p>{errors.rigs[index]?.swivel_length?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.swivel_internal_diameter`}>Внутренний диаметр вертлюги</label>
//                 <input
//                     {...register(`rigs.${index}.swivel_internal_diameter`, {
//                       setValueAs: (value) => Number(value),
//                     })}
//                     type="number"
//                     placeholder="Введите внутренний диаметр вертлюги"
//                 />
//                 {errors.rigs?.[index]?.swivel_internal_diameter && (
//                     <p>{errors.rigs[index]?.swivel_internal_diameter?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.kelly_length`}>Длина ведущей трубы</label>
//                 <input
//                     {...register(`rigs.${index}.kelly_length`)}
//                     type="text"
//                     placeholder="Введите длину ведущей трубы"
//                 />
//                 {errors.rigs?.[index]?.kelly_length && (
//                     <p>{errors.rigs[index]?.kelly_length?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.kelly_internal_diameter`}>Внутренний диаметр ведущей трубы</label>
//                 <input
//                     {...register(`rigs.${index}.kelly_internal_diameter`)}
//                     type="text"
//                     placeholder="Введите внутренний диаметр ведущей трубы"
//                 />
//                 {errors.rigs?.[index]?.kelly_internal_diameter && (
//                     <p>{errors.rigs[index]?.kelly_internal_diameter?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.pump_discharge_line_length`}>Длина напорной линии насоса</label>
//                 <input
//                     {...register(`rigs.${index}.pump_discharge_line_length`, {
//                       setValueAs: (value) => Number(value),
//                     })}
//                     type="number"
//                     placeholder="Введите длину напорной линии насоса"
//                 />
//                 {errors.rigs?.[index]?.pump_discharge_line_length && (
//                     <p>{errors.rigs[index]?.pump_discharge_line_length?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.pump_discharge_line_internal_diameter`}>Внутренний диаметр напорной линии насоса</label>
//                 <input
//                     {...register(`rigs.${index}.pump_discharge_line_internal_diameter`, {
//                       setValueAs: (value) => Number(value),
//                     })}
//                     type="number"
//                     placeholder="Введите внутренний диаметр напорной линии насоса"
//                 />
//                 {errors.rigs?.[index]?.pump_discharge_line_internal_diameter && (
//                     <p>{errors.rigs[index]?.pump_discharge_line_internal_diameter?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.top_drive_stackup_length`}>Длина компоновки верхнего привода</label>
//                 <input
//                     {...register(`rigs.${index}.top_drive_stackup_length`, {
//                       setValueAs: (value) => Number(value),
//                     })}
//                     type="number"
//                     placeholder="Введите длину компоновки верхнего привода"
//                 />
//                 {errors.rigs?.[index]?.top_drive_stackup_length && (
//                     <p>{errors.rigs[index]?.top_drive_stackup_length?.message}</p>
//                 )}
//               </div>

//               <div className="input-wrapper">
//                 <label htmlFor={`rigs.${index}.top_drive_stackup_internal_diameter`}>Внутренний диаметр компоновки верхнего привода</label>
//                 <input
//                     {...register(`rigs.${index}.top_drive_stackup_internal_diameter`, {
//                       setValueAs: (value) => Number(value),
//                     })}
//                     type="number"
//                     placeholder="Введите внутренний диаметр компоновки верхнего привода"
//                 />
//                 {errors.rigs?.[index]?.top_drive_stackup_internal_diameter && (
//                     <p>{errors.rigs[index]?.top_drive_stackup_internal_diameter?.message}</p>
//                 )}
//               </div>

              
//               <button type="button" onClick={() => remove(index)}>Удалить секцию</button>
//             </div>
//           ))}

//           <button type="button" onClick={() => append({
//             id: "",
//             block_rating: 1,
//             torque_rating: 1,
//             rated_working_pressure: 1,
//             bop_pressure_rating: 1,
//             surface_pressure_loss: 1,
//             standpipe_length: 1,
//             standpipe_internal_diameter: 1,
//             hose_length: 1,
//             hose_internal_diameter: 1,
//             swivel_length: 1,
//             swivel_internal_diameter: 1,
//             kelly_length: 1,
//             kelly_internal_diameter: 1,
//             pump_discharge_line_length: 1,
//             pump_discharge_line_internal_diameter: 1,
//             top_drive_stackup_length: 1,
//             top_drive_stackup_internal_diameter: 1,
//           })}>
//             Добавить буровую
//           </button>

//           <div className="flex flex-col items-center justify-between mt-3 mx-6">
//                   <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base'>
//                       {type === 'put' ? 'Обновить' : 'Создать'}
//                   </button>
//                   { type === 'put' && (<button className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" onClick={() => {
//                       if(setIsEdit) {setIsEdit(false);}
//                   }}>Закрыть</button>)}
//                 </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateRig;



import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ISection } from '../../../types/types';
import { instance } from '../../../api/axios.api';

interface IRigForm {
  type: "put" | "post";
  id?: string;
  caseId: string; 
  rig: IRig;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

export interface IRig {
  block_rating: number;
  torque_rating: number;

  rated_working_pressure: number;
  bop_pressure_rating: number;
  surface_pressure_loss: number;

  standpipe_length: number;
  standpipe_internal_diameter: number;
  hose_length: number;
  hose_internal_diameter: number;
  swivel_length: number;
  swivel_internal_diameter: number;
  kelly_length: number;
  kelly_internal_diameter: number;
  pump_discharge_line_length: number;
  pump_discharge_line_internal_diameter: number;
  top_drive_stackup_length: number;
  top_drive_stackup_internal_diameter: number;
}

// Define the Zod schema for each section
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
  

type FormData = z.infer<typeof rigSchema>; // TypeScript type inference from Zod schema


const CreateRig: FC<IRigForm> = ({ type, id, rig, setIsEdit, onSuccess, caseId }) => {
  const navigate = useNavigate();


  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(rigSchema),
    defaultValues: {
      block_rating: rig.block_rating ?? 1,
        torque_rating: rig.torque_rating ?? 1,
        rated_working_pressure: rig.rated_working_pressure ?? 1,
        bop_pressure_rating: rig.bop_pressure_rating ?? 1,
        surface_pressure_loss: rig.surface_pressure_loss ?? 1,
        standpipe_length: rig.standpipe_length ?? 1,
        standpipe_internal_diameter: rig.standpipe_internal_diameter ?? 1,
        hose_length: rig.hose_length ?? 1,
        hose_internal_diameter: rig.hose_internal_diameter ?? 1,
        swivel_length: rig.swivel_length ?? 1,
        swivel_internal_diameter: rig.swivel_internal_diameter ?? 1,
        kelly_length: rig.kelly_length ?? 1,
        kelly_internal_diameter: rig.kelly_internal_diameter ?? 1,
        pump_discharge_line_length: rig.pump_discharge_line_length ?? 1,
        pump_discharge_line_internal_diameter: rig.pump_discharge_line_internal_diameter ?? 1,
        top_drive_stackup_length: rig.top_drive_stackup_length ?? 1,
        top_drive_stackup_internal_diameter: rig.top_drive_stackup_internal_diameter ?? 1
    }
  });

  const onSubmit = async (data: any) => {
    const newRig = {
        ...data
      };

    try {
      if (type === 'post') {
        await instance.post(`/api/v1/rigs?caseId=${caseId}`, newRig);
        toast.success('Новая буровая была добавлена');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/rigs/${id}`, newRig);
        toast.success('Буровая была обновлена');
      }
      navigate(`/cases/${caseId}`);
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
                    {...register(`kelly_length`)}
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
                    {...register(`kelly_internal_diameter`)}
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
                    type="number"
                    placeholder="Введите внутренний диаметр компоновки верхнего привода"
                />
                {errors.top_drive_stackup_internal_diameter && (
                    <p>{errors.top_drive_stackup_internal_diameter?.message}</p>
                )}
              </div>


          <div className="flex flex-col items-center justify-between mt-3 mx-6">
                  <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base'>
                      {type === 'put' ? 'Обновить' : 'Создать'}
                  </button>
                  { type === 'put' && (<button className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" onClick={() => {
                      if(setIsEdit) {setIsEdit(false);}
                  }}>Закрыть</button>)}
                </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRig;