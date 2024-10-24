import { FC, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { string, z } from 'zod';
import { ISection, IString } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateString from '../../../components/forms/CaseChildForms/CreateString';

interface IStringForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  prevName: string;
  prevDepth: number;
  prevSections: ISection[];
  onSuccess?: () => void;
}

const StringDetail: FC<IStringForm> = ({ type, id, prevName, prevDepth, prevSections, onSuccess, caseId }) => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [stringData, setStringData] = useState<IString>()
  const [isAlready, setIsAlready] = useState<boolean>(false)
  useEffect(() => {
    const fetchString = async () => {
      try {
        const response = await instance.get(`/api/v1/strings/?caseId=${caseId}`);
        console.log(response.data)
        if (response.data) {
          setStringData(response.data[0]);
          console.log(response.data[0])
          setIsAlready(true);
        } else {
          console.log("NO")
          setIsAlready(false);
        }
      
      } catch (error) {
        setIsAlready(false);
      }
    };
    fetchString();
  }, [caseId]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/strings/${stringData}`);
      toast.success('Колонна была удалена');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the string');
    }
  };

  const handleUpdateSuccess = () => {
    setIsAlready(false);
  };

  return !isEdit ? (
    <div>
      <div className='flex flex-col justify-center items-center w-full'>
        <div className='items-starts rounded-lg px-4 py-2'>
          <h1>О колонне: <label className='font-bold'>{stringData?.name}</label></h1>
          <p>Описание: <label className='font-bold'>{stringData?.depth}</label></p>
                <div className='flex flex-col justify-center items-center w-full'>
                  <div className='items-starts border-2 border-black rounded-lg px-4 py-2'>
                    {stringData?.sections && (
                    stringData?.sections.map((section, index) => (
                      <div key={index} className="mb-4">
                        <h3 className='font-bold'>{index + 1}-й заголовок</h3>
                        <p>Средняя длина стыка: <label className='font-bold'>{section.avg_joint_length || 'Нет данных'}</label></p>
                        <p>Внутренний диаметр корпуса: <label className='font-bold'>{section.body_id || 'Нет данных'}</label></p>
                        <p>Внешний диаметр корпуса: <label className='font-bold'>{section.body_od || 'Нет данных'}</label></p>
                        <p>Класс: <label className='font-bold'>{section.class || 'Нет данных'}</label></p>
                        <p>Описание: <label className='font-bold'>{section.description || 'Нет данных'}</label></p>
                        <p>Коэффициент трения: <label className='font-bold'>{section.friction_coefficient || 'Нет данных'}</label></p>
                        <p>Марка стали: <label className='font-bold'>{section.grade || 'Нет данных'}</label></p>
                        <p>Производитель: <label className='font-bold'>{section.manufacturer || 'Нет данных'}</label></p>
                        <p>Материал: <label className='font-bold'>{section.material || 'Нет данных'}</label></p>
                        <p>Минимальная прочность на растяжение: <label className='font-bold'>{section.min_yield_strength || 'Нет данных'}</label></p>
                        <p>Внутренний диаметр стабилизатора: <label className='font-bold'>{section.stabilizer_id || 'Нет данных'}</label></p>
                        <p>Длина стабилизатора: <label className='font-bold'>{section.stabilizer_length || 'Нет данных'}</label></p>
                        <p>Внешний диаметр стабилизатора: <label className='font-bold'>{section.stabilizer_od || 'Нет данных'}</label></p>
                        <p>Тип: <label className='font-bold'>{section.type || 'Нет данных'}</label></p>
                        <p>Вес: <label className='font-bold'>{section.weight || 'Нет данных'}</label></p>
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
    <CreateString caseId={caseId} type={"put"} prevName={stringData?.name} prevDepth={stringData?.depth} prevSections={stringData?.sections} id={stringData?.id}/>
  );
}
export default StringDetail;