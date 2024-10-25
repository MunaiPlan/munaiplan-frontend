import { FC, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { string, z } from 'zod';
import { ISection, IString } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateString from '../../../components/forms/CaseChildForms/CreateString';
import CreateHole, { CaisingData } from '../../../components/forms/CaseChildForms/CreateHole';

interface IHoleForm {
    type: "put" | "post";
    id?: string;
    caseId: string;
    prevHole?: HoleData;
    setIsEdit?: (edit: boolean) => void;
    onSuccess?: () => void;
  }

  interface HoleData {
    id: string;
    open_hole_md_top: number;  // YES
    open_hole_md_base: number; // YES
    open_hole_length: number; // YES
    open_hole_vd: number; // YES
    effective_diameter: number; // YES
    friction_factor_open_hole: number; // YES
    linear_capacity_open_hole: number; // YES
    volume_excess?: number; // YES
    description_open_hole?: string; // YES
  
    tripping_in_caising: number; // YES
    tripping_out_caising: number; // YES
    rotating_on_bottom_caising: number; // YES
    slide_drilling_caising: number; // YES
    back_reaming_caising: number; // YES
    rotating_off_bottom_caising: number; // YES
    tripping_in_open_hole: number; // 
    tripping_out_open_hole: number; // 
    rotating_on_bottom_open_hole: number;
    slide_drilling_open_hole: number;
    back_reaming_open_hole: number; // YEs
  
    rotating_off_bottom_open_hole: number; // YES
    caisings: CaisingData[];
  }
const HoleDetail: FC<IHoleForm> = ({ type, id, prevHole, onSuccess, caseId }) => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [holeData, setHoleData] = useState<HoleData>()
  useEffect(() => {
    const fetchHole = async () => {
      try {
        const response = await instance.get(`/api/v1/holes/?caseId=${caseId}`);
        console.log(response)
        if (response.data) {
          setHoleData(response.data);
        } else {
          console.log("NO")
        }
      
      } catch (error) {
        setIsEdit(false);
      }
    };
    fetchHole();
  }, [caseId]);

  const handleDelete = async () => {
    try {
      console.log(holeData)
      toast.success("ID" + holeData?.id)
      await instance.delete(`/api/v1/strings/${holeData?.id}`);
      toast.success('Скважина была удалена');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the hole');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(true);
  };

  return !isEdit ? (
    <div>
      <div className='flex flex-col justify-center items-center w-full'>
        <div className='items-starts rounded-lg px-4 py-2'>
          <h1>О колонне: <label className='font-bold'>{holeData?.back_reaming_caising}</label></h1>
          <p>Глубина: <label className='font-bold'>{holeData?.back_reaming_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.description_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.effective_diameter}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.friction_factor_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.linear_capacity_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.open_hole_length}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.open_hole_md_base}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.open_hole_md_top}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.open_hole_vd}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.rotating_off_bottom_caising}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.rotating_off_bottom_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.rotating_on_bottom_caising}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.rotating_on_bottom_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.slide_drilling_caising}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.slide_drilling_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.tripping_in_caising}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.tripping_in_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.tripping_out_caising}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.tripping_out_open_hole}</label></p>
          <p>Глубина: <label className='font-bold'>{holeData?.volume_excess}</label></p>
                <div className='flex flex-col justify-center items-center w-full'>
                  <div className='items-starts border-2 border-black rounded-lg px-4 py-2'>
                    {holeData?.caisings && (
                    holeData?.caisings.map((caising, index) => (
                      <div key={index} className="mb-4">
                        <h3 className='font-bold'>{index + 1}-й заголовок</h3>
                        <p>Средняя длина стыка: <label className='font-bold'>{caising.burst_rating || 'Нет данных'}</label></p>
                        <p>Внутренний диаметр корпуса: <label className='font-bold'>{caising.collapse_rating || 'Нет данных'}</label></p>
                        <p>Внешний диаметр корпуса: <label className='font-bold'>{caising.description_caising || 'Нет данных'}</label></p>
                        <p>Класс: <label className='font-bold'>{caising.drift_id || 'Нет данных'}</label></p>
                        <p>Описание: <label className='font-bold'>{caising.effective_hole_diameter || 'Нет данных'}</label></p>
                        <p>Коэффициент трения: <label className='font-bold'>{caising.friction_factor_caising || 'Нет данных'}</label></p>
                        <p>Марка стали: <label className='font-bold'>{caising.grade || 'Нет данных'}</label></p>
                        <p>Производитель: <label className='font-bold'>{caising.length || 'Нет данных'}</label></p>
                        <p>Материал: <label className='font-bold'>{caising.linear_capacity_caising || 'Нет данных'}</label></p>
                        <p>Минимальная прочность на растяжение: <label className='font-bold'>{caising.manufacturer_caising || 'Нет данных'}</label></p>
                        <p>Внутренний диаметр стабилизатора: <label className='font-bold'>{caising.md_base || 'Нет данных'}</label></p>
                        <p>Длина стабилизатора: <label className='font-bold'>{caising.md_top || 'Нет данных'}</label></p>
                        <p>Внешний диаметр стабилизатора: <label className='font-bold'>{caising.min_yield_strength || 'Нет данных'}</label></p>
                        <p>Тип: <label className='font-bold'>{caising.model_caising || 'Нет данных'}</label></p>
                        <p>Вес: <label className='font-bold'>{caising.od || 'Нет данных'}</label></p>
                        <p>Внешний диаметр стабилизатора: <label className='font-bold'>{caising.shoe_md || 'Нет данных'}</label></p>
                        <p>Тип: <label className='font-bold'>{caising.vd || 'Нет данных'}</label></p>
                        <p>Вес: <label className='font-bold'>{caising.weight || 'Нет данных'}</label></p>
                      </div>
                    ))
                  )}
                </div>
                </div>
              </div>
            </div>
            <div className='flex w-full items-center justify-center gap-x-4 mb-10'>
              <button
                className='border-2 border-black px-2 py-1 rounded-md hover:bg-green-400'
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Изменить
              </button>
              <button
                className='border-2 border-black px-2 py-1 rounded-md hover:bg-red-400'
                onClick={handleDelete}
              >
                Удалить
              </button>
            </div>
    </div>
  ) : (
    <CreateHole caseId={caseId} type={"put"} prevHole={holeData} id={holeData?.id}/>
  );
}
export default HoleDetail;