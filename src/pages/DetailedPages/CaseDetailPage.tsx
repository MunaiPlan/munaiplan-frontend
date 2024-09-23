import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { ICase, IWell } from '../../types/types';
import { toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import CreateWell from '../../components/forms/CreateWell';
import CreateCase from '../../components/forms/CreateCase';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [casE, setCase] = useState<ICase | null>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await instance.get<ICase>(`/api/v1/cases/${id}`);
        setCase(response.data);
      } catch (error) {
        toast.error('Failed to load case details');
      }
    };

    fetchCase();
  }, [id]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/cases/${id}`);
      toast.success('Кейс был удален');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the case');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(false);
  };

  if (!casE) {
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
                <h1>О кейсе: <label className='font-bold'>{casE.case_name}</label></h1>
                <p>Описание: <label className='font-bold'>{casE.case_description}</label></p>
                <h1>Буровая глубина: <label className='font-bold'>{casE.drill_depth}</label></h1>
                <p>Размер трубы: <label className='font-bold'>{casE.pipe_size}</label></p>
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
          casE && (
            <CreateCase
              prevName={casE.case_name}
              prevDescription={casE.case_description}
              prevDrillDepth={casE.drill_depth}
              prevPipeSize={casE.pipe_size}

              type='put'
              id={id}
              setIsEdit={setIsEdit}
              onSuccess={handleUpdateSuccess}
              trajectoryId={casE.trajectoryId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CaseDetail;