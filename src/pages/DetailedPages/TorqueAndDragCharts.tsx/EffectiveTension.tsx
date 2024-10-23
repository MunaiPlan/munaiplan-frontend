import React, { useEffect, useState } from 'react';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EffectiveTensionData {
  Глубина: number[];
  'Грузоподъёмность вышки': number[];
  'Бурение ротором': number[];
  'Спиральный изгиб(без вращения)': number[];
  'Подъём': number[];
  'Синусоидальный изгиб(все операции)': number[];
  'Спуск': number[];
  'Бурение ГЗД': number[];
  'Спиральный изгиб(с вращением)': number[];
  'Предел натяжения': number[];
}

interface IForm {
  caseId: string;
}

const EffectiveTensionGraph: React.FC<IForm> = ({ caseId }) => {
  const [effectiveTensionData, setEffectiveTensionData] = useState<EffectiveTensionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEffectiveTension = async () => {
      try {
        const response = await instance.post(`/api/v1/torque-and-drag/effective-tension/?caseId=${caseId}`);
        setEffectiveTensionData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  // Create chart data by mapping depth and other fields
  const chartData = effectiveTensionData.Глубина.map((depth, index) => ({
    depth: depth,
    towerLoadCapacity: effectiveTensionData['Грузоподъёмность вышки'][index],
    rotaryDrilling: effectiveTensionData['Бурение ротором'][index],
    pullUp: effectiveTensionData['Подъём'][index],
    runIn: effectiveTensionData['Спуск'][index],
    drillingGZD: effectiveTensionData['Бурение ГЗД'][index],
    tensionLimit: effectiveTensionData['Предел натяжения'][index],
  }));

  return (
    <div className="flex w-full h-full justify-evenly">
      <div className="flex flex-col h-screen w-4/5 justify-center items-center gap-y-4">
        <div className="w-full h-3/5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              {/* Reversed Y-Axis for depth */}
              <YAxis
                dataKey="depth"
                reversed
                label={{ value: 'Глубина по стволу (m)', angle: -90, position: 'insideLeft' }}
              />
              <XAxis
                label={{ value: 'Эффективное натяжение (tonne)', position: 'insideBottomRight', offset: -5 }}
              />
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
            className="border-2 border-black px-2 py-1 rounded-md hover:bg-blue-400"
            onClick={() => {
              setIsLoading(true);
              const fetchEffectiveTension = async () => {
                try {
                  const response = await instance.post(`/api/v1/torque-and-drag/effective-tension/?caseId=${caseId}`);
                  setEffectiveTensionData(response.data);
                  setIsLoading(false);
                } catch (error) {
                  console.error('Error reloading data:', error);
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
