import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { ICase, IRig } from '../../types/types';
import { toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import CreateWell from '../../components/forms/CreateWell';
import CreateCase from '../../components/forms/CreateCase';
import CreateFluid from '../../components/forms/CaseChildForms/CreateFluid';
import CreateHole from '../../components/forms/CaseChildForms/CreateHole';
import CreateString from '../../components/forms/CaseChildForms/CreateString';
import CreateEquipment from '../../components/forms/CaseChildForms/CreateEquipment';
import CreateRig from '../../components/forms/CaseChildForms/CreateRig';
import HydraulicsDetailPage from './HydraulicsDetailPage';
import TorqueAndDragDetailPage from './TorqueAndDrugDetailPage';
import StringDetail from './CaseComponents/StringDetails';
import HoleDetail from './CaseComponents/HoleDetails';
import FluidDetail from './CaseComponents/FluidDetails';
import EquipmentDetail from './CaseComponents/EquipmentDetails';
import RigDetail from './CaseComponents/RigDetails';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [casE, setCase] = useState<ICase | null>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isSelectedAltitude, setIsSelectedAltitude] = useState(false);
  const [isSelectedTrajectory, setIsSelectedTrajectory] = useState(false);
  const [isSelectedHole, setIsSelectedHole] = useState(false);
  const [isSelectedString, setIsSelectedString] = useState(false);
  const [isSelectedFluid, setIsSelectedFluid] = useState(false);
  const [isSelectedEquip, setIsSelectedEquip] = useState(false);
  const [isComponentsSelected, setComponentsSelected] = useState(true)
  const [isHydraulicsSelected, setHydraulicsSelected] = useState(false)
  const [isMomentSelected, setMomentSelected] = useState(false)
  const [isDescriptionSelected, setIsDescriptionSelected] = useState(true);
  const [isRigSelected, setIsRigSelected] = useState(false);

  const rigData: IRig = {
    block_rating: 12,
    torque_rating: 1000,
    rated_working_pressure: 5000,
    bop_pressure_rating: 3000,
    surface_pressure_loss: 12,
    standpipe_length: 10,
    standpipe_internal_diameter: 5,
    hose_length: 15,
    hose_internal_diameter: 4,
    swivel_length: 8,
    swivel_internal_diameter: 4,
    kelly_length: 7,
    kelly_internal_diameter: 3,
    pump_discharge_line_length: 20,
    pump_discharge_line_internal_diameter: 6,
    top_drive_stackup_length: 25,
    top_drive_stackup_internal_diameter: 7
  };


  const navigate = useNavigate();

  const toggleComponent = () => {
    setComponentsSelected(true);
    setHydraulicsSelected(false);
    setMomentSelected(false);
  }

  const toggleHydraulics = () => {
    if (casE?.is_complete) {
      setHydraulicsSelected(true);
      setMomentSelected(false);
      setComponentsSelected(false);
    }
  }

  const toggleMoment = () => {
    if (casE?.is_complete) {
    setHydraulicsSelected(false);
    setMomentSelected(true);
    setComponentsSelected(false);
   }
  }


  const toggleAltitude = () => {
    setIsSelectedAltitude(true);
    setIsSelectedString(false);
    setIsSelectedEquip(false);
    setIsSelectedHole(false);
    setIsSelectedFluid(false);
    setIsSelectedTrajectory(false);
    setIsRigSelected(false);
  };

  const toggleTrajectory = () => {
    setIsSelectedTrajectory(true);
    setIsSelectedAltitude(false);
    setIsSelectedString(false);
    setIsSelectedEquip(false);
    setIsSelectedHole(false);
    setIsSelectedFluid(false);
    setIsRigSelected(false);
  };

  const toggleHole = () => {
    setIsSelectedHole(true);
    setIsSelectedAltitude(false);
    setIsSelectedString(false);
    setIsSelectedEquip(false);
    setIsSelectedFluid(false);
    setIsSelectedTrajectory(false);
    setIsDescriptionSelected(false);
    setIsRigSelected(false);
  };

  const toggleString = () => {
    setIsSelectedString(true);
    setIsSelectedAltitude(false);
    setIsSelectedEquip(false);
    setIsSelectedHole(false);
    setIsSelectedFluid(false);
    setIsSelectedTrajectory(false);
    setIsDescriptionSelected(false);
    setIsRigSelected(false);
  };

  const toggleFluid = () => {
    setIsSelectedFluid(true);
    setIsSelectedAltitude(false);
    setIsSelectedString(false);
    setIsSelectedEquip(false);
    setIsSelectedHole(false);
    setIsSelectedTrajectory(false);
    setIsDescriptionSelected(false);
    setIsRigSelected(false);
  };

  const toggleEquip = () => {
    setIsSelectedEquip(true);
    setIsSelectedAltitude(false);
    setIsSelectedString(false);
    setIsSelectedHole(false);
    setIsSelectedFluid(false);
    setIsSelectedTrajectory(false);
    setIsDescriptionSelected(false);
    setIsRigSelected(false);
  };

  const toggleDescription = () => {
    setIsSelectedEquip(false);
    setIsSelectedAltitude(false);
    setIsSelectedString(false);
    setIsSelectedHole(false);
    setIsSelectedFluid(false);
    setIsSelectedTrajectory(false);
    setIsDescriptionSelected(true);
    setIsRigSelected(false);
  };

  const toggleRig = () => {
    setIsSelectedEquip(false);
    setIsSelectedAltitude(false);
    setIsSelectedString(false);
    setIsSelectedHole(false);
    setIsSelectedFluid(false);
    setIsSelectedTrajectory(false);
    setIsDescriptionSelected(false);
    setIsRigSelected(true);
  };


  let content;
  if (isSelectedFluid) {
    content = <FluidDetail caseId={casE!.id}/>
  } else if (isSelectedHole) {
    content = <HoleDetail caseId={casE!.id} type={"post"} />
  } else if (isSelectedString) {
    content = <StringDetail caseId={casE!.id} type={"post"} prevName={""} prevDepth={0} prevSections={[]}/>
  } else if (isSelectedEquip) {
    content = <EquipmentDetail caseId={casE!.id} />
  } else if (isRigSelected) {
    content = <RigDetail caseId={casE!.id} />
  } else if (isDescriptionSelected) {
    content = (
      <>
            <div className='flex flex-col justify-center items-center w-full'>
              <div className='bg-white border-2 border-gray-300 rounded-lg px-4 py-4 shadow-sm w-full max-w-md'>
                <h1 className='text-lg font-bold mb-4'>Кейс: <span className='font-semibold'>{casE?.case_name}</span></h1>
                <div className='space-y-2 text-gray-700'>
                  <p>Описание: <span className='font-semibold'>{casE?.case_description}</span></p>
                  <p>Глубина бурения: <span className='font-semibold'>{casE?.drill_depth}</span></p>
                  <p>Размер насоса: <span className='font-semibold'>{casE?.pipe_size}</span></p>
                  <p>Заполнен: <span className='font-semibold'>{casE?.is_complete ? "Да" : "Нет"}</span></p>
                </div>
              </div>
            </div>

          </>
    )
  }

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await instance.get<ICase>(`/api/v1/cases/${id}`);
        setCase(response.data);
      } catch (error) {
        toast.error('Failed to load case details');
      }
    };

    fetchCase();
  }, [id, isDescriptionSelected]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/cases/${id}`);
      toast.success('Кейс был удален');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the case');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEdit(false);
  };


  if (!casE) {
    return <div>Loading...</div>;
  }

  return (
    <div className='h-screen w-full flex'>
      <div className='w-1/5'>
        <SideBar />
      </div>
      <div className='flex flex-col items-stretch h-screen w-4/5 gap-y-4'>
        {!isEdit ? (
          <>
            <div className='w-full p-4 border-b-2 flex items-center pt-8'>
              <div className='flex justify-start items-center w-full pl-8 font-medium font-montserrat'>{casE.case_description + ": " + casE.case_name}</div>
              <div className='flex justify-end items-center w-full gap-x-7 pr-14 font-semibold text-[#5F5F5F] font-montserrat'>
                <p className={
                  `text-center cursor-pointer ${
                    isComponentsSelected ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                  }`
                }
                onClick={toggleComponent}>Компоненты</p>
                <p className={
                  `text-center w-fill cursor-pointer ${
                    isMomentSelected ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                  }`
                }
                onClick={toggleMoment}>Момент и сопротивление</p>
                <p className={
                  `text-center cursor-pointer ${
                    isHydraulicsSelected ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                  }`
                }
                onClick={toggleHydraulics}>Гидравлика</p>
              </div>
            </div>
            {isComponentsSelected ?
              <div>
                <div className='w-full flex justify-evenly font-semibold text-[#5F5F5F] font-montserrat'>
                  <p className={
                    `text-center cursor-pointer ${
                      isDescriptionSelected ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                    }`
                  }
                  onClick={toggleDescription}
                  >Описание</p>
                  <p className={
                    `text-center cursor-pointer ${
                      isSelectedHole ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                    }`
                  }
                  onClick={toggleHole}
                  >Ствол</p>
                  <p className={
                    `text-center cursor-pointer ${
                      isSelectedString ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                    }`
                  }
                  onClick={toggleString}
                  >Колонна</p>
                  <p className={
                    `text-center cursor-pointer ${
                      isSelectedFluid ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                    }`
                  }
                  onClick={toggleFluid}
                  >Растворы</p>
                  <p className={
                    `text-center cursor-pointer ${
                      isSelectedEquip ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                    }`
                  }
                  onClick={toggleEquip}
                  >Внутрискв. оборудование</p>
                  <p className={
                    `text-center cursor-pointer ${
                      isRigSelected ? 'text-[#000000] font-montserrat bg-[#F5F5F5] px-2 py-1 rounded-md' : 'text-[#5F5F5F] font-montserrat px-2 py-1 bg-[#FFFFFF]'
                    }`
                  }
                  onClick={toggleRig}
                  >Буровые</p>
                </div>
                <div className='flex justify-center mt-10'>
                  {content}
                </div>
                {isDescriptionSelected && (<div className='flex w-full items-center justify-center mt-10 gap-x-4'>
                  <button
                    className='border-2 border-black px-2 py-1 rounded-md hover:bg-green-400'
                    onClick={() => {
                    setIsEdit(true);
                  }}
                  >
                    Изменить
                  </button>
                  <button
                    className='border-2 border-black px-2 py-1 rounded-md hover:bg-red-400'
                    onClick={handleDelete}
                  >
                    Удалить
                  </button>
                </div>)}
              </div> : (isHydraulicsSelected ? (<HydraulicsDetailPage caseId={casE.id}/>) : (<TorqueAndDragDetailPage caseId={casE.id}/>))}
          </>
        ) : (
          casE && (
            <div className='w-full h-screen flex justify-center items-center bg-gray-100'>
              <CreateCase
                prevName={casE.case_name}
                prevDescription={casE.case_description}
                prevDrillDepth={casE.drill_depth}
                prevPipeSize={casE.pipe_size}
                prevIsComplete={casE.is_complete}

                type='put'
                id={id}
                setIsEdit={setIsEdit}
                onSuccess={handleUpdateSuccess}
                trajectoryId={casE.trajectoryId}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CaseDetail;