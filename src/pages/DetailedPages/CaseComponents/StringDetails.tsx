import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ISection, IString } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateString from '../../../components/forms/CaseChildForms/CreateString';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

interface IStringForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  prevName: string;
  prevDepth: number;
  prevSections: ISection[];
  onSuccess?: (updatedString?: IString) => void;
}

const StringDetail: FC<IStringForm> = ({ caseId }) => {
  const navigate = useNavigate();
  const [isPost, setIsPost] = useState(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [stringData, setStringData] = useState<IString>()
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchString = async () => {
      try {
        const response = await instance.get(`/api/v1/strings/?caseId=${caseId}`);
        if (response.data) {
          setStringData(response.data[0]);
          setIsPost(false);
        } else {
          setIsPost(true);
        }
      } catch (error) {
        setIsEdit(true);
      }
    };
    fetchString();
  }, [caseId]);

  const onSuccess = (updatedString?: IString) => {
    if (updatedString) {
      setStringData(updatedString);
    }
    setIsEdit(false);
    setIsPost(false);
  };

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/strings/${stringData?.id}`);
      toast.success('Колонна была удалена');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the string');
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return !isEdit && !isPost ? (
    <div className='flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg'>
      <div className='flex flex-col w-full'>
        <div className='bg-white shadow-sm rounded-lg p-5 mb-6'>
          <h1 className='font-bold text-lg mb-4 text-gray-800'>О колонне:</h1>
          <div className='grid grid-cols-2 gap-4 text-gray-700'>
            <p>Название колонны: <span className='font-semibold'>{stringData?.name}</span></p>
            <p>Описание: <span className='font-semibold'>{stringData?.depth}</span></p>
          </div>
        </div>
  
        {stringData?.sections && (
          <div className='bg-white shadow-sm rounded-lg p-5'>
            <h2 className='font-bold text-lg mb-4 text-gray-800'>Секции колонны</h2>
            {stringData?.sections.map((section, index) => (
              <div key={index} className="flex flex-col my-4 border-t border-gray-300 pt-4 transition-all duration-200 ease-in-out">
                <div
                  className='flex items-center text-gray-800 cursor-pointer'
                  onClick={() => toggleSection(index)}
                >
                  {expandedSections[index] ? <IoIosArrowDown className="mr-2" /> : <IoIosArrowForward className="mr-2" />}
                  <span className='font-semibold'>{index + 1}-я Секция</span>
                </div>
                {expandedSections[index] && (
                  <div className='grid grid-cols-2 gap-4 mt-2 text-gray-700'>
                    <p>Средняя длина стыка: <span className='font-semibold'>{section.avg_joint_length || 'Нет данных'}</span></p>
                    <p>Глубина корпуса: <span className='font-semibold'>{section.body_md || 'Нет данных'}</span></p>
                    <p>Длина корпуса: <span className='font-semibold'>{section.body_length || 'Нет данных'}</span></p>
                    <p>Внутренний диаметр корпуса: <span className='font-semibold'>{section.body_id || 'Нет данных'}</span></p>
                    <p>Внешний диаметр корпуса: <span className='font-semibold'>{section.body_od || 'Нет данных'}</span></p>
                    <p>Класс: <span className='font-semibold'>{section.class || 'Нет данных'}</span></p>
                    <p>Описание: <span className='font-semibold'>{section.description || 'Нет данных'}</span></p>
                    <p>Коэффициент трения: <span className='font-semibold'>{section.friction_coefficient || 'Нет данных'}</span></p>
                    <p>Марка стали: <span className='font-semibold'>{section.grade || 'Нет данных'}</span></p>
                    <p>Производитель: <span className='font-semibold'>{section.manufacturer || 'Нет данных'}</span></p>
                    <p>Материал: <span className='font-semibold'>{section.material || 'Нет данных'}</span></p>
                    <p>Минимальная прочность на растяжение: <span className='font-semibold'>{section.min_yield_strength || 'Нет данных'}</span></p>
                    <p>Внутренний диаметр стабилизатора: <span className='font-semibold'>{section.stabilizer_id || 'Нет данных'}</span></p>
                    <p>Длина стабилизатора: <span className='font-semibold'>{section.stabilizer_length || 'Нет данных'}</span></p>
                    <p>Внешний диаметр стабилизатора: <span className='font-semibold'>{section.stabilizer_od || 'Нет данных'}</span></p>
                    <p>Тип: <span className='font-semibold'>{section.type || 'Нет данных'}</span></p>
                    <p>Вес: <span className='font-semibold'>{section.weight || 'Нет данных'}</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
  
      <div className='flex w-full items-center justify-center gap-x-4 mt-6'>
        <button
          className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200'
          onClick={() => setIsEdit(true)}
        >
          Изменить
        </button>
        <button
          className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200'
          onClick={handleDelete}
        >
          Удалить
        </button>
      </div>
    </div>
  ) : (
    isEdit ? (
      <CreateString
        caseId={caseId}
        type="put"
        prevName={stringData?.name}
        prevDepth={stringData?.depth}
        prevSections={stringData?.sections}
        id={stringData?.id}
        onSuccess={onSuccess}
      />
    ) : (
      <CreateString caseId={caseId} type="post" prevDepth={0} prevName="" prevSections={[]} onSuccess={onSuccess} />
    )
  );
}  

export default StringDetail;