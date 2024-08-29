import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { ICompany } from '../../types/types';
import { toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import CreateCompany from '../../components/forms/CreateCompany';
import { useDispatch } from 'react-redux';

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<ICompany | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await instance.get<ICompany>(`/api/v1/companies/${id}`);
        setCompany(response.data);
      } catch (error) {
        toast.error('Failed to load company details');
      }
    };

    fetchCompany();
  }, [id]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/companies/${id}`);
      toast.success('Company deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the company');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(false);
  };

  if (!company) {
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
                <h1>О компании: <label className='font-bold'>{company.name}</label></h1>
                <p>Дивизия: <label className='font-bold'>{company.division}</label></p>
                <p>Группа: <label className='font-bold'>{company.group}</label></p>
                <p>Представитель: <label className='font-bold'>{company.representative}</label></p>
                <p>Адрес: <label className='font-bold'>{company.address}</label></p>
                <p>Телефонный номер: <label className='font-bold'>{company.phone}</label></p>
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
          company && (
            <CreateCompany
              prevName={company.name}
              prevDivision={company.division}
              prevGroup={company.group}
              prevAddress={company.address}
              prevRepresentative={company.representative}
              prevPhone={company.phone}
              type='put'
              id={id}
              onSuccess={handleUpdateSuccess}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;