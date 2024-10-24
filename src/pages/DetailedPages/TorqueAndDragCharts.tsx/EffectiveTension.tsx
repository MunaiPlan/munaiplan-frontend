import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EffectiveTensionData {
  "Глубина": number[];
  "Грузоподъёмность вышки": number[];
  "Бурение ротором": number[];
  "Подъём": number[];
  "Спуск": number[];
  "Бурение ГЗД": number[];
  "Предел натяжения": number[];
  "Синусоидальный изгиб(все операции)": number[];
  "Спиральный изгиб(без вращения)": number[];
  "Спиральный изгиб(с вращением)": number[];
}

interface IForm {
  caseId: string;
}

const EffectiveTensionGraph: React.FC<IForm> = ({ caseId }) => {
  const [effectiveTensionData, setEffectiveTensionData] = useState<EffectiveTensionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEffectiveTension = async () => {
      try {
        const response = await instance.post(`/api/v1/torque-and-drag/effective-tension/?caseId=${caseId}`);
        if (response.data && response.data.Глубина) {
          setEffectiveTensionData(response.data);
        } else {
          setError('Invalid data format from API');
        }
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load effective tension data');
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

  if (error) {
    return <div>Error: {error}</div>;  
  }

  if (!effectiveTensionData || !effectiveTensionData.Глубина) {
    return <div>No effective tension data available</div>;
  }

  const chartData = effectiveTensionData.Глубина.map((depth, index) => ({
    depth: depth,
    towerLoadCapacity: effectiveTensionData['Грузоподъёмность вышки'][index],
    rotaryDrilling: effectiveTensionData['Бурение ротором'][index],
    pullUp: effectiveTensionData['Подъём'][index],
    runIn: effectiveTensionData['Спуск'][index],
    drillingGZD: effectiveTensionData['Бурение ГЗД'][index],
    tensionLimit: effectiveTensionData['Предел натяжения'][index],
    helicalBucklingWithRotation: effectiveTensionData["Спиральный изгиб(с вращением)"][index],
    helicalBucklingWithoutRotation: effectiveTensionData["Спиральный изгиб(без вращения)"][index],
    sinusoidalBuckling: effectiveTensionData["Синусоидальный изгиб(все операции)"][index]
  }));

  return (
    <div className="h-screen w-full flex">
      <div className="flex flex-col h-screen ml-auto mr-auto gap-y-10 items-center">
        <h1 className="text-xl font-bold mb-4">Effective Tension Graph</h1>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} width={1100} height={1100}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis orientation='top' dataKey="depth" label={{ value: 'Эффективное натяжение (tonne)', position: 'top', offset: -5 }} />
              <YAxis reversed label={{ value: 'Глубина по стволу (m)', angle: -90, position: 'left', offset: 15}} />              
              <Tooltip />
              <Line type="monotone" dataKey="towerLoadCapacity" stroke="#6A5ACD" strokeWidth={2} name="Грузоподъёмность вышки" />
              <Line type="monotone" dataKey="rotaryDrilling" stroke="#3CB371" strokeWidth={2} name="Бурение ротором" />
              <Line type="monotone" dataKey="pullUp" stroke="#FF6347" strokeWidth={2} name="Подъём" />
              <Line type="monotone" dataKey="runIn" stroke="#B22222" strokeWidth={2} name="Спуск" />
              <Line type="monotone" dataKey="drillingGZD" stroke="#1E90FF" strokeWidth={2} name="Бурение ГЗД" />
              <Line type="monotone" dataKey="tensionLimit" stroke="#FF69B4" strokeWidth={2} name="Предел натяжения" />
              <Line type="monotone" dataKey="sinusoidalBuckling" stroke="#DC143C" strokeWidth={2} name="Синусоидальный изгиб(все операции)" />
              <Line type="monotone" dataKey="helicalBucklingWithRotation" stroke="#00008B" strokeWidth={2} name="Спиральный изгиб(с вращением)" />
              <Line type="monotone" dataKey="helicalBucklingWithoutRotation" stroke="#8B008B" strokeWidth={2} name="Спиральный изгиб(без вращения)" />
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
                  const response = await instance.post(`/api/v1/torque-and-drag/effective-tension/?caseId=${caseId}`);
                  if (response.data && response.data.depth) {
                    setEffectiveTensionData(response.data);
                  } else {
                    setError('Invalid data format from API');
                  }
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