import { FC, useState } from 'react';
import EffectiveTensionGraph from './TorqueAndDragCharts.tsx/EffectiveTension';
import MinWeightOnBitGraph from './TorqueAndDragCharts.tsx/MinWeightOnBit';
import SurfaceTorqueGraph from './TorqueAndDragCharts.tsx/MomentOnSurface';
import WeightOnBitGraph from './TorqueAndDragCharts.tsx/HookLoad';

interface IT {
  caseId: string;
}

const TorqueAndDragDetailPage: FC<IT> = ({caseId}) => {
  const [hookLoad, setHookLoad] = useState(true);
  const [surfaceTorque, setSurfaceTorque] = useState(false);
  const [weightOnBit, setWeightOnBit] = useState(false);
  const [effectiveTension, setEffectiveTension] = useState(false);

  const toggleHookLoad = () => {
    setHookLoad(true);
    setSurfaceTorque(false);
    setWeightOnBit(false);
    setEffectiveTension(false);
  };

  const toggleSurfaceTorque = () => {
    setHookLoad(false);
    setSurfaceTorque(true);
    setWeightOnBit(false);
    setEffectiveTension(false);
  };

  const toggleWeightOnBit = () => {
    setHookLoad(false);
    setSurfaceTorque(false);
    setWeightOnBit(true);
    setEffectiveTension(false);
  };

  const toggleEffectiveTension = () => {
    setHookLoad(false);
    setSurfaceTorque(false);
    setWeightOnBit(false);
    setEffectiveTension(true);
  };

  let content;
  if (hookLoad) {
    content = <WeightOnBitGraph caseId={caseId} />
  } else if (surfaceTorque) {
    content = <SurfaceTorqueGraph caseId={caseId}/>
  } else if (weightOnBit) {
    content = <MinWeightOnBitGraph caseId={caseId} />
  } else if (effectiveTension) {
    content = <EffectiveTensionGraph caseId={caseId} />
  }

  return (
    <div className="w-full flex flex-col items-center justify-evenly font-semibold text-[#5F5F5F] font-montserrat">
      <div className='flex w-full justify-evenly'>
        <p
          className={`text-center cursor-pointer ${
            hookLoad
              ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md'
              : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
          }`}
          onClick={toggleHookLoad}
        >
          Вес на крюке
        </p>
        <p
          className={`text-center cursor-pointer ${
            surfaceTorque
              ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md'
              : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
          }`}
          onClick={toggleSurfaceTorque}
        >
          Момент на поверхности
        </p>
        <p
          className={`text-center cursor-pointer ${
            weightOnBit
              ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md'
              : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
          }`}
          onClick={toggleWeightOnBit}
        >
          Вес на долоте
        </p>
        <p
          className={`text-center cursor-pointer ${
            effectiveTension
              ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md'
              : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
          }`}
          onClick={toggleEffectiveTension}
        >
          Эффективное натяжение
        </p>
      </div>
      <div className="flex w-full h-full justify-evenly">{content}</div>
    </div>
  );
};

export default TorqueAndDragDetailPage;