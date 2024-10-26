import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { HoleData, ICaising } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateHole from '../../../components/forms/CaseChildForms/CreateHole';
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

interface IHoleForm {
    type: "put" | "post";
    id?: string;
    caseId: string;
    prevHole?: HoleData;
    setIsEdit?: (edit: boolean) => void;
    onSuccess?: (updatedHole?: HoleData) => void;
}

const HoleDetail: FC<IHoleForm> = ({ caseId }) => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isPost, setIsPost] = useState<boolean>(true);
  const [holeData, setHoleData] = useState<HoleData>();
  const [expandedCaisings, setExpandedCaisings] = useState<{ [key: number]: boolean }>({}); // Track expanded states

  useEffect(() => {
    const fetchHole = async () => {
      try {
        const response = await instance.get(`/api/v1/holes/?caseId=${caseId}`);
        if (response.data) {
          setHoleData(response.data[0]);
          onSuccess();
        } else {
          console.log("NO");
        }
      } catch (error) {
        setIsEdit(false);
      }
    };
    fetchHole();
  }, [caseId]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/strings/${holeData?.id}`);
      toast.success('Скважина была удалена');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the hole');
    }
  };

  const onSuccess = (updatedHole?: HoleData) => {
    if (updatedHole) {
      setHoleData(updatedHole);
    }
    setIsEdit(false);
    setIsPost(false);
  };

  const toggleCaising = (index: number) => {
    setExpandedCaisings((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the expanded state for this caising
    }));
  };

  return !isEdit && !isPost ? (
    <div className='flex flex-col justify-start'>
      <div className='flex flex-col justify-start items-start w-full'>
        <div className='items-starts rounded-lg px-4 py-2'>
          <h1 className='font-bold'>О стволе:</h1>
          {/* Basic hole information here */}
          {/* Mapping Caisings */}
          {holeData?.caisings && (
            <div className='flex flex-col justify-center items-center w-full'>
              <div className='items-starts border-2 border-black rounded-lg px-4 py-2'>
          <p>Обратное развертывание обсадной колонны: <label className='font-bold'>{holeData?.back_reaming_casing}</label></p>
          <p>Обратное развертывание открытого ствола: <label className='font-bold'>{holeData?.back_reaming_open_hole}</label></p>
          <p>Описание открытого ствола: <label className='font-bold'>{holeData?.description_open_hole}</label></p>
          <p>Эффективный диаметр: <label className='font-bold'>{holeData?.effective_diameter}</label></p>
          <p>Коэффициент трения в открытом стволе: <label className='font-bold'>{holeData?.friction_factor_open_hole}</label></p>
          <p>Линейная вместимость открытого ствола: <label className='font-bold'>{holeData?.linear_capacity_open_hole}</label></p>
          <p>Длина открытого ствола: <label className='font-bold'>{holeData?.open_hole_length}</label></p>
          <p>Истинная глубина основания открытого ствола: <label className='font-bold'>{holeData?.open_hole_md_base}</label></p>
          <p>Истинная глубина начала открытого ствола: <label className='font-bold'>{holeData?.open_hole_md_top}</label></p>
          <p>Вертикальная глубина открытого ствола: <label className='font-bold'>{holeData?.open_hole_vd}</label></p>
          <p>Вращение при выключении на обсадной колонне: <label className='font-bold'>{holeData?.rotating_off_bottom_caising}</label></p>
          <p>Вращение при выключении в открытом стволе: <label className='font-bold'>{holeData?.rotating_off_bottom_open_hole}</label></p>
          <p>Вращение при включении на обсадной колонне: <label className='font-bold'>{holeData?.rotating_on_bottom_caising}</label></p>
          <p>Вращение при включении в открытом стволе: <label className='font-bold'>{holeData?.rotating_on_bottom_open_hole}</label></p>
          <p>Скользящее бурение на обсадной колонне: <label className='font-bold'>{holeData?.slide_drilling_caising}</label></p>
          <p>Скользящее бурение в открытом стволе: <label className='font-bold'>{holeData?.slide_drilling_open_hole}</label></p>
          <p>Спуск обсадной колонны: <label className='font-bold'>{holeData?.tripping_in_caising}</label></p>
          <p>Спуск в открытый ствол: <label className='font-bold'>{holeData?.tripping_in_open_hole}</label></p>
          <p>Подъем обсадной колонны: <label className='font-bold'>{holeData?.tripping_out_caising}</label></p>
          <p>Подъем из открытого ствола: <label className='font-bold'>{holeData?.tripping_out_open_hole}</label></p>
          <p>Избыточный объем: <label className='font-bold'>{holeData?.volume_excess}</label></p>
                {holeData?.caisings.map((caising, index) => (
                  caising ? (
                    <div key={index} className="flex flex-col my-3">
                      <div className='flex items-center justify-start' onClick={() => toggleCaising(index)}>
                        {expandedCaisings[index] ? <IoIosArrowDown/> : <IoIosArrowForward />}
                        <label
                          className="font-bold cursor-pointer"
                        >
                          {index + 1}-й заголовок
                        </label>
                      </div>
                      {expandedCaisings[index] && (
                        <div>
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
                      )}
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='flex w-full items-center justify-center gap-x-4 mb-10'>
        <button
          className='border-2 border-black px-2 py-1 rounded-md hover:bg-green-400'
          onClick={() => setIsEdit(true)}
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
    isEdit ? (
      <CreateHole caseId={caseId} type={"put"} prevHole={holeData} onSuccess={onSuccess} />
    ) : (
      <CreateHole caseId={caseId} type={"post"} onSuccess={onSuccess} />
    )
  );
};

export default HoleDetail;