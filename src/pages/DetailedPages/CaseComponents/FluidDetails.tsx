import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IFluid } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateFluid from '../../../components/forms/CaseChildForms/CreateFluid';

interface IFluidForm {
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: (updatedFluid?: IFluid) => void;
}

const FluidDetail: FC<IFluidForm> = ({ caseId }) => {
  const navigate = useNavigate();
  const [isPost, setIsPost] = useState(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [fluidData, setFluidData] = useState<IFluid>()

  const onSuccess = (updatedFluid?: IFluid) => {
    if (updatedFluid) {
      setFluidData(updatedFluid);
    }
    setIsEdit(false);
    setIsPost(false);
  };

  useEffect(() => {
    const fetchFluid = async () => {
      try {
        const response = await instance.get(`/api/v1/fluids/?caseId=${caseId}`);
        console.log("FLUID");
        if (response.data != null) {
          setFluidData(response.data[0]);
          console.log(fluidData)
          setIsEdit(false);
          setIsPost(false);
        } else {
          console.log("NO")
          setIsPost(true);
        }
      
      } catch (error) {
        setIsPost(true);
      }
    };
    fetchFluid();
  }, [caseId]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/fluids/${fluidData?.id}`);
      toast.success('Раствор был удален');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the fluid');
    }
  };


  return !isEdit && !isPost ? (
    <div>
      <div className='flex flex-col justify-center items-center w-full'>
        <div className='items-starts rounded-lg px-4 py-2'>
          <h1>О растворе: <label className='font-bold'>{fluidData?.name}</label></h1>
          <p>Описание: <label className='font-bold'>{fluidData?.description}</label></p>
          <p>Плотность: <label className='font-bold'>{fluidData?.density}</label></p>
          <p>Тип раствора: <label className='font-bold'>{fluidData?.base_fluid.name}</label></p>
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
    (<CreateFluid caseId={caseId} type={"put"} prevDensity={fluidData?.density} prevDescription={fluidData?.description} prevName={fluidData?.name} prev_base_fluid_id={fluidData?.base_fluid.id} prev_fluid_base_type_id={fluidData?.fluid_base_type.id} id={fluidData?.id} onSuccess={onSuccess}/>) : 
      (isPost && <CreateFluid caseId={caseId} type={"post"} prevDensity={0} prevName={""} prevDescription={""} prev_base_fluid_id={""} prev_fluid_base_type_id={""} onSuccess={onSuccess} />)
  );
}
export default FluidDetail;