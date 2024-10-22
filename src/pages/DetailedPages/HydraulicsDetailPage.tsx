import { FC, useState } from 'react';
import MinDepthChart from './MinDepthChart';

interface IH {
  caseId: string;
}

const HydraulicsDetailPage: FC<IH> = ({caseId}) => {
  const [isMinDepth, setIsMinDepth] = useState(true);
  const [pressureLoss, setPressureLoss] = useState(false);

  const toggleMin = () => {
    setIsMinDepth(true);
    setPressureLoss(false);
  };

  const togglePressure = () => {
    setIsMinDepth(false);
    setPressureLoss(true);
  };

  let content;
  if (isMinDepth) {
    content = <MinDepthChart />
  }

  return (
    <div className="w-full flex flex-col items-center justify-evenly font-semibold text-[#5F5F5F] font-montserrat">
      <div className='flex w-full justify-evenly'>
        <p
          className={`text-center cursor-pointer ${
            isMinDepth
              ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md'
              : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
          }`}
          onClick={toggleMin}
        >
          Мин. расход по глубине
        </p>
        <p
          className={`text-center cursor-pointer ${
            pressureLoss
              ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md'
              : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
          }`}
          onClick={togglePressure}
        >
          Потери давления компонента
        </p>
      </div>
      <div className="flex mt-10">{content}</div>
    </div>
  );
};

export default HydraulicsDetailPage;