import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { instance } from '../../../api/axios.api';
import { HoleData } from '../../../types/types';

interface IHoleForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  prevHole?: HoleData;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: (updatedHole?: HoleData) => void;
}


// Define the Zod schema for a caising
const caisingSchema = z.object({
  md_top: z.number().positive("MD Top обязателен"),
  md_base: z.number().positive("MD Base обязателен"),
  length: z.number().positive("Length обязателен"),
  shoe_md: z.number().optional(),
  od: z.number().positive("OD обязателен"),
  vd: z.number().positive("VD обязателен"),
  drift_id: z.number().positive("Drift ID обязателен"),
  effective_hole_diameter: z.number().positive("Effective Hole Diameter обязателен"),
  weight: z.number().positive("Weight обязателен"),
  grade: z.string().min(1, "Grade обязателен"),
  min_yield_strength: z.number().positive("Min Yield Strength обязателен"),
  burst_rating: z.number().positive("Burst Rating обязателен"),
  collapse_rating: z.number().positive("Collapse Rating обязателен"),
  friction_factor_caising: z.number().positive("Friction Factor обязателен"),
  linear_capacity_caising: z.number().positive("Linear Capacity обязателен"),
  description_caising: z.string().optional(),
  manufacturer_caising: z.string().optional(),
  model_caising: z.string().optional(),
});

// Define the Zod schema for the hole, including friction factor fields
const holeSchema = z.object({
  open_hole_md_top: z.number().positive("MD Top обязателен"),
  open_hole_md_base: z.number().positive("MD Base обязателен"),
  open_hole_length: z.number().positive("Hole Length обязателен"),
  open_hole_vd: z.number().positive("VD обязателен"),
  effective_diameter: z.number().positive("Effective Diameter обязателен"),
  friction_factor_open_hole: z.number().positive("Friction Factor обязателен"),
  linear_capacity_open_hole: z.number().positive("Linear Capacity обязателен"),
  volume_excess: z.number().optional(),
  description_open_hole: z.string().optional(),
  tripping_in_caising: z.number().positive("Tripping In Caising обязателен"),
  tripping_out_caising: z.number().positive("Tripping Out Caising обязателен"),
  rotating_on_bottom_caising: z.number().positive("Rotating On Bottom Caising обязателен"),
  slide_drilling_caising: z.number().positive("Slide Drilling Caising обязателен"),
  back_reaming_casing: z.number().positive("Back Reaming Caising обязателен"),
  rotating_off_bottom_caising: z.number().positive("Rotating Off Bottom Caising обязателен"),
  tripping_in_open_hole: z.number().positive("Tripping In Open Hole обязателен"),
  tripping_out_open_hole: z.number().positive("Tripping Out Open Hole обязателен"),
  rotating_on_bottom_open_hole: z.number().positive("Rotating On Bottom Open Hole обязателен"),
  slide_drilling_open_hole: z.number().positive("Slide Drilling Open Hole обязателен"),
  back_reaming_open_hole: z.number().positive("Back Reaming Open Hole обязателен"),
  rotating_off_bottom_open_hole: z.number().positive("Rotating Off Bottom Open Hole обязателен"),
  caisings: z.array(caisingSchema),
});

type FormData = z.infer<typeof holeSchema>;

const CreateHole: FC<IHoleForm> = ({ type, id, prevHole, onSuccess, caseId }) => {
  const navigate = useNavigate();

  // Initialize the form
  const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(holeSchema),
    defaultValues: prevHole || {
      open_hole_md_top: 1,
      open_hole_md_base: 1,
      open_hole_length: 1,
      open_hole_vd: 1,
      effective_diameter: 1,
      friction_factor_open_hole: 1,
      linear_capacity_open_hole: 1,
      tripping_in_caising: 1,
      tripping_out_caising: 1,
      rotating_on_bottom_caising: 1,
      slide_drilling_caising: 1,
      back_reaming_casing: 1,
      rotating_off_bottom_caising: 1,
      tripping_in_open_hole: 1,
      tripping_out_open_hole: 1,
      rotating_on_bottom_open_hole: 1,
      slide_drilling_open_hole: 1,
      back_reaming_open_hole: 1,
      rotating_off_bottom_open_hole: 1,
      caisings: [],
    }
  });

  // useFieldArray for managing the caisings
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'caisings' 
  });

  const onSubmit = async (data: FormData) => {
    const newHole = {
      case_id: caseId,
      ...data
    };
    console.log(newHole)

    try {
      if (type === 'post') {
        await instance.post(`/api/v1/holes?caseId=${caseId}`, newHole);
        toast.success('Новая скважина была добавлена');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/holes/${id}`, newHole);
        toast.success('Скважина была обновлена');
      }
      if (onSuccess) {
        onSuccess(newHole)
      }
      navigate(`/cases/${caseId}`);
    } catch (error) {
      toast.error('Ошибка при обработке скважины');
    }
  };

  return (
    <div className='w-screen flex flex-col justify-center items-center'>
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4">
          {type === "post" ? "Создать новую скважину" : "Обновить эту скважину"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          {/* Hole Fields */}
          <div className="input-wrapper">
            <label htmlFor="open_hole_md_top">MD Top</label>
            <input step="any" {...register('open_hole_md_top', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите MD Top" />
            {errors.open_hole_md_top && <p>{errors.open_hole_md_top.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="open_hole_md_base">MD Base</label>
            <input step="any" {...register('open_hole_md_base', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите MD Base" />
            {errors.open_hole_md_base && <p>{errors.open_hole_md_base.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="open_hole_length">Hole Length</label>
            <input step="any" {...register('open_hole_length', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите длину скважины" />
            {errors.open_hole_length && <p>{errors.open_hole_length.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="open_hole_vd">Vertical depth</label>
            <input step="any" {...register('open_hole_vd', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите вертикальную глубину" />
            {errors.open_hole_vd && <p>{errors.open_hole_vd.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="effective_diameter">Effective diameter</label>
            <input step="any" {...register('effective_diameter', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите эффективный диаметр" />
            {errors.effective_diameter && <p>{errors.effective_diameter.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="friction_factor_open_hole">Friction factor open hole</label>
            <input step="any" {...register('friction_factor_open_hole', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите коэффициент трения открытого ствола" />
            {errors.friction_factor_open_hole && <p>{errors.friction_factor_open_hole.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="linear_capacity_open_hole">Linear capacity open hole</label>
            <input step="any" {...register('linear_capacity_open_hole', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите линейную емкость открытого ствола" />
            {errors.linear_capacity_open_hole && <p>{errors.linear_capacity_open_hole.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="volume_excess">Volume excess</label>
            <input step="any" {...register('volume_excess', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите избыточный обьем" />
            {errors.volume_excess && <p>{errors.volume_excess.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="description_open_hole">Description open hole</label>
            <input {...register('description_open_hole')} type="text" placeholder="Введите описание открытого ствола" />
            {errors.description_open_hole && <p>{errors.description_open_hole.message}</p>}
          </div>

          {/* Friction Factor Fields - Casing */}
          <div className="input-wrapper">
            <label htmlFor="tripping_in_caising">Tripping In Casing</label>
            <input step="any" {...register('tripping_in_caising', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.tripping_in_caising && <p>{errors.tripping_in_caising.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="tripping_out_caising">Tripping Out Casing</label>
            <input step="any" {...register('tripping_out_caising', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.tripping_out_caising && <p>{errors.tripping_out_caising.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="rotating_on_bottom_caising">Rotating On Bottom Casing</label>
            <input step="any" {...register('rotating_on_bottom_caising', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.rotating_on_bottom_caising && <p>{errors.rotating_on_bottom_caising.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="slide_drilling_caising">Slide Drilling Casing</label>
            <input step="any" {...register('slide_drilling_caising', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.slide_drilling_caising && <p>{errors.slide_drilling_caising.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="back_reaming_caising">Back Reaming Casing</label>
            <input step="any" {...register('back_reaming_casing', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.back_reaming_casing && <p>{errors.back_reaming_casing.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="rotating_off_bottom_caising">Rotating Off Bottom Casing</label>
            <input step="any" {...register('rotating_off_bottom_caising', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.rotating_off_bottom_caising && <p>{errors.rotating_off_bottom_caising.message}</p>}
          </div>

          {/* Friction Factor Fields - Open Hole */}
          <div className="input-wrapper">
            <label htmlFor="tripping_in_open_hole">Tripping In Open Hole</label>
            <input step="any" {...register('tripping_in_open_hole', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.tripping_in_open_hole && <p>{errors.tripping_in_open_hole.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="tripping_out_open_hole">Tripping Out Open Hole</label>
            <input step="any" {...register('tripping_out_open_hole', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.tripping_out_open_hole && <p>{errors.tripping_out_open_hole.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="rotating_on_bottom_open_hole">Rotating On Bottom Open Hole</label>
            <input step="any" {...register('rotating_on_bottom_open_hole', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.rotating_on_bottom_open_hole && <p>{errors.rotating_on_bottom_open_hole.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="slide_drilling_open_hole">Slide Drilling Open Hole</label>
            <input step="any" {...register('slide_drilling_open_hole', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.slide_drilling_open_hole && <p>{errors.slide_drilling_open_hole.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="back_reaming_open_hole">Back Reaming Open Hole</label>
            <input step="any" {...register('back_reaming_open_hole', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.back_reaming_open_hole && <p>{errors.back_reaming_open_hole.message}</p>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="rotating_off_bottom_open_hole">Rotating Off Bottom Open Hole</label>
            <input step="any" {...register('rotating_off_bottom_open_hole', {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите значение" />
            {errors.rotating_off_bottom_open_hole && <p>{errors.rotating_off_bottom_open_hole.message}</p>}
          </div>

          {/* Caisings */}
          {fields.map((field, index) => (
            <div key={field.id}>
              <h2>{index + 1}-я обсадка</h2>

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].md_top`}>MD Top</label>
                <input step="any" {...register(`caisings.${index}.md_top`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите MD Top" />
              </div>
              {errors.caisings?.[index]?.md_top && <p>{errors.caisings?.[index]?.md_top?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].md_base`}>MD Base</label>
                <input step="any" {...register(`caisings.${index}.md_base`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите MD Base" />
              </div>
              {errors.caisings?.[index]?.md_base && <p>{errors.caisings?.[index]?.md_base?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].length`}>Length</label>
                <input step="any" {...register(`caisings.${index}.length`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите длину" />
              </div>
              {errors.caisings?.[index]?.length && <p>{errors.caisings?.[index]?.length?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].shoe_md`}>Shoe MD</label>
                <input step="any" {...register(`caisings.${index}.shoe_md`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Shoe MD" />
              </div>
              {errors.caisings?.[index]?.shoe_md && <p>{errors.caisings?.[index]?.shoe_md?.message}</p>}


              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].od`}>OD</label>
                <input step="any" {...register(`caisings.${index}.od`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите OD" />
              </div>
              {errors.caisings?.[index]?.od && <p>{errors.caisings?.[index]?.od?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].vd`}>VD</label>
                <input step="any" {...register(`caisings.${index}.vd`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите VD" />
              </div>
              {errors.caisings?.[index]?.vd && <p>{errors.caisings?.[index]?.vd?.message}</p>}


              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].drift_id`}>Drift ID</label>
                <input step="any" {...register(`caisings.${index}.drift_id`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Drift ID" />
              </div>
              {errors.caisings?.[index]?.drift_id && <p>{errors.caisings?.[index]?.drift_id?.message}</p>}


              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].effective_hole_diameter`}>Effective Hole Diameter</label>
                <input step="any" {...register(`caisings.${index}.effective_hole_diameter`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Effective Hole Diameter" />
              </div>
              {errors.caisings?.[index]?.effective_hole_diameter && <p>{errors.caisings?.[index]?.effective_hole_diameter?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].weight`}>Weight</label>
                <input step="any" {...register(`caisings.${index}.weight`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Weight" />
              </div>
              {errors.caisings?.[index]?.weight && <p>{errors.caisings?.[index]?.weight?.message}</p>}


              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].grade`}>Grade</label>
                <input {...register(`caisings.${index}.grade`)} type="text" placeholder="Введите Grade" />
              </div>
              {errors.caisings?.[index]?.grade && <p>{errors.caisings?.[index]?.grade?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].min_yield_strength`}>Min Yield Strength</label>
                <input step="any" {...register(`caisings.${index}.min_yield_strength`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Min Yield Strength" />
              </div>
              {errors.caisings?.[index]?.min_yield_strength && <p>{errors.caisings?.[index]?.min_yield_strength?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].burst_rating`}>Burst Rating</label>
                <input step="any" {...register(`caisings.${index}.burst_rating`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Burst Rating" />
              </div>
              {errors.caisings?.[index]?.burst_rating && <p>{errors.caisings?.[index]?.burst_rating?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].collapse_rating`}>Collapse Rating</label>
                <input step="any" {...register(`caisings.${index}.collapse_rating`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Collapse Rating" />
              </div>
              {errors.caisings?.[index]?.collapse_rating && <p>{errors.caisings?.[index]?.collapse_rating?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].friction_factor_caising`}>Friction Factor Casing</label>
                <input step="any" {...register(`caisings.${index}.friction_factor_caising`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Friction Factor" />
              </div>
              {errors.caisings?.[index]?.friction_factor_caising && <p>{errors.caisings?.[index]?.friction_factor_caising?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].linear_capacity_caising`}>Linear Capacity Casing</label>
                <input step="any" {...register(`caisings.${index}.linear_capacity_caising`, {
              setValueAs: (value) => Number(value),
            })} type="number" placeholder="Введите Linear Capacity" />
              </div>
              {errors.caisings?.[index]?.linear_capacity_caising && <p>{errors.caisings?.[index]?.linear_capacity_caising?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].description_caising`}>Description</label>
                <input {...register(`caisings.${index}.description_caising`)} type="text" placeholder="Введите Description" />
              </div>
              {errors.caisings?.[index]?.description_caising && <p>{errors.caisings?.[index]?.description_caising?.message}</p>}


              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].manufacturer_caising`}>Manufacturer</label>
                <input {...register(`caisings.${index}.manufacturer_caising`)} type="text" placeholder="Введите Manufacturer" />
              </div>
              {errors.caisings?.[index]?.manufacturer_caising && <p>{errors.caisings?.[index]?.manufacturer_caising?.message}</p>}

              <div className="input-wrapper">
                <label htmlFor={`caisings[${index}].model_caising`}>Model</label>
                <input {...register(`caisings.${index}.model_caising`)} type="text" placeholder="Введите Model" />
              </div>
              {errors.caisings?.[index]?.model_caising && <p>{errors.caisings?.[index]?.model_caising?.message}</p>}


              <button type="button" onClick={() => remove(index)}>Удалить обсадку</button>
            </div>)) }

          <button type="button" onClick={() => append({
            md_top: 10,
            md_base: 1,
            length: 1,
            shoe_md: undefined,
            od: 1,
            vd: 1,
            drift_id: 1,
            effective_hole_diameter: 1,
            weight: 1,
            grade: "",
            min_yield_strength: 1,
            burst_rating: 1,
            collapse_rating: 1,
            friction_factor_caising: 1,
            linear_capacity_caising: 1,
            description_caising: "",
            manufacturer_caising: "",
            model_caising: ""
          })}>
            Добавить обсадку
          </button>

          <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg'>
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            {type === 'put' && (<button onClick={() => { if(onSuccess) { onSuccess(); } }}>Закрыть</button>)}
          </div>
          {errors.root && <div className='text-red-400'>{errors.root.message}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateHole;