import React, { useEffect, useState } from 'react';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MinWeightOnBitData {
  Глубина: number[];
  'Мин. вес на долоте до спирального изгиба (бурение ротором)': number[];
  'Мин. вес на долоте до синусоидального изгиба (бурение ГЗД)': number[];
  'Мин. вес на долоте до синусоидального изгиба (бурение ротором)': number[];
  'Мин. вес на долоте до спирального изгиба (бурение ГЗД)': number[];
}

interface IForm {
  caseId: string;
}

const MinWeightOnBitGraph: React.FC<IForm> = ({ caseId }) => {
  const [minWeightOnBitData, setMinWeightOnBitData] = useState<MinWeightOnBitData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMinWeightOnBit = async () => {
      try {
        const response = await instance.post(`/api/v1/torque-and-drag/min-weight/?caseId=${caseId}`);
        setMinWeightOnBitData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load min weight on bit data');
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchMinWeightOnBit();
    }
  }, [caseId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!minWeightOnBitData) {
    return <div>No min weight on bit data available</div>;
  }

  // Create chart data by mapping depth and other fields
  const chartData = minWeightOnBitData.Глубина.map((depth, index) => ({
    depth: depth,
    minWeightHelicalRotaryDrilling: minWeightOnBitData['Мин. вес на долоте до спирального изгиба (бурение ротором)'][index],
    minWeightSinusoidalGZDDrilling: minWeightOnBitData['Мин. вес на долоте до синусоидального изгиба (бурение ГЗД)'][index],
    minWeightSinusoidalRotaryDrilling: minWeightOnBitData['Мин. вес на долоте до синусоидального изгиба (бурение ротором)'][index],
    minWeightHelicalGZDDrilling: minWeightOnBitData['Мин. вес на долоте до спирального изгиба (бурение ГЗД)'][index],
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
                label={{ value: 'Вес на долоте (тонны)', position: 'insideBottomRight', offset: -5 }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="minWeightHelicalRotaryDrilling"
                stroke="#8884d8"
                name="Мин. вес на долоте до спирального изгиба (бурение ротором)"
              />
              <Line
                type="monotone"
                dataKey="minWeightSinusoidalGZDDrilling"
                stroke="#82ca9d"
                name="Мин. вес на долоте до синусоидального изгиба (бурение ГЗД)"
              />
              <Line
                type="monotone"
                dataKey="minWeightSinusoidalRotaryDrilling"
                stroke="#ff7300"
                name="Мин. вес на долоте до синусоидального изгиба (бурение ротором)"
              />
              <Line
                type="monotone"
                dataKey="minWeightHelicalGZDDrilling"
                stroke="#ff0000"
                name="Мин. вес на долоте до спирального изгиба (бурение ГЗД)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex w-full items-center justify-center gap-x-4 mt-4">
          <button
            className="border-2 border-black px-2 py-1 rounded-md hover:bg-blue-400"
            onClick={() => {
              setIsLoading(true);
              const fetchMinWeightOnBit = async () => {
                try {
                  const response = await instance.post(`/api/v1/torque-and-drag/min-weight/?caseId=${caseId}`);
                  setMinWeightOnBitData(response.data);
                  setIsLoading(false);
                } catch (error) {
                  console.error('Error reloading data:', error);
                  toast.error('Failed to reload min weight on bit data');
                  setIsLoading(false);
                }
              };
              fetchMinWeightOnBit();
            }}
          >
            Перезагрузить график
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinWeightOnBitGraph;
