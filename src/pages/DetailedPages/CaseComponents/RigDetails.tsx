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
    <div>
      <div className='flex flex-col justify-center items-center w-full'>
        <div className='items-start rounded-lg px-4 py-2'>
          <h1 className='font-bold'>О буровом:</h1>
          <p>Номинальная нагрузка блока: <label className='font-bold'>{rigData?.block_rating}</label></p>
          <p>Номинальный крутящий момент: <label className='font-bold'>{rigData?.torque_rating}</label></p>
          <p>Номинальное рабочее давление: <label className='font-bold'>{rigData?.rated_working_pressure}</label></p>
          <p>Номинальное давление противовыбросового превентора (ПВП): <label className='font-bold'>{rigData?.bop_pressure_rating}</label></p>
          <p>Потери давления на поверхности: <label className='font-bold'>{rigData?.surface_pressure_loss}</label></p>
          <p>Длина стояка: <label className='font-bold'>{rigData?.standpipe_length}</label></p>
          <p>Внутренний диаметр стояка: <label className='font-bold'>{rigData?.standpipe_internal_diameter}</label></p>
          <p>Длина шланга: <label className='font-bold'>{rigData?.hose_length}</label></p>
          <p>Внутренний диаметр шланга: <label className='font-bold'>{rigData?.hose_internal_diameter}</label></p>
          <p>Длина вертлюга: <label className='font-bold'>{rigData?.swivel_length}</label></p>
          <p>Внутренний диаметр вертлюга: <label className='font-bold'>{rigData?.swivel_internal_diameter}</label></p>
          <p>Длина ведущей трубы: <label className='font-bold'>{rigData?.kelly_length}</label></p>
          <p>Внутренний диаметр ведущей трубы: <label className='font-bold'>{rigData?.kelly_internal_diameter}</label></p>
          <p>Длина нагнетательной линии насоса: <label className='font-bold'>{rigData?.pump_discharge_line_length}</label></p>
          <p>Внутренний диаметр нагнетательной линии насоса: <label className='font-bold'>{rigData?.pump_discharge_line_internal_diameter}</label></p>
          <p>Длина сборки верхнего привода: <label className='font-bold'>{rigData?.top_drive_stackup_length}</label></p>
          <p>Внутренний диаметр сборки верхнего привода: <label className='font-bold'>{rigData?.top_drive_stackup_internal_diameter}</label></p>
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
  ) : (isEdit ? (
    <CreateRig caseId={caseId} type={"put"} rig={rigData} onSuccess={onSuccess} />
  ) : (
    isPost && <CreateRig caseId={caseId} type={"post"} setIsEdit={setIsEdit} onSuccess={onSuccess} />
  ));
};

export default RigDetail;