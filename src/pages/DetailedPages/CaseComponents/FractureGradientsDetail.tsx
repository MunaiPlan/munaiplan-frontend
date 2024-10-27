import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../../api/axios.api';
import CreateFractureGradientForm from '../../../components/forms/CaseChildForms/CreateFractureGradient';

interface IFractureGradientDetailForm {
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: (updatedFrac?: IFractureGradient) => void;
}

export interface IFractureGradient {
    id?: string;
    temperature_at_surface: number;
    temperature_at_well_tvd: number;
    temperature_gradient: number;
    well_tvd: number;
}

const FractureGradientsDetail: FC<IFractureGradientDetailForm> = ({ caseId }) => {
  const navigate = useNavigate();
  const [isPost, setIsPost] = useState(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [fractureGradientData, setFractureGradientData] = useState<IFractureGradient>()

  const onSuccess = (updatedFrac?: IFractureGradient) => {
    if (updatedFrac) {
      setFractureGradientData(updatedFrac);
    }
    setIsEdit(false);
    setIsPost(false);
  };

  useEffect(() => {
    const fetchFractureGradient = async () => {
      try {
        const response = await instance.get(`/api/v1/fracture-gradients/?caseId=${caseId}`);
        if (response.data != null) {
          setFractureGradientData(response.data[0]);
          console.log(fractureGradientData)
          if (onSuccess) {
              onSuccess();
          }
        } else {
          console.log("NO")
          setIsPost(true);
        }
      
      } catch (error) {
        setIsPost(true);
      }
    };
    fetchFractureGradient();
  }, [caseId]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/fracture-gradients/${fractureGradientData?.id}`);
      toast.success('Разрыв пласта была удалена');
      setIsPost(true);
    } catch (error) {
      console.log(error)
      toast.error('Не получилось удалить разрыв пласта');
    }
  };

  return !isEdit && !isPost ? (
    <div className='flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg'>
      <div className='w-full'>
        <div className='bg-white shadow-sm rounded-lg p-5 mb-6'>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p>Температура на поверхности: <span className="font-semibold">{fractureGradientData?.temperature_at_surface}</span></p>
            <p>Температура на истинной вертикальной глубине скважины: <span className="font-semibold">{fractureGradientData?.temperature_at_well_tvd}</span></p>
            <p>Градиент температуры: <span className="font-semibold">{fractureGradientData?.temperature_gradient}</span></p>
            <p>Истинная вертикальная глубина скважины: <span className="font-semibold">{fractureGradientData?.well_tvd}</span></p>
          </div>
        </div>
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
      <CreateFractureGradientForm
        caseId={caseId}
        type="put"
        fractureGradients={{
          id: fractureGradientData?.id ?? "",
          temperature_at_surface: fractureGradientData?.temperature_at_surface ?? 0,
          temperature_at_well_tvd: fractureGradientData?.temperature_at_well_tvd ?? 0,
          temperature_gradient: fractureGradientData?.temperature_gradient ?? 0,
          well_tvd: fractureGradientData?.well_tvd ?? 0,
        }}
        onSuccess={onSuccess}
      />
    ) : (
      isPost && <CreateFractureGradientForm caseId={caseId} type="post" onSuccess={onSuccess} />
    )
  );
}  
export default FractureGradientsDetail;