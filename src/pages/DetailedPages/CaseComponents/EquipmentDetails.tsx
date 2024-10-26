import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IFluid } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import CreateFluid from '../../../components/forms/CaseChildForms/CreateFluid';
import { IPorePressures } from '../../../components/forms/CaseChildForms/CreatePorePressure';
import { IFractureGradient } from '../../../components/forms/CaseChildForms/CreateFractureGradient';
import PorePressureDetail from './PorePressureDetail';
import FractureGradientsDetail from './FractureGradientsDetail';

interface IEquipmentForm {
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

const EquipmentDetail: FC<IEquipmentForm> = ({ caseId }) => {
  const navigate = useNavigate();
  const [isPost, setIsPost] = useState(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [porePressureData, setPorePressuresData] = useState<IPorePressures[]>()
  const [fractureGradientsData, setFractureGradientsData] = useState<IFractureGradient[]>()

  const onSuccess = () => {
    setIsEdit(false);
    setIsPost(false);
  };

  useEffect(() => {
    const fetchPorePressure = async () => {
      try {
        const response = await instance.get(`/api/v1/pore-pressures/?caseId=${caseId}`);
        if (response.data != null) {
          setPorePressuresData(response.data);
          console.log(porePressureData)
          onSuccess();
        } else {
          console.log("NO")
          setIsPost(true);
        }
      
      } catch (error) {
        setIsPost(true);
      }
    };
    fetchPorePressure();
  }, [caseId]);

  const handleDelete = async () => {
    try {
      if (porePressureData) {
        const deletePromises = porePressureData.map((item) =>
            instance.delete(`/api/v1/pore-pressures/${item.id}`)
        );
        await Promise.all(deletePromises);
      }
      setIsPost(true);
    } catch (error) {
      toast.error('Не получилось удалить поровое давление');
    }
  };

  return (
    <div className='flex w-full justify-evenly'>
        <PorePressureDetail caseId={caseId} onSuccess={onSuccess}/>
        <FractureGradientsDetail caseId={caseId} onSuccess={onSuccess} />
    </div>
  )
}
export default EquipmentDetail;