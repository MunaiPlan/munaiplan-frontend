import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ISection } from '../../../types/types';
import { instance } from '../../../api/axios.api';

interface IStringForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  prevName: string;
  prevDepth: number;
  prevSections: ISection[];
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

// Define the Zod schema for each section
const sectionSchema = z.object({
    id: z.string(),
    description: z.string().min(1, "Описание обязательно"),
    manufacturer: z.string().min(1, "Производитель обязателен"),
    type: z.string().min(1, "Тип обязателен"),
    body_od: z.number().positive("Наружный диаметр должен быть положительным"),
    body_id: z.number().positive("Внутренний диаметр должен быть положительным"),
    avg_joint_length: z.number().positive("Средняя длина соединения обязательна"),
    stabilizer_length: z.number().positive("Длина стабилизатора обязательна"),
    stabilizer_od: z.number().positive("Наружный диаметр стабилизатора обязателен"),
    stabilizer_id: z.number().positive("Внутренний диаметр стабилизатора обязателен"),
    weight: z.number().positive("Вес обязателен"),
    material: z.string().min(1, "Материал обязателен"),
    grade: z.string().min(1, "Класс обязателен"),
    class: z.number().positive("Класс обязателен"),
    friction_coefficient: z.number().positive("Коэффициент трения обязателен"),
    min_yield_strength: z.number().positive("Минимальная прочность на растяжение обязательна")
});
  
  // Define the Zod schema for the main form
const stringSchema = z.object({
    name: z.string().min(1, "Имя колонны обязательно"),
    depth: z.number().positive("Глубина колонны обязательна"),
    sections: z.array(sectionSchema) // Array of sections
});

type FormData = z.infer<typeof stringSchema>; // TypeScript type inference from Zod schema


const CreateString: FC<IStringForm> = ({ type, id, prevName, prevDepth, prevSections, setIsEdit, onSuccess, caseId }) => {
  const navigate = useNavigate();

  // Initialize the form using useForm with the zodResolver and default values
  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(stringSchema),
    defaultValues: {
      name: prevName || '',
      depth: prevDepth || 0,
      sections: prevSections || []
    }
  });

  // useFieldArray to dynamically manage the sections
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections' // Field array for sections
  });

  const onSubmit = async (data: any) => {
    const newString = {
      case_id: caseId,
      name: data.name,
      depth: data.depth,
      sections: data.sections
    };

    try {
      if (type === 'post') {
        await instance.post(`/api/v1/strings?caseId=${caseId}`, newString);
        toast.success('Новая колонна была добавлена');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/strings/${id}`, newString);
        toast.success('Колонна была обновлена');
      }
      navigate('/');
    } catch (error) {
      toast.error('Ошибка при обработке колонны');
    }
  };

  return (
    <div className='w-screen flex flex-col justify-center items-center'>
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4">
          {type === "post" ? "Создать новую колонну" : "Обновить эту колонну"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          {/* Name */}
          <div className="input-wrapper">
            <label htmlFor="nameString">Имя колонны</label>
            <input
              {...register('name')}
              type="text"
              placeholder="Введите имя колонны"
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          {/* Depth */}
          <div className="input-wrapper">
            <label htmlFor="depthString">Глубина колонны</label>
            <input
              {...register('depth', {
                setValueAs: (value) => Number(value),
              })}
              type="number"
              placeholder="Введите глубину колонны"
            />
            {errors.depth && <p>{errors.depth.message}</p>}
          </div>

          {/* Sections */}
          {fields.map((field, index) => (
            <div key={field.id}>
              <h2>{index + 1}-я секция</h2>

              <div className="input-wrapper">
                <label htmlFor={`sections[${index}].description`}>Описание секции</label>
                <input
                  {...register(`sections.${index}.description`)}
                  type="text"
                  placeholder="Введите описание секции"
                />
                
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections[${index}].manufacturer`}>Производитель секции</label>
                <input
                  {...register(`sections.${index}.manufacturer`)}
                  type="text"
                  placeholder="Введите производителя секции"
                />                
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections[${index}].type`}>Тип секции</label>
                <input
                  {...register(`sections.${index}.type`)}
                  type="text"
                  placeholder="Введите тип секции"
                />                
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections[${index}].body_od`}>Внешний диаметр секции</label>
                <input
                  {...register(`sections.${index}.body_od`, {
                    setValueAs: (value) => Number(value),
                  })}
                  type="number"
                  placeholder="Введите внешний диаметр секции"
                />                
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections[${index}].body_id`}>Внутренний диаметр секции</label>
                <input
                  {...register(`sections.${index}.body_id`, {
                    setValueAs: (value) => Number(value),
                  })}
                  type="number"
                  placeholder="Введите внутрений диаметр секции"
                />                
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections[${index}].body_id`}>Внутренний диаметр секции</label>
                <input
                  {...register(`sections.${index}.body_id`, {
                    setValueAs: (value) => Number(value),
                  })}
                  type="number"
                  placeholder="Введите внутрений диаметр секции"
                />                
              </div>

              <div className="input-wrapper">
                  <label htmlFor={`sections.${index}.avg_joint_length`}>Средняя длина соединения секции</label>
                    <input
                        {...register(`sections.${index}.avg_joint_length`, {
                          setValueAs: (value) => Number(value),
                        })}
                        type="number"
                        placeholder="Введите среднюю длину соединения секции"
                    />
                    {errors.sections?.[index]?.avg_joint_length && (
                    <p>{errors.sections[index]?.avg_joint_length?.message}</p>
                    )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.stabilizer_length`}>Длина стабилизатора секции</label>
                <input
                    {...register(`sections.${index}.stabilizer_length`, {
                      setValueAs: (value) => Number(value),
                    })}
                    type="number"
                    placeholder="Введите длину стабилизатора секции"
                />
                {errors.sections?.[index]?.stabilizer_length && (
                    <p>{errors.sections[index]?.stabilizer_length?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.stabilizer_od`}>Наружный диаметр стабилизатора секции</label>
                <input
                    {...register(`sections.${index}.stabilizer_od`, {
                      setValueAs: (value) => Number(value),
                    })}
                    type="number"
                    placeholder="Введите наружный диаметр стабилизатора секции"
                />
                {errors.sections?.[index]?.stabilizer_od && (
                    <p>{errors.sections[index]?.stabilizer_od?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.stabilizer_id`}>Внутренний диаметр стабилизатора секции</label>
                <input
                    {...register(`sections.${index}.stabilizer_id`, {
                      setValueAs: (value) => Number(value),
                    })}
                    type="number"
                    placeholder="Введите внутренний диаметр стабилизатора секции"
                />
                {errors.sections?.[index]?.stabilizer_id && (
                    <p>{errors.sections[index]?.stabilizer_id?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.weight`}>Вес секции</label>
                <input
                    {...register(`sections.${index}.weight`, {
                      setValueAs: (value) => Number(value),
                    })}
                    type="number"
                    placeholder="Введите вес секции"
                />
                {errors.sections?.[index]?.weight && (
                    <p>{errors.sections[index]?.weight?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.material`}>Материал секции</label>
                <input
                    {...register(`sections.${index}.material`)}
                    type="text"
                    placeholder="Введите материал секции"
                />
                {errors.sections?.[index]?.material && (
                    <p>{errors.sections[index]?.material?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.grade`}>Класс секции</label>
                <input
                    {...register(`sections.${index}.grade`)}
                    type="text"
                    placeholder="Введите класс секции"
                />
                {errors.sections?.[index]?.grade && (
                    <p>{errors.sections[index]?.grade?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.class`}>Класс секции</label>
                <input
                    {...register(`sections.${index}.class`, {
                      setValueAs: (value) => Number(value),
                    })}
                    type="number"
                    placeholder="Введите класс секции"
                />
                {errors.sections?.[index]?.class && (
                    <p>{errors.sections[index]?.class?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.friction_coefficient`}>Коэффициент трения секции</label>
                <input
                    {...register(`sections.${index}.friction_coefficient`, {
                      setValueAs: (value) => Number(value),
                    })}
                    type="number"
                    placeholder="Введите коэффициент трения секции"
                />
                {errors.sections?.[index]?.friction_coefficient && (
                    <p>{errors.sections[index]?.friction_coefficient?.message}</p>
                )}
              </div>

              <div className="input-wrapper">
                <label htmlFor={`sections.${index}.min_yield_strength`}>Минимальная прочность на растяжение секции</label>
                <input
                    {...register(`sections.${index}.min_yield_strength`, {
                      setValueAs: (value) => Number(value),
                    })}
                    type="number"
                    placeholder="Введите минимальную прочность на растяжение секции"
                />
                {errors.sections?.[index]?.min_yield_strength && (
                    <p>{errors.sections[index]?.min_yield_strength?.message}</p>
                )}
              </div>

              
              <button type="button" onClick={() => remove(index)}>Удалить секцию</button>
            </div>
          ))}

          <button type="button" onClick={() => append({
            id: "",
            description: "",
            manufacturer: "",
            type: "",
            body_od: 0,
            body_id: 0,
            avg_joint_length: 0,
            stabilizer_length: 0,
            stabilizer_od: 0,
            stabilizer_id: 0,
            weight: 0,
            material: "",
            grade: "",
            class: 0,
            friction_coefficient: 0,
            min_yield_strength: 0
          })}>
            Добавить секцию
          </button>

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

export default CreateString;