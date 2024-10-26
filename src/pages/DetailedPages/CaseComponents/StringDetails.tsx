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
    <div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="items-start rounded-lg px-4 py-2">
          <h1 className='font-bold'>О колонне:</h1>
          <div className="flex flex-col justify-center items-center w-full">
            <div className="items-start border-2 border-black rounded-lg px-4 py-2 max-w-full">
              <p>Название колонны: <label className="font-bold">{stringData?.name}</label></p>
              <p>Описание: <label className="font-bold">{stringData?.depth}</label></p>
              {stringData?.sections && (
                stringData?.sections.map((section, index) => (
                  <div
                    key={index}
                    className="mb-4 transition-all duration-200 ease-in-out"
                    style={{
                      minWidth: '300px',  // Fixed minimum width for consistent width
                      overflow: expandedSections[index] ? 'visible' : 'hidden',
                    }}
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleSection(index)}
                    >
                      {expandedSections[index] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                      <h3 className="font-bold ml-2">{index + 1}-я секция</h3>
                    </div>
                    {expandedSections[index] && (
                      <div className="mt-2">
                        <p>Средняя длина стыка: <label className="font-bold">{section.avg_joint_length || 'Нет данных'}</label></p>
                        <p>Глубина корпуса: <label className="font-bold">{section.body_md || 'Нет данных'}</label></p>
                        <p>Длина корпуса: <label className="font-bold">{section.body_length || 'Нет данных'}</label></p>
                        <p>Внутренний диаметр корпуса: <label className="font-bold">{section.body_id || 'Нет данных'}</label></p>
                        <p>Внешний диаметр корпуса: <label className="font-bold">{section.body_od || 'Нет данных'}</label></p>
                        <p>Класс: <label className="font-bold">{section.class || 'Нет данных'}</label></p>
                        <p>Описание: <label className="font-bold">{section.description || 'Нет данных'}</label></p>
                        <p>Коэффициент трения: <label className="font-bold">{section.friction_coefficient || 'Нет данных'}</label></p>
                        <p>Марка стали: <label className="font-bold">{section.grade || 'Нет данных'}</label></p>
                        <p>Производитель: <label className="font-bold">{section.manufacturer || 'Нет данных'}</label></p>
                        <p>Материал: <label className="font-bold">{section.material || 'Нет данных'}</label></p>
                        <p>Минимальная прочность на растяжение: <label className="font-bold">{section.min_yield_strength || 'Нет данных'}</label></p>
                        <p>Внутренний диаметр стабилизатора: <label className="font-bold">{section.stabilizer_id || 'Нет данных'}</label></p>
                        <p>Длина стабилизатора: <label className="font-bold">{section.stabilizer_length || 'Нет данных'}</label></p>
                        <p>Внешний диаметр стабилизатора: <label className="font-bold">{section.stabilizer_od || 'Нет данных'}</label></p>
                        <p>Тип: <label className="font-bold">{section.type || 'Нет данных'}</label></p>
                        <p>Вес: <label className="font-bold">{section.weight || 'Нет данных'}</label></p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-x-4 mb-10">
        <button
          className="border-2 border-black px-2 py-1 rounded-md hover:bg-green-400"
          onClick={() => setIsEdit(true)}
        >
          Изменить
        </button>
        <button
          className="border-2 border-black px-2 py-1 rounded-md hover:bg-red-400"
          onClick={handleDelete}
        >
          Удалить
        </button>
      </div>
    </div>
  ) : (isEdit ?
    <CreateString
      caseId={caseId}
      type="put"
      prevName={stringData?.name}
      prevDepth={stringData?.depth}
      prevSections={stringData?.sections}
      id={stringData?.id}
      onSuccess={onSuccess}
    /> : (
      <CreateString caseId={caseId} type="post" prevDepth={0} prevName="" prevSections={[]} onSuccess={onSuccess} />
    )
  );
}

export default StringDetail;