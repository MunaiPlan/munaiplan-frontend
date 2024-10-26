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
    <div>
      <div className='w-full'>
        <div className='rounded-lg px-4 py-2'>
            <div className="mb-4">
                <p>Температура на поверхности: <label className="font-bold">{fractureGradientData?.temperature_at_surface}</label></p>
                <p>Температура на истинной вертикальной глубине скважины: <label className="font-bold">{fractureGradientData?.temperature_at_well_tvd}</label></p>
                <p>Градиент температуры: <label className="font-bold">{fractureGradientData?.temperature_gradient}</label></p>
                <p>Истинная вертикальная глубина скважины: <label className="font-bold">{fractureGradientData?.well_tvd}</label></p>
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
  ) : (isEdit ?
    (<CreateFractureGradientForm caseId={caseId} type={"put"} fractureGradients={{
        id: fractureGradientData?.id ?? "",
        temperature_at_surface: fractureGradientData?.temperature_at_surface ?? 0,
        temperature_at_well_tvd: fractureGradientData?.temperature_at_well_tvd ?? 0,
        temperature_gradient: fractureGradientData?.temperature_gradient ?? 0,
        well_tvd: fractureGradientData?.well_tvd ?? 0,
      }} onSuccess={onSuccess}/>) : 
      (isPost && <CreateFractureGradientForm caseId={caseId} type={"post"} onSuccess={onSuccess} />)
  );
}
export default FractureGradientsDetail;