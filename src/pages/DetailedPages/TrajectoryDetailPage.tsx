import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { ITrajectory, IWell } from '../../types/types';
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
                <div>
                    {trajectory.headers?.[0] ? (
                        <>
                            <p>Клиент: <label className='font-bold'>{trajectory.headers[0].customer}</label></p>
                            <p>Проект: <label className='font-bold'>{trajectory.headers[0].project}</label></p>
                            <p>Тип профиля: <label className='font-bold'>{trajectory.headers[0].profile_type}</label></p>
                            <p>Поле: <label className='font-bold'>{trajectory.headers[0].field}</label></p>
                            <p>Ваше ссылочное имя: <label className='font-bold'>{trajectory.headers[0].your_ref}</label></p>
                            <p>Структура: <label className='font-bold'>{trajectory.headers[0].structure}</label></p>
                            <p>Номер работы: <label className='font-bold'>{trajectory.headers[0].job_number}</label></p>
                            <p>Устье: <label className='font-bold'>{trajectory.headers[0].wellhead}</label></p>
                            <p>Высота Kelly Bushing: <label className='font-bold'>{trajectory.headers[0].kelly_bushing_elev}</label></p>
                            <p>Профиль: <label className='font-bold'>{trajectory.headers[0].profile}</label></p>
                        </>
                    ) : (
                        <p>Нет данных для заголовка</p>
                    )}
                </div>
                <div>
                    {trajectory.units?.[0] ? (
                        <>
                            <p>MD: <label className='font-bold'>{trajectory.units[0].md}</label></p>
                            <p>Угол: <label className='font-bold'>{trajectory.units[0].incl}</label></p>
                            <p>Азимут: <label className='font-bold'>{trajectory.units[0].azim}</label></p>
                            <p>Под уровнем моря: <label className='font-bold'>{trajectory.units[0].sub_sea}</label></p>
                            <p>TVD: <label className='font-bold'>{trajectory.units[0].tvd}</label></p>
                            <p>Местные координаты (север): <label className='font-bold'>{trajectory.units[0].local_n_coord}</label></p>
                            <p>Местные координаты (восток): <label className='font-bold'>{trajectory.units[0].local_e_coord}</label></p>
                            <p>Глобальные координаты (север): <label className='font-bold'>{trajectory.units[0].global_n_coord}</label></p>
                            <p>Глобальные координаты (восток): <label className='font-bold'>{trajectory.units[0].global_e_coord}</label></p>
                            <p>Dogleg: <label className='font-bold'>{trajectory.units[0].dogleg}</label></p>
                            <p>Вертикальная секция: <label className='font-bold'>{trajectory.units[0].vertical_section}</label></p>
                        </>
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
              prevHeader={trajectory.headers[0]}
              prevUnit={trajectory.units[0]}
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