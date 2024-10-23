import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import SideBar from '../../../components/SideBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HookLoadData {
  Depth: number[];
  TowerLoadCapacity: number[];
  RotaryDrilling: number[];
  PullUp: number[];
  RunIn: number[];
  DrillingGZD: number[];
  MinWeightForHelicalBucklingRun: number[];
  MaxWeightBeforeYieldLimitPullUp: number[];
}

interface IForm {
  caseId: string;
}

const HookLoadGraph: React.FC<IForm> = ({caseId}) => {
  const [hookLoadData, setHookLoadData] = useState<HookLoadData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHookLoad = async () => {
      try {
        const response = await instance.get(`/api/v1/torque-and-drag/hook-load/?caseId=${caseId}`);
        setHookLoadData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load hook load data');
        setIsLoading(false);
      }
    };

    if (caseId) {
        fetchHookLoad();
    }
  }, [caseId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hookLoadData) {
    return <div>Нет информации про вес на крюке</div>;
  }

  const chartData = hookLoadData.Depth.map((depth, index) => ({
    depth: depth,
    towerLoadCapacity: hookLoadData.TowerLoadCapacity[index],
    rotaryDrilling: hookLoadData.RotaryDrilling[index],
    pullUp: hookLoadData.PullUp[index],
    runIn: hookLoadData.RunIn[index],
    MinWeightForHelicalBucklingRun: hookLoadData.MinWeightForHelicalBucklingRun[index],
    MaxWeightBeforeYieldLimitPullUp: hookLoadData.MaxWeightBeforeYieldLimitPullUp[index],
  }));

  return (
    <div className="h-screen w-full flex">
      <div className="w-1/5">
        <SideBar />
      </div>
      <div className="flex flex-col h-screen w-4/5 justify-center items-center gap-y-4">
        <h1 className="text-xl font-bold mb-4">Effective Tension Graph</h1>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="depth" label={{ value: 'Вес на долоте (tonne)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Измеренная глубина рейса (m)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="towerLoadCapacity" stroke="#8884d8" name="Грузоподъёмность вышки" />
              <Line type="monotone" dataKey="rotaryDrilling" stroke="#82ca9d" name="Бурение ротором" />
              <Line type="monotone" dataKey="pullUp" stroke="#ff7300" name="Подъём" />
              <Line type="monotone" dataKey="runIn" stroke="#ff0000" name="Спуск" />
              <Line type="monotone" dataKey="MinWeightForHelicalBucklingRun" stroke="#0000ff" name="Мин. вес до спирального изгиба" />
              <Line type="monotone" dataKey="MaxWeightBeforeYieldLimitPullUp" stroke="#ff00ff" name="Макс. вес до предела текучести" />
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
              const fetchHookLoad = async () => {
                try {
                  const response = await instance.get(`/api/v1/torque-and-drag/hook-load/?caseId=${caseId}`);
                  setHookLoadData(response.data);
                  setIsLoading(false);
                } catch (error) {
                  console.error('Error reloading data:', error); 
                  toast.error('Failed to reload hook load data');
                  setIsLoading(false);
                }
              };
              fetchHookLoad();
            }}
          >
            Перезагрузить график
          </button>
        </div>
      </div>
    </div>
  );
};

export default HookLoadGraph