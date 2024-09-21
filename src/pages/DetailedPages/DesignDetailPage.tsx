import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { IDesign, IWell } from '../../types/types';
import { toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import CreateWell from '../../components/forms/CreateWell';
import CreateDesign from '../../components/forms/CreateDesign';
import { store } from '../../store/store';

const DesignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [design, setDesign] = useState<IDesign | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const response = await instance.get<IDesign>(`/api/v1/designs/${id}`);
        setDesign(response.data);
      } catch (error) {
        toast.error('Failed to load design details');
      }
    };

    fetchDesign();
  }, [id]);

  const getWellboreIdFromStore = (): string | null => {
    const state = store.getState(); 
    return state.design.wellboreId; 
  }

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/designs/${id}`);
      toast.success('Дизайн был удален');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the design');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(false);
  };

  if (!design) {
    return <div>Loading...</div>;
  }

  return (
    <div className='h-screen w-full flex'>
      <div className='w-1/5'>
        <SideBar />
      </div>
      <div className='flex flex-col h-screen w-4/5 justify-center items-center gap-y-4'>
        {!isEdit ? (
          <>
            <div className='flex flex-col justify-center items-center w-full'>
              <div className='items-starts border-2 border-black rounded-lg px-4 py-2'>
                <h1>О дизайне: <label className='font-bold'>{design.plan_name}</label></h1>
                <p>Стадия: <label className='font-bold'>{design.stage}</label></p>
                <p>Версия: <label className='font-bold'>{design.version}</label></p>
              </div>
            </div>
            <div className='flex w-full items-center justify-center gap-x-4'>
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
          </>
        ) : (
          design && (
            <CreateDesign
              prevName={design.plan_name}
              prevActualDate={design.actualDate}
              prevStage={design.stage}
              prevVersion={design.version}
              type='put'
              id={id}
              setIsEdit={setIsEdit}
              
              onSuccess={handleUpdateSuccess}
              wellBoreId={design.wellboreId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default DesignDetail;