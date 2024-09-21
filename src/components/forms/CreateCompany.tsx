// import {FC, useState} from 'react'
// import { Form, useNavigate } from 'react-router-dom'
// import { IField } from '../../types/types'
// import { instance } from '../../api/axios.api';
// import { toast } from 'react-toastify';

// interface ICompanyForm {
//   type: "post" | "put";
//   id?: string;
//   prevName: string;
//   prevDivision: string;
//   prevGroup: string;
//   prevRepresentative: string;
//   prevAddress: string;
//   prevPhone: string;
//   fields?: IField[];
//   setIsEdit?: (edit: boolean) => void;
//   onSuccess?: () => void
// }


// const CreateCompany: FC<ICompanyForm> = ({type="post", id, prevName, prevDivision, prevGroup, prevRepresentative, prevAddress, prevPhone, setIsEdit, onSuccess}) => {

//   const [nameCompany, setNameCompany] = useState(prevName)
//   const [divisionCompany, setDivisionCompany] = useState(prevDivision)
//   const [groupCompany, setGroupCompany] = useState(prevGroup)
//   const [representativeCompany, setRepresentativeCompany] = useState(prevRepresentative)
//   const [addressCompany, setAddressCompany] = useState(prevAddress)
//   const [phoneCompany, setPhoneCompany] = useState(prevPhone)

//   const navigate = useNavigate()

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     try {
//       if (type == 'post') {
//         const newCompany = {
//           name: nameCompany,
//           division: divisionCompany,
//           group: groupCompany,
//           representative: representativeCompany,
//           address: addressCompany,
//           phone: phoneCompany
//         };
//         await instance.post('/api/v1/companies', newCompany)
//         toast.success("Company was added")
//         navigate("/")
//       }
//       if (type == 'put' && id) {
//         const updatedCompany = {
//           name: nameCompany,
//           division: divisionCompany,
//           group: groupCompany,
//           representative: representativeCompany,
//           address: addressCompany,
//           phone: phoneCompany
//         };
//         await instance.put(`/api/v1/companies/${id}`, updatedCompany);
//         toast.success("Компания была успешно обновлено");
//         if (onSuccess) onSuccess();
//         navigate('/')
//       }
//     } catch (e) {
//       toast.error('Не удалось обновить компанию');
//     }
//   }
//   return (
//     <div className='w-screen flex flex-col justify-center items-center'>  
//         <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
//           <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">{type == "post" ? "Создать новую компанию" : "Обновить эту компанию"}</h2>
//           <Form 
//             className='grid gap-2' 
//             onSubmit={handleSubmit} 
//           >
//             {/* Name of company */}
//             <div className="input-wrapper">
//               <label htmlFor="nameCompany">
//                 Имя компании
//               </label>
//               <input
//                 id="nameCompany"
//                 type="text"
//                 name='name'
//                 placeholder={type=="put" ? prevName : "Введите имя компании"} 
//                 value={nameCompany}
//                 onChange={(e) => setNameCompany(e.target.value)}
//                 required
//               />
//               <input type="hidden" name="id" value={id}/>
//             </div>

//             {/* Division of company */}
//             <div className="input-wrapper">
//               <label htmlFor="divisionCompany">
//                 Дивизия компании
//               </label>
//               <input
//                 id="divisionCompany"
//                 type="text"
//                 name='division'
//                 placeholder={type=="put" ? prevDivision : "Введите дивизию компании"} 
//                 value={divisionCompany}
//                 onChange={(e) => setDivisionCompany(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Group of company */}
//             <div className="input-wrapper">
//               <label htmlFor="groupCompany">
//                 Группа компании
//               </label>
//               <input
//                 id="groupCompany"
//                 type="text"
//                 name='group'
//                 placeholder={type=="put" ? prevGroup : "Введите группу компании"} 
//                 value={groupCompany}
//                 onChange={(e) => setGroupCompany(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Representative of company */}
//             <div className="input-wrapper">
//               <label htmlFor="representativeCompany">
//                 ФИО представителя
//               </label>
//               <input
//                 id="representativeCompany"
//                 type="text"
//                 name='representative'
//                 placeholder={type=="put" ? prevRepresentative : "Введите ФИО представителя"} 
//                 onChange={(e) => setRepresentativeCompany(e.target.value)}
//                 value={representativeCompany}
//                 required
//               />
//             </div>

//             {/* Address of company */}
//             <div className="input-wrapper">
//               <label htmlFor="addressCompany">
//                 Адрес компании
//               </label>
//               <input
//                 id="addressCompany"
//                 type="text"
//                 name='address'
//                 placeholder={type=="put" ? prevAddress : "Введите адрес компании"} 
//                 value={addressCompany}
//                 onChange={(e) => setAddressCompany(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Phone Number of company */}
//             <div className="input-wrapper">
//               <label htmlFor="phoneNumberCompany">
//                 Телефонный номер компании
//               </label>
//               <input
//                 id="phoneNumberCompany"
//                 type="text"
//                 name='phone'
//                 placeholder={type=="put" ? prevPhone : "Введите телефонный номер компании"} 
//                 value={phoneCompany}
//                 onChange={(e) => setPhoneCompany(e.target.value)}
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

// export default CreateCompany
