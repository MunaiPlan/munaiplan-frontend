import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { IField } from '../../types/types';
import { toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import CreateCompany from '../../components/forms/CreateCompany';
import { useDispatch } from 'react-redux';
import CreateField from '../../components/forms/CreateField';

const FieldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [field, setField] = useState<IField | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchField = async () => {
      try {
        const response = await instance.get<IField>(`/api/v1/fields/${id}`);
        setField(response.data);
      } catch (error) {
        toast.error('Failed to load field details');
      }
    };

    fetchField();
  }, [id]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/fields/${id}`);
      toast.success('Месторождение было удалено');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the company');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(false);
  };

  if (!field) {
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
                <h1>О месторождении: <label className='font-bold'>{field.name}</label></h1>
                <p>Описание: <label className='font-bold'>{field.description}</label></p>
                <p>Уровень сокращения: <label className='font-bold'>{field.reductionLevel}</label></p>
                <p>Активная полевая единица: <label className='font-bold'>{field.activeFieldUnit}</label></p>
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
          field && (
            <CreateField
              prevName={field.name}
              prevDescription={field.description}
              prevReductionLevel={field.reductionLevel}
              prevActiveFieldUnit={field.activeFieldUnit}
              type='put'
              id={id}
              onSuccess={handleUpdateSuccess}
              companyId={field.companyId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default FieldDetail;