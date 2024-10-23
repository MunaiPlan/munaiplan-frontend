import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import SideBar from '../../../components/SideBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MomentOnSurfaceData {
    Depth: number[];
    RotaryDrilling: number[];
    PullUp: number[];
    RunIn: number[];
    Make_up_Torque: number[];
    TorqueOnMakeUp: number[];
}

interface IForm {
  caseId: string;
}

const MomentOnSurfacetGraph: React.FC<IForm> = ({caseId}) => {
  const [momentOnSurfaceData, setMomentOnSurfaceData] = useState<MomentOnSurfaceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeightOnBit = async () => {
      try {
        const response = await instance.get(`/api/v1/torque-and-drag/moment-on-surface/?caseId=${caseId}`);
        setMomentOnSurfaceData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load moment on surface data');
        setIsLoading(false);
      }
    };

    if (caseId) {
        fetchWeightOnBit();
    }
  }, [caseId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!momentOnSurfaceData) {
    return <div>Нет информации момента на поверхности</div>;
  }

  const chartData = momentOnSurfaceData.Depth.map((depth, index) => ({
    depth: depth,
    rotaryDrilling: momentOnSurfaceData.RotaryDrilling[index],
    pullUp: momentOnSurfaceData.PullUp[index],
    runIn: momentOnSurfaceData.RunIn[index],
    MakeUpTorque: momentOnSurfaceData.Make_up_Torque[index],
    TorqueOnMakeUp: momentOnSurfaceData.TorqueOnMakeUp[index],
  }));

  return (
    <div className="h-screen w-full flex">
      <div className="w-1/5">
        <SideBar />
      </div>
      <div className="flex flex-col h-screen w-4/5 justify-center items-center gap-y-4">
        <h1 className="text-xl font-bold mb-4">Moment on Surface Graph</h1>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="depth" label={{ value: 'Момент на поверхности (kN-m)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Измеренная глубина рейса (m)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="towerLoadCapacity" stroke="#8884d8" name="Грузоподъёмность вышки" />
              <Line type="monotone" dataKey="rotaryDrilling" stroke="#82ca9d" name="Бурение ротором" />
              <Line type="monotone" dataKey="pullUp" stroke="#ff7300" name="Подъём" />
              <Line type="monotone" dataKey="runIn" stroke="#ff0000" name="Спуск" />
              <Line type="monotone" dataKey="MakeUpTorque" stroke="#0000ff" name="Бурение ГЗД" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex w-full items-center justify-center gap-x-4 mt-4">
          <button
            className="border-2 border-black px-2 py-1 rounded-md hover:bg-green-400"
            onClick={() => {
              navigate(`/cases/${caseId}`);
            }}
          >
            Назад к делу
          </button>
          <button
            className="border-2 border-black px-2 py-1 rounded-md hover:bg-blue-400"
            onClick={() => {
              setIsLoading(true);
              const fetchMomentOnSurface = async () => {
                try {
                  const response = await instance.get(`/api/v1/torque-and-drag/moment-on-surface/?caseId=${caseId}`);
                  setMomentOnSurfaceData(response.data);
                  setIsLoading(false);
                } catch (error) {
                  console.error('Error reloading data:', error);
                  toast.error('Failed to reload moment on surface data');
                  setIsLoading(false);
                }
              };
              fetchMomentOnSurface();
            }}
          >
            Перезагрузить график
          </button>
        </div>
      </div>
    </div>
  );
};

export default MomentOnSurfacetGraph