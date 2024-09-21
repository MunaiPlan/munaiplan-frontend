// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { instance } from '../../api/axios.api';
// import { IWell } from '../../types/types';
// import { toast } from 'react-toastify';
// import SideBar from '../../components/SideBar';
// import CreateWell from '../../components/forms/CreateWell';

// const WellDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [well, setWell] = useState<IWell | null>(null);
//   const [isEdit, setIsEdit] = useState<boolean>(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWell = async () => {
//       try {
//         const response = await instance.get<IWell>(`/api/v1/wells/${id}`);
//         setWell(response.data);
//       } catch (error) {
//         toast.error('Failed to load well details');
//       }
//     };

//     fetchWell();
//   }, [id]);

//   const handleDelete = async () => {
//     try {
//       await instance.delete(`/api/v1/wells/${id}`);
//       toast.success('Скважина была удалена');
//       navigate('/');
//     } catch (error) {
//       toast.error('Failed to delete the well');
//     }
//   };

//   const handleUpdateSuccess = () => {
//     setIsEdit(false);
//   };

//   if (!well) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className='h-screen w-full flex'>
//       <div className='w-1/5'>
//         <SideBar />
//       </div>
//       <div className='flex flex-col h-screen w-4/5 justify-center items-center gap-y-4'>
//         {!isEdit ? (
//           <>
//             <div className='flex flex-col justify-center items-center w-full'>
//               <div className='items-starts border-2 border-black rounded-lg px-4 py-2'>
//                 <h1>О месторождении: <label className='font-bold'>{well.name}</label></h1>
//                 <p>Описание: <label className='font-bold'>{well.description}</label></p>
//                 <p>Локация: <label className='font-bold'>{well.location}</label></p>
//                 <p>Тип: <label className='font-bold'>{well.type}</label></p>
//                 <p>Универсальный идентификатор скважины: <label className='font-bold'>{well.universal_well_identifier}</label></p>
//                 <p>Номер скважины: <label className='font-bold'>{well.well_number}</label></p>
//                 <p>Рабочая группа скважины: <label className='font-bold'>{well.working_group}</label></p>
//                 <p>Активная скважина: <label className='font-bold'>{well.active_well_unit}</label></p>
//               </div>
//             </div>
//             <div className='flex w-full items-center justify-center gap-x-4'>
//               <button
//                 className='border-2 border-black px-2 py-1 rounded-md hover:bg-green-400'
//                 onClick={() => {
//                   setIsEdit(true);
//                 }}
//               >
//                 Изменить
//               </button>
//               <button
//                 className='border-2 border-black px-2 py-1 rounded-md hover:bg-red-400'
//                 onClick={handleDelete}
//               >
//                 Удалить
//               </button>
//             </div>
//           </>
//         ) : (
//           well && (
//             <CreateWell
//               prevName={well.name}
//               prevDescription={well.description}
//               prevLocation={well.location}
//               prevType={well.type}
//               prevActiveWellUnit={well.active_well_unit}
//               prevUniversalWellIdentifier={well.universal_well_identifier}
//               prevWellNumber={well.well_number}
//               prevWorkingGroup={well.working_group}
//               type='put'
//               id={id}
//               setIsEdit={setIsEdit}
              
//               onSuccess={handleUpdateSuccess}
//               siteId={well.siteId}
//             />
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default WellDetail;