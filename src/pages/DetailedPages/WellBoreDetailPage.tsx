import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { IWell, IWellBore } from '../../types/types';
import { toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import CreateWell from '../../components/forms/CreateWell';
import CreateWellBore from '../../components/forms/CreateWellBore';

const WellBoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [wellbore, setWellbore] = useState<IWellBore | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWellBore = async () => {
      try {
        const response = await instance.get<IWellBore>(`/api/v1/wellbores/${id}`);
        setWellbore(response.data);
      } catch (error) {
        toast.error('Failed to load wellbore details');
      }
    };

    fetchWellBore();
  }, [id]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/wellbores/${id}`);
      toast.success('Ствол скважины была удалена');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the wellbore');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(false);
  };

  if (!wellbore) {
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
                <div className='items-start border-2 border-black rounded-lg px-4 py-2'>
                    <h1>О стволе скважины: <label className='font-bold'>{wellbore.name}</label></h1>
                    <p>Местоположение дна: <label className='font-bold'>{wellbore.bottom_hole_location}</label></p>
                    <p>Глубина ствола: <label className='font-bold'>{wellbore.wellbore_depth}</label> м</p>
                    <p>Среднее натяжение крюка: <label className='font-bold'>{wellbore.average_hook_load}</label> кН</p>
                    <p>Давление в колонне: <label className='font-bold'>{wellbore.riser_pressure}</label> бар</p>
                    <p>Средний входной поток: <label className='font-bold'>{wellbore.average_inlet_flow}</label> м³/ч</p>
                    <p>Средняя частота вращения колонны: <label className='font-bold'>{wellbore.average_column_rotation_frequency}</label> об/мин</p>
                    <p>Максимальная частота вращения колонны: <label className='font-bold'>{wellbore.maximum_column_rotation_frequency}</label> об/мин</p>
                    <p>Средняя нагрузка на долото: <label className='font-bold'>{wellbore.average_weight_on_bit}</label> т</p>
                    <p>Максимальная нагрузка на долото: <label className='font-bold'>{wellbore.maximum_weight_on_bit}</label> т</p>
                    <p>Средний крутящий момент: <label className='font-bold'>{wellbore.average_torque}</label> Н·м</p>
                    <p>Максимальный крутящий момент: <label className='font-bold'>{wellbore.maximum_torque}</label> Н·м</p>
                    <p>Нижнее статическое трение: <label className='font-bold'>{wellbore.down_static_friction}</label> Н</p>
                    <p>Интервал глубины: <label className='font-bold'>{wellbore.depth_interval}</label> м</p>
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
          wellbore && (
            <CreateWellBore
                type={'put'}
                id={id}
                prevName={wellbore.name}
                prevBottomLocation={wellbore.bottom_hole_location}
                prevDepth={wellbore.wellbore_depth}
                prevAverageHookLead={wellbore.average_hook_load}
                prevRiserPressure={wellbore.riser_pressure}
                prevAverageInLetFlow={wellbore.average_inlet_flow}
                prevAverageColumnRotationFrequency={wellbore.average_column_rotation_frequency}
                prevMaximumColumnRotationFrequency={wellbore.maximum_column_rotation_frequency}
                prevAverageWeightOnBit={wellbore.average_weight_on_bit}
                prevMaximumWeightOnBit={wellbore.maximum_weight_on_bit}
                prevAverageTorque={wellbore.average_torque}
                prevMaximumTorque={wellbore.maximum_torque}
                prevDownStaticFriction={wellbore.down_static_friction}
                prevDepthIntervalWellBore={wellbore.depth_interval}
                onSuccess={handleUpdateSuccess}
                wellId={wellbore.wellId}
                setIsEdit={setIsEdit}
            />
          )
        )}
      </div>
    </div>
  );
};

export default WellBoreDetail;