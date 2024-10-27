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
    <div className='flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg'>
      <div className='flex flex-col w-full'>
        <div className='bg-white shadow-sm rounded-lg p-5 mb-6'>
          <h1 className='font-bold text-lg mb-4'>О стволе:</h1>
          <div className='grid grid-cols-2 gap-4 text-gray-700'>
            <p>Обратное развертывание обсадной колонны: <span className='font-semibold'>{holeData?.back_reaming_casing}</span></p>
            <p>Обратное развертывание открытого ствола: <span className='font-semibold'>{holeData?.back_reaming_open_hole}</span></p>
            <p>Описание открытого ствола: <span className='font-semibold'>{holeData?.description_open_hole}</span></p>
            <p>Эффективный диаметр: <span className='font-semibold'>{holeData?.effective_diameter}</span></p>
            <p>Коэффициент трения в открытом стволе: <span className='font-semibold'>{holeData?.friction_factor_open_hole}</span></p>
            <p>Линейная вместимость открытого ствола: <span className='font-semibold'>{holeData?.linear_capacity_open_hole}</span></p>
            <p>Длина открытого ствола: <span className='font-semibold'>{holeData?.open_hole_length}</span></p>
            <p>Истинная глубина основания открытого ствола: <span className='font-semibold'>{holeData?.open_hole_md_base}</span></p>
            <p>Истинная глубина начала открытого ствола: <span className='font-semibold'>{holeData?.open_hole_md_top}</span></p>
            <p>Вертикальная глубина открытого ствола: <span className='font-semibold'>{holeData?.open_hole_vd}</span></p>
            <p>Избыточный объем: <span className='font-semibold'>{holeData?.volume_excess}</span></p>
          </div>
        </div>
  
        {holeData?.caisings && (
          <div className='bg-white shadow-sm rounded-lg p-5'>
            <h2 className='font-bold text-lg mb-4'>Обсадная Колонна</h2>
            {holeData?.caisings.map((caising, index) => (
              caising ? (
                <div key={index} className="flex flex-col my-4 border-t border-gray-300 pt-4">
                  <div className='flex items-center text-gray-800 cursor-pointer' onClick={() => toggleCaising(index)}>
                    {expandedCaisings[index] ? <IoIosArrowDown className="mr-2"/> : <IoIosArrowForward className="mr-2"/>}
                    <span className='font-semibold'>{index + 1}-й Заголовок</span>
                  </div>
                  {expandedCaisings[index] && (
                    <div className='grid grid-cols-2 gap-4 mt-2 text-gray-700'>
                      <p>Средняя длина стыка: <span className='font-semibold'>{caising.burst_rating || 'Нет данных'}</span></p>
                      <p>Внутренний диаметр корпуса: <span className='font-semibold'>{caising.collapse_rating || 'Нет данных'}</span></p>
                      <p>Внешний диаметр корпуса: <span className='font-semibold'>{caising.description_caising || 'Нет данных'}</span></p>
                      <p>Класс: <span className='font-semibold'>{caising.drift_id || 'Нет данных'}</span></p>
                      <p>Описание: <span className='font-semibold'>{caising.effective_hole_diameter || 'Нет данных'}</span></p>
                      <p>Коэффициент трения: <span className='font-semibold'>{caising.friction_factor_caising || 'Нет данных'}</span></p>
                      <p>Марка стали: <span className='font-semibold'>{caising.grade || 'Нет данных'}</span></p>
                      <p>Производитель: <span className='font-semibold'>{caising.length || 'Нет данных'}</span></p>
                      <p>Материал: <span className='font-semibold'>{caising.linear_capacity_caising || 'Нет данных'}</span></p>
                      <p>Минимальная прочность на растяжение: <span className='font-semibold'>{caising.manufacturer_caising || 'Нет данных'}</span></p>
                      <p>Внутренний диаметр стабилизатора: <span className='font-semibold'>{caising.md_base || 'Нет данных'}</span></p>
                      <p>Длина стабилизатора: <span className='font-semibold'>{caising.md_top || 'Нет данных'}</span></p>
                      <p>Внешний диаметр стабилизатора: <span className='font-semibold'>{caising.min_yield_strength || 'Нет данных'}</span></p>
                      <p>Тип: <span className='font-semibold'>{caising.model_caising || 'Нет данных'}</span></p>
                      <p>Вес: <span className='font-semibold'>{caising.od || 'Нет данных'}</span></p>
                      <p>Внешний диаметр стабилизатора: <span className='font-semibold'>{caising.shoe_md || 'Нет данных'}</span></p>
                      <p>Тип: <span className='font-semibold'>{caising.vd || 'Нет данных'}</span></p>
                      <p>Вес: <span className='font-semibold'>{caising.weight || 'Нет данных'}</span></p>
                    </div>
                  )}
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>
  
      <div className='flex w-full items-center justify-center gap-x-4 mt-6'>
        <button
          className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md'
          onClick={() => setIsEdit(true)}
        >
          Изменить
        </button>
        <button
          className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow-md'
          onClick={handleDelete}
        >
          Удалить
        </button>
      </div>
    </div>
  ) : (
    isEdit ? (
      <CreateHole caseId={caseId} type={"put"} prevHole={holeData} id={holeData?.id} onSuccess={onSuccess} />
    ) : (
      <CreateHole caseId={caseId} type={"post"} onSuccess={onSuccess} />
    )
  );
}  

export default HoleDetail;