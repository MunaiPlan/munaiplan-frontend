// import {FC, useState} from 'react'
// import { Form, useNavigate } from 'react-router-dom'
// import { ICase, ITrajectory, IWell } from '../../types/types'
// import { instance } from '../../api/axios.api';
// import { toast } from 'react-toastify';
// import { store } from '../../store/store';

// interface IDesignForm {
//   type: "post" | "put";
//   id?: string;
//   wellBoreId: string;
//   prevName: string;
//   prevStage: string;
//   prevVersion: string;
//   prevActualDate: Date;
//   trajectories?: ITrajectory[];
//   setIsEdit?: (edit: boolean) => void;
//   onSuccess?: () => void
// }


// const CreateDesign: FC<IDesignForm> = ({type="post", id, prevName, prevStage, prevVersion, prevActualDate, setIsEdit, wellBoreId}) => {

//   const [nameDesign, setNameDesign] = useState(prevName)
//   const [stageDesign, setStageDesign] = useState(prevStage)
//   const [versionDesign, setVersionDesign] = useState(prevVersion)
//   const [actualDataDesign, setActualDataDesign] = useState(prevActualDate)

//   const navigate = useNavigate()

//   const getWellboreIdFromStore = (): string | null => {
//     const state = store.getState(); 
//     return state.design.wellboreId; 
//   }

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     const newDesign = {
//       plan_name: nameDesign,
//       stage: stageDesign,
//       version: versionDesign,
//       actual_date: actualDataDesign
//     };

//     try {
//       setActualDataDesign(new Date())
//       const wellboreId = getWellboreIdFromStore()
//       if (type == 'post') {
//         const newDesign = {
//           plan_name: nameDesign,
//           stage: stageDesign,
//           version: versionDesign,
//           actual_date: actualDataDesign
//         };
//         console.log("Design")
//         console.log(newDesign)
//         console.log(id)
//         try {
//           await instance.post(`/api/v1/designs/?wellboreId=${wellboreId}`, newDesign)
//           toast.success("Design was added")
//           navigate("/")
//         } catch (error) {
//           toast.error("Ошибка при добавлении нового дизайна");
//           console.error(error);
//         }
//       }
//       if (type == 'put' && id) {
//         const updatedDesign = {
//           plan_name: nameDesign,
//           stage: stageDesign,
//           version: versionDesign,
//           actual_date: actualDataDesign
//         };
//         await instance.put(`/api/v1/designs/${id}`, updatedDesign);
//         toast.success("Дизайн был успешно обновлен");
//         navigate('/')
//       }
//     } catch (e) {
//       toast.error('Не удалось обновить дизайн' + wellBoreId);
//     }
//   }
//   return (
//     <div className='w-screen flex flex-col justify-center items-center'>  
//         <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
//           <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">{type == "post" ? "Создать новый куст" : "Обновить этот куст"}</h2>
//           <Form 
//             className='grid gap-2' 
//             onSubmit={handleSubmit} 
//           >
//             {/* Name of design */}
//             <div className="input-wrapper">
//               <label htmlFor="nameSite">
//                 Имя дизайна
//               </label>
//               <input
//                 id="nameDesign"
//                 type="text"
//                 name='name'
//                 placeholder={type=="put" ? prevName : "Введите имя дизайна"} 
//                 value={nameDesign}
//                 onChange={(e) => setNameDesign(e.target.value)}
//                 required
//               />
//               <input type="hidden" name="id" value={id}/>
//             </div>

//             {/* Stafe of design */}
//             <div className="input-wrapper">
//               <label htmlFor="stageSite">
//                 Стадия дизайна
//               </label>
//               <input
//                 id="stageDesign"
//                 type="text"
//                 placeholder={type=="put" ? prevStage : "Введите стадию дизайна"} 
//                 value={stageDesign}
//                 onChange={(e) => setStageDesign(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Version of design */}
//             <div className="input-wrapper">
//               <label htmlFor="versinoSite">
//                 Версия дизайна
//               </label>
//               <input
//                 id="versionDesign"
//                 type="text"
//                 placeholder={type=="put" ? prevVersion : "Введите версию дизайна"} 
//                 value={versionDesign}
//                 onChange={(e) => setVersionDesign(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Submit button */}
//             <div className="flex flex-col items-center justify-between mt-3 mx-6">
//                 <button type="submit" className='w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base'>
//                     {type === 'put' ? 'Обновить' : 'Создать'}
//                 </button>
//                 { type === 'put' && (<button className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" onClick={() => {
//                     if(setIsEdit) {setIsEdit(false);}
//                 }}>Закрыть</button>)}
//             </div>
//           </Form>
//       </div>
//     </div>
//   )
// }

// export default CreateDesign
