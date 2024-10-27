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
    <div className='flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg'>
      <div className='w-full'>
        <div className='bg-white shadow-sm rounded-lg p-5 mb-6'>
          <div className="grid grid-cols-1 gap-3 text-gray-700">
            <p>Глубина: <span className="font-semibold">{porePressureData?.tvd ?? 'N/A'}</span></p>
            <p>Давление: <span className="font-semibold">{porePressureData?.pressure ?? 'N/A'}</span></p>
            <p>Эквивалентная плотность бурового раствора: <span className="font-semibold">{porePressureData?.emw ?? 'N/A'}</span></p>
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
      <CreatePorePressureForm
        caseId={caseId}
        type="put"
        porePressures={porePressureData}
        onSuccess={onSuccess}
      />
    ) : (
      isPost && <CreatePorePressureForm caseId={caseId} type="post" onSuccess={onSuccess} />
    )
  );
}  
export default PorePressureDetail;