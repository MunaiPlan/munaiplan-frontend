import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { ITrajectory } from '../../types/types';
import { toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import CreateTrajectory from '../../components/forms/CreateTrajectory';

const TrajectoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trajectory, setTrajectory] = useState<ITrajectory | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrajectory = async () => {
      try {
        const response = await instance.get<ITrajectory>(`/api/v1/trajectories/${id}`);
        setTrajectory(response.data);
      } catch (error) {
        toast.error('Failed to load trajectory details');
      }
    };

    fetchTrajectory();
  }, [id]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/trajectories/${id}`);
      toast.success('Траектория была удалена');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the trajectory');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(false);
  };

  if (!trajectory) {
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
                <h1>О траектории: <label className='font-bold'>{trajectory.name}</label></h1>
                <p>Описание: <label className='font-bold'>{trajectory.description}</label></p>
                
                {/* Mapping through headers */}
                <div>
                  {trajectory.headers && trajectory.headers.length > 0 ? (
                    trajectory.headers.map((header, index) => (
                      <div key={index} className="mb-4">
                        <h3 className='font-bold'>Заголовок {index + 1}</h3>
                        <p>Клиент: <label className='font-bold'>{header.customer || 'Нет данных'}</label></p>
                        <p>Проект: <label className='font-bold'>{header.project || 'Нет данных'}</label></p>
                        <p>Тип профиля: <label className='font-bold'>{header.profile_type || 'Нет данных'}</label></p>
                        <p>Поле: <label className='font-bold'>{header.field || 'Нет данных'}</label></p>
                        <p>Ваше ссылочное имя: <label className='font-bold'>{header.your_ref || 'Нет данных'}</label></p>
                        <p>Структура: <label className='font-bold'>{header.structure || 'Нет данных'}</label></p>
                        <p>Номер работы: <label className='font-bold'>{header.job_number || 'Нет данных'}</label></p>
                        <p>Устье: <label className='font-bold'>{header.wellhead || 'Нет данных'}</label></p>
                        <p>Высота Kelly Bushing: <label className='font-bold'>{header.kelly_bushing_elev || 'Нет данных'}</label></p>
                        <p>Профиль: <label className='font-bold'>{header.profile || 'Нет данных'}</label></p>
                      </div>
                    ))
                  ) : (
                    <p>Нет данных для заголовка</p>
                  )}
                </div>

                {/* Mapping through units */}
                <div>
                  {trajectory.units && trajectory.units.length > 0 ? (
                    trajectory.units.map((unit, index) => (
                      <div key={index} className="mb-4">
                        <h3 className='font-bold'>Единица {index + 1}</h3>
                        <p>MD: <label className='font-bold'>{unit.md || 'Нет данных'}</label></p>
                        <p>Угол: <label className='font-bold'>{unit.incl || 'Нет данных'}</label></p>
                        <p>Азимут: <label className='font-bold'>{unit.azim || 'Нет данных'}</label></p>
                        <p>Под уровнем моря: <label className='font-bold'>{unit.sub_sea || 'Нет данных'}</label></p>
                        <p>TVD: <label className='font-bold'>{unit.tvd || 'Нет данных'}</label></p>
                        <p>Местные координаты (север): <label className='font-bold'>{unit.local_n_coord || 'Нет данных'}</label></p>
                        <p>Местные координаты (восток): <label className='font-bold'>{unit.local_e_coord || 'Нет данных'}</label></p>
                        <p>Глобальные координаты (север): <label className='font-bold'>{unit.global_n_coord || 'Нет данных'}</label></p>
                        <p>Глобальные координаты (восток): <label className='font-bold'>{unit.global_e_coord || 'Нет данных'}</label></p>
                        <p>Dogleg: <label className='font-bold'>{unit.dogleg || 'Нет данных'}</label></p>
                        <p>Вертикальная секция: <label className='font-bold'>{unit.vertical_section || 'Нет данных'}</label></p>
                      </div>
                    ))
                  ) : (
                    <p>Нет данных для единиц</p>
                  )}
                </div>
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
          trajectory && (
            <CreateTrajectory
              prevName={trajectory.name}
              prevDescription={trajectory.description}
              prevHeader={trajectory.headers}
              prevUnit={trajectory.units}
              type='put'
              id={id}
              setIsEdit={setIsEdit}
              onSuccess={handleUpdateSuccess}
              designId={trajectory.designId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TrajectoryDetail;