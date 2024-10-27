import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IFluid } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateFluid from '../../../components/forms/CaseChildForms/CreateFluid';
import { IPorePressures } from '../../../components/forms/CaseChildForms/CreatePorePressure';
import PorePressureDetail from './PorePressureDetail';
import FractureGradientsDetail from './FractureGradientsDetail';

interface IEquipmentForm {
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

const EquipmentDetail: FC<IEquipmentForm> = ({ caseId }) => {
  const navigate = useNavigate();


  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-6 rounded-lg'>
      <div className='bg-white p-5 rounded-lg'>
        <PorePressureDetail caseId={caseId} />
      </div>
      <div className='bg-white p-5 rounded-lg'>
        <FractureGradientsDetail caseId={caseId} />
      </div>
    </div>
  );
  
}
export default EquipmentDetail;