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
    <div className='flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg'>
      <div className='flex flex-col w-full'>
        <div className='bg-white shadow-sm rounded-lg p-5 mb-6'>
          <h1 className='font-bold text-lg mb-4 text-gray-800'>О растворе: <span className='font-semibold'>{fluidData?.name}</span></h1>
          <div className='grid grid-cols-2 gap-4 text-gray-700'>
            <p>Описание: <span className='font-semibold'>{fluidData?.description}</span></p>
            <p>Плотность: <span className='font-semibold'>{fluidData?.density}</span></p>
            <p>Тип раствора: <span className='font-semibold'>{fluidData?.base_fluid.name}</span></p>
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
      <CreateFluid
        caseId={caseId}
        type={"put"}
        prevDensity={fluidData?.density}
        prevDescription={fluidData?.description}
        prevName={fluidData?.name}
        prev_base_fluid_id={fluidData?.base_fluid.id}
        prev_fluid_base_type_id={fluidData?.fluid_base_type.id}
        id={fluidData?.id}
        onSuccess={onSuccess}
      />
    ) : (
      isPost && (
        <CreateFluid
          caseId={caseId}
          type={"post"}
          prevDensity={0}
          prevName=""
          prevDescription=""
          prev_base_fluid_id=""
          prev_fluid_base_type_id=""
          onSuccess={onSuccess}
        />
      )
    )
  );
}  
export default FluidDetail;