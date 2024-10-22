import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import SideBar from '../../../components/SideBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EffectiveTensionData {
  depth: number[];
  towerLoadCapacity: number[];
  rotaryDrilling: number[];
  pullUp: number[];
  runIn: number[];
  drillingGZD: number[];
  tensionLimit: number[];
}

const EffectiveTensionGraph: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [effectiveTensionData, setEffectiveTensionData] = useState<EffectiveTensionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEffectiveTension = async () => {
      try {
        const response = await instance.get(`/api/v1/torque-and-drag/effective-tension`, {
          params: { caseId },
        });
        
        setEffectiveTensionData(response.data as EffectiveTensionData);
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load effective tension data');
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchEffectiveTension();
    }
  }, [caseId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!effectiveTensionData) {
    return <div>No effective tension data available</div>;
  }

  // Formatting data for the graph
  const chartData = effectiveTensionData.depth.map((depth, index) => ({
    depth: depth,
    towerLoadCapacity: effectiveTensionData.towerLoadCapacity[index],
    rotaryDrilling: effectiveTensionData.rotaryDrilling[index],
    pullUp: effectiveTensionData.pullUp[index],
    runIn: effectiveTensionData.runIn[index],
    drillingGZD: effectiveTensionData.drillingGZD[index],
    tensionLimit: effectiveTensionData.tensionLimit[index],
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
              <XAxis dataKey="depth" label={{ value: 'Глубина (м)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Эффективное натяжение (тонны)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="towerLoadCapacity" stroke="#8884d8" name="Грузоподъёмность вышки" />
              <Line type="monotone" dataKey="rotaryDrilling" stroke="#82ca9d" name="Бурение ротором" />
              <Line type="monotone" dataKey="pullUp" stroke="#ff7300" name="Подъём" />
              <Line type="monotone" dataKey="runIn" stroke="#ff0000" name="Спуск" />
              <Line type="monotone" dataKey="drillingGZD" stroke="#0000ff" name="Бурение ГЗД" />
              <Line type="monotone" dataKey="tensionLimit" stroke="#ff00ff" name="Предел натяжения" />
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
              const fetchEffectiveTension = async () => {
                try {
                  const response = await instance.post<EffectiveTensionData>(`/api/v1/torque-and-drag/effective-tension`, { caseId });
                  setEffectiveTensionData(response.data);
                  setIsLoading(false);
                } catch (error) {
                  toast.error('Failed to reload effective tension data');
                  setIsLoading(false);
                }
              };
              fetchEffectiveTension();
            }}
          >
            Перезагрузить график
          </button>
        </div>
      </div>
    </div>
  );
};

export default EffectiveTensionGraph;