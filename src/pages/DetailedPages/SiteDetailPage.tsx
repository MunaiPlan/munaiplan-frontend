import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { ISite } from '../../types/types';
import { toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import CreateSite from '../../components/forms/CreateSite';

const SiteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<ISite | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await instance.get<ISite>(`/api/v1/sites/${id}`);
        setSite(response.data);
      } catch (error) {
        toast.error('Failed to load site details');
      }
    };

    fetchSite();
  }, [id]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/sites/${id}`);
      toast.success('Куст был удален');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the site');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(false);
  };

  if (!site) {
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
                <h1>О кусте: <label className='font-bold'>{site.name}</label></h1>
                <p>Площадь: <label className='font-bold'>{site.area}</label></p>
                <p>Азимут: <label className='font-bold'>{site.azimuth}</label></p>
                <p>Блок: <label className='font-bold'>{site.block}</label></p>
                <p>Страна: <label className='font-bold'>{site.country}</label></p>
                <p>Штат: <label className='font-bold'>{site.state}</label></p>
                <p>Регион: <label className='font-bold'>{site.region}</label></p>
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
          site && (
            <CreateSite
              prevName={site.name}
              prevArea={site.area}
              prevAzimuth={site.azimuth}
              prevBlock={site.block}
              prevCountry={site.country}
              prevState={site.state}
              prevRegion={site.region}
              type='put'
              id={id}
              onSuccess={handleUpdateSuccess}
              fieldId={site.fieldId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default SiteDetail;