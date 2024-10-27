import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IRig } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateRig from '../../../components/forms/CaseChildForms/CreateRig';

interface IRigForm {
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: (updatedRig?: IRig) => void;
}

const RigDetail: FC<IRigForm> = ({ caseId }) => {
  const navigate = useNavigate();
  const [isPost, setIsPost] = useState(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [rigData, setRigData] = useState<IRig>();

  // Callback for successful create/update
  const onSuccess = (updatedRig?: IRig) => {
    if (updatedRig) {
      setRigData(updatedRig); // Update rigData to reflect new values immediately
    }
    setIsEdit(false);
    setIsPost(false);
  };

  useEffect(() => {
    const fetchRigData = async () => {
      try {
        const response = await instance.get(`/api/v1/rigs/?caseId=${caseId}`);
        if (response.data && response.data.length > 0) {
          setRigData(response.data[0]);
          setIsPost(false);
        } else {
          setIsPost(true);
        }
      } catch (error) {
        toast.error("Failed to load rig data");
        setIsPost(true);
      }
    };
    fetchRigData();
  }, [caseId]);

  const handleDelete = async () => {
    try {
      console.log("RIGDATA")
      console.log(rigData)
      await instance.delete(`/api/v1/rigs/${rigData?.id}`);
      toast.success('Буровая была удалена');
      onSuccess();
    } catch (error) {
      toast.error('Failed to delete the rig');
    }
  };

  return !isEdit && !isPost ? (
    <div className='flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg'>
      <div className='flex flex-col w-full'>
        <div className='bg-white shadow-sm rounded-lg p-5 mb-6'>
          <h1 className='font-bold text-lg mb-4 text-gray-800'>О буровом:</h1>
          <div className='grid grid-cols-2 gap-4 text-gray-700'>
            <p>Номинальная нагрузка блока: <span className='font-semibold'>{rigData?.block_rating}</span></p>
            <p>Номинальный крутящий момент: <span className='font-semibold'>{rigData?.torque_rating}</span></p>
            <p>Номинальное рабочее давление: <span className='font-semibold'>{rigData?.rated_working_pressure}</span></p>
            <p>Номинальное давление противовыбросового превентора (ПВП): <span className='font-semibold'>{rigData?.bop_pressure_rating}</span></p>
            <p>Потери давления на поверхности: <span className='font-semibold'>{rigData?.surface_pressure_loss}</span></p>
            <p>Длина стояка: <span className='font-semibold'>{rigData?.standpipe_length}</span></p>
            <p>Внутренний диаметр стояка: <span className='font-semibold'>{rigData?.standpipe_internal_diameter}</span></p>
            <p>Длина шланга: <span className='font-semibold'>{rigData?.hose_length}</span></p>
            <p>Внутренний диаметр шланга: <span className='font-semibold'>{rigData?.hose_internal_diameter}</span></p>
            <p>Длина вертлюга: <span className='font-semibold'>{rigData?.swivel_length}</span></p>
            <p>Внутренний диаметр вертлюга: <span className='font-semibold'>{rigData?.swivel_internal_diameter}</span></p>
            <p>Длина ведущей трубы: <span className='font-semibold'>{rigData?.kelly_length}</span></p>
            <p>Внутренний диаметр ведущей трубы: <span className='font-semibold'>{rigData?.kelly_internal_diameter}</span></p>
            <p>Длина нагнетательной линии насоса: <span className='font-semibold'>{rigData?.pump_discharge_line_length}</span></p>
            <p>Внутренний диаметр нагнетательной линии насоса: <span className='font-semibold'>{rigData?.pump_discharge_line_internal_diameter}</span></p>
            <p>Длина сборки верхнего привода: <span className='font-semibold'>{rigData?.top_drive_stackup_length}</span></p>
            <p>Внутренний диаметр сборки верхнего привода: <span className='font-semibold'>{rigData?.top_drive_stackup_internal_diameter}</span></p>
          </div>
        </div>
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
      <CreateRig caseId={caseId} type={"put"} rig={rigData} onSuccess={onSuccess} />
    ) : (
      isPost && <CreateRig caseId={caseId} type={"post"} setIsEdit={setIsEdit} onSuccess={onSuccess} />
    )
  );
}  

export default RigDetail;