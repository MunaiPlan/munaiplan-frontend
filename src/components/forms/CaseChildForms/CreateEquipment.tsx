import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ISection } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreatePorePressureForm, { IPorePressures } from './CreatePorePressure';
import CreateFractureGradientForm, { IFractureGradient } from './CreateFractureGradient';

interface IEquipmentForm {
  type: "put" | "post";
  id?: string;
  caseId: string;
  porePressures: IPorePressures[];
  fractureGradients: IFractureGradient[];
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

const CreateEquipment: FC<IEquipmentForm> = ({ type, id, porePressures, fractureGradients, setIsEdit, onSuccess, caseId }) => {
  return (
    <div className='flex space-x-8 w-full'>
        <CreatePorePressureForm type={"post"} caseId={caseId}/>
        <CreateFractureGradientForm type={"post"} caseId={caseId} fractureGradients={fractureGradients}/>
    </div>
  );
};

export default CreateEquipment;