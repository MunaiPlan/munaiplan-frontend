import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IFluid, IPorePressure } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateFluid from '../../../components/forms/CaseChildForms/CreateFluid';
import CreatePorePressureForm, { IPorePressures } from '../../../components/forms/CaseChildForms/CreatePorePressure';

interface IPorePressureDetailForm {
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: (updatedPore?: IPorePressure) => void;
}

const PorePressureDetail: FC<IPorePressureDetailForm> = ({ caseId }) => {
  const navigate = useNavigate();
  const [isPost, setIsPost] = useState(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [porePressureData, setPorePressuresData] = useState<IPorePressure>()

  const onSuccess = (updatedPore?: IPorePressure) => {
    if (updatedPore) {
      setPorePressuresData(updatedPore)
    }
    setIsEdit(false);
    setIsPost(false);
  };

  useEffect(() => {
    const fetchPorePressure = async () => {
      try {
        const response = await instance.get(`/api/v1/pore-pressures/?caseId=${caseId}`);
        if (response.data != null) {
          setPorePressuresData(response.data[0]);
          console.log(porePressureData)
          onSuccess();
        } else {
          console.log("NO")
          setIsPost(true);
        }
      
      } catch (error) {
        setIsPost(true);
      }
    };
    fetchPorePressure();
  }, [caseId]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/pore-pressures/${porePressureData?.id}`)
      setIsPost(true);
    } catch (error) {
      toast.error('Не получилось удалить поровое давление');
    }
  };

  return !isEdit && !isPost ? (
    <div>
      <div className='w-full'>
        <div className='items-starts rounded-lg px-4 py-2'>
            <div className="mb-4">
                    <p>Глубина: <label className="font-bold">{porePressureData?.tvd ?? 'N/A'}</label></p>
                    <p>Давление: <label className="font-bold">{porePressureData?.pressure ?? 'N/A'}</label></p>
                    <p>Эквивалентная плотность бурового раствора: <label className="font-bold">{porePressureData?.emw ?? 'N/A'}</label></p>
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
    (<CreatePorePressureForm caseId={caseId} type={"put"} porePressures={porePressureData} onSuccess={onSuccess}/>) : 
      (isPost && <CreatePorePressureForm caseId={caseId} type={"post"} onSuccess={onSuccess} />)
  );
}
export default PorePressureDetail;