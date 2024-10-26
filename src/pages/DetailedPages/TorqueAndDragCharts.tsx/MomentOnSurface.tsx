import React, { useEffect, useState } from 'react';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SurfaceTorqueData {
  Глубина: number[];
  'Бурение ротором': number[];
  'Подъём': number[];
  'Make-up Torque': number[];
  'Спуск': number[];
  'Момент свинчивания': number[];
}

interface IForm {
  caseId: string;
}

const SurfaceTorqueGraph: React.FC<IForm> = ({ caseId }) => {
  const [surfaceTorqueData, setSurfaceTorqueData] = useState<SurfaceTorqueData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSurfaceTorque = async () => {
      try {
        const response = await instance.post(`/api/v1/torque-and-drag/surface-torque/?caseId=${caseId}`);
        setSurfaceTorqueData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load surface torque data');
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchSurfaceTorque();
    }
  }, [caseId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!surfaceTorqueData) {
    return <div>No surface torque data available</div>;
  }

  // Create chart data by mapping depth and other fields
  const chartData = surfaceTorqueData.Глубина.map((depth, index) => ({
    depth: depth,
    rotaryDrilling: surfaceTorqueData['Бурение ротором'][index],
    pullUp: surfaceTorqueData['Подъём'][index],
    makeUpTorque: surfaceTorqueData['Make-up Torque'][index],
    runIn: surfaceTorqueData['Спуск'][index],
    torque: surfaceTorqueData['Момент свинчивания'][index],
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
                label={{ value: 'Крутящий момент (тонны)', position: 'insideBottomRight', offset: -5 }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rotaryDrilling"
                stroke="#8884d8"
                name="Бурение ротором"
              />
              <Line
                type="monotone"
                dataKey="pullUp"
                stroke="#82ca9d"
                name="Подъём"
              />
              <Line
                type="monotone"
                dataKey="makeUpTorque"
                stroke="#ff7300"
                name="Make-up Torque"
              />
              <Line
                type="monotone"
                dataKey="runIn"
                stroke="#ff0000"
                name="Спуск"
              />
              <Line
                type="monotone"
                dataKey="torque"
                stroke="#ff00ff"
                name="Момент свинчивания"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex w-full items-center justify-center gap-x-4 mt-4">
          <button
            className="border-2 border-black px-2 py-1 rounded-md hover:bg-blue-400"
            onClick={() => {
              setIsLoading(true);
              const fetchSurfaceTorque = async () => {
                try {
                  const response = await instance.post(`/api/v1/torque-and-drag/surface-torque/?caseId=${caseId}`);
                  setSurfaceTorqueData(response.data);
                  setIsLoading(false);
                } catch (error) {
                  console.error('Error reloading data:', error);
                  toast.error('Failed to reload surface torque data');
                  setIsLoading(false);
                }
              };
              fetchSurfaceTorque();
            }}
          >
            Перезагрузить график
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurfaceTorqueGraph;
