import React, { useEffect, useState } from 'react';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeightOnBitData {
  Глубина: number[];
  'Грузоподъёмность вышки': number[];
  'Бурение ротором': number[];
  'Подъём': number[];
  'Спуск': number[];
  'Бурение ГЗД': number[];
  'Мин. вес до спирального изгиба (спуск)': number[];
  'Макс. вес до предела текучести (подъём)': number[];
}

interface IForm {
  caseId: string;
}

const WeightOnBitGraph: React.FC<IForm> = ({ caseId }) => {
  const [weightOnBitData, setWeightOnBitData] = useState<WeightOnBitData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeightOnBit = async () => {
      try {
<<<<<<< HEAD
        const response = await instance.post(`/api/v1/torque-and-drag/hook-load/?caseId=${caseId}`);
        setHookLoadData(response.data);
=======
        const response = await instance.post(`/api/v1/torque-and-drag/weight-on-bit/?caseId=${caseId}`);
        setWeightOnBitData(response.data);
>>>>>>> refs/remotes/origin/main
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load weight on bit data');
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

<<<<<<< HEAD
  if (!hookLoadData) {
    return <div className='flex justify-center bg-red-400'>Нет информации про вес на крюке</div>;
=======
  if (!weightOnBitData) {
    return <div>No weight on bit data available</div>;
>>>>>>> refs/remotes/origin/main
  }

  // Create chart data by mapping depth and other fields
  const chartData = weightOnBitData.Глубина.map((depth, index) => ({
    depth: depth,
    towerLoadCapacity: weightOnBitData['Грузоподъёмность вышки'][index],
    rotaryDrilling: weightOnBitData['Бурение ротором'][index],
    pullUp: weightOnBitData['Подъём'][index],
    runIn: weightOnBitData['Спуск'][index],
    drillingGZD: weightOnBitData['Бурение ГЗД'][index],
    minWeightHelicalRunIn: weightOnBitData['Мин. вес до спирального изгиба (спуск)'][index],
    maxWeightYieldLimitPullUp: weightOnBitData['Макс. вес до предела текучести (подъём)'][index],
  }));

  return (
<<<<<<< HEAD
    <div className="h-screen w-full flex">
      <div className="flex flex-col h-screen w-4/5 bg-red-400 justify-center items-center gap-y-4">
        <h1 className="text-xl font-bold mb-4 items-center">Effective Tension Graph</h1>
        <div className="w-full h-96">
=======
    <div className="flex w-full h-full justify-evenly">
      <div className="flex flex-col h-screen w-4/5 justify-center items-center gap-y-4">
        <div className="w-full h-3/5">
>>>>>>> refs/remotes/origin/main
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
                label={{ value: 'Вес на долоте (тонны)', position: 'insideBottomRight', offset: -5 }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="towerLoadCapacity" stroke="#8884d8" name="Грузоподъёмность вышки" />
              <Line type="monotone" dataKey="rotaryDrilling" stroke="#82ca9d" name="Бурение ротором" />
              <Line type="monotone" dataKey="pullUp" stroke="#ff7300" name="Подъём" />
              <Line type="monotone" dataKey="runIn" stroke="#ff0000" name="Спуск" />
              <Line type="monotone" dataKey="drillingGZD" stroke="#0000ff" name="Бурение ГЗД" />
              <Line type="monotone" dataKey="minWeightHelicalRunIn" stroke="#ff00ff" name="Мин. вес до спирального изгиба (спуск)" />
              <Line type="monotone" dataKey="maxWeightYieldLimitPullUp" stroke="#00ff00" name="Макс. вес до предела текучести (подъём)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex w-full items-center justify-center gap-x-4 mt-4">
          <button
            className="border-2 border-black px-2 py-1 rounded-md hover:bg-blue-400"
            onClick={() => {
              setIsLoading(true);
              const fetchWeightOnBit = async () => {
                try {
<<<<<<< HEAD
                  const response = await instance.post(`/api/v1/torque-and-drag/hook-load/?caseId=${caseId}`);
                  setHookLoadData(response.data);
=======
                  const response = await instance.post(`/api/v1/torque-and-drag/weight-on-bit/?caseId=${caseId}`);
                  setWeightOnBitData(response.data);
>>>>>>> refs/remotes/origin/main
                  setIsLoading(false);
                } catch (error) {
                  console.error('Error reloading data:', error);
                  toast.error('Failed to reload weight on bit data');
                  setIsLoading(false);
                }
              };
              fetchWeightOnBit();
            }}
          >
            Перезагрузить график
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightOnBitGraph;
