import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import SideBar from '../../../components/SideBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MinWeightOnBitData {
  Depth: number[];
  MinWeightOnBitForHelicalBucklingRotaryDrilling: number[];
  MinWeightOnBitForSinusoidalBucklingGZDDrilling: number[];
  MinWeightOnBitForSinusoidalBucklingRotaryDrilling: number[];
  MinWeightOnBitForHelicalBucklingGZDDrilling: number[];
}

interface IForm {
  caseId: string;
}

const MinWeightOnBitGraph: React.FC<IForm> = ({caseId}) => {
  const [minWeightOnBitData, setMinWeightOnBitData] = useState<MinWeightOnBitData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
    return <div>Нет информации про вес на долоте</div>;
  }

  const chartData = minWeightOnBitData.Depth.map((depth, index) => ({
    depth: depth,
    minWeightHelicalRotaryDrilling: minWeightOnBitData.MinWeightOnBitForHelicalBucklingRotaryDrilling[index],
    minWeightSinusoidalGZDDrilling: minWeightOnBitData.MinWeightOnBitForSinusoidalBucklingGZDDrilling[index],
    minWeightSinusoidalRotaryDrilling: minWeightOnBitData.MinWeightOnBitForSinusoidalBucklingRotaryDrilling[index],
    minWeightHelicalGZDDrilling: minWeightOnBitData.MinWeightOnBitForHelicalBucklingGZDDrilling[index],
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
              <XAxis dataKey="depth" label={{ value: 'Глубина (m)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Вес на долоте (тонны)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="minWeightHelicalRotaryDrilling" 
                stroke="#8884d8" 
                name="Мин. вес до спирального изгиба (бурение ротором)" 
              />
              <Line 
                type="monotone" 
                dataKey="minWeightSinusoidalGZDDrilling" 
                stroke="#82ca9d" 
                name="Мин. вес до синусоидального изгиба (бурение ГЗД)" 
              />
              <Line 
                type="monotone" 
                dataKey="minWeightSinusoidalRotaryDrilling" 
                stroke="#ff7300" 
                name="Мин. вес до синусоидального изгиба (бурение ротором)" 
              />
              <Line 
                type="monotone" 
                dataKey="minWeightHelicalGZDDrilling" 
                stroke="#ff0000" 
                name="Мин. вес до спирального изгиба (бурение ГЗД)" 
              />
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
              const fetchWeightOnBit = async () => {
                try {
                  const response = await instance.post(`/api/v1/torque-and-drag/min-weight/?caseId=${caseId}`);
                  setMinWeightOnBitData(response.data);
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

export default MinWeightOnBitGraph