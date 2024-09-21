// import {FC, useEffect, useState} from 'react'
// import SideBarMenu from './SideBarItem';
// import { HiMiniSquares2X2 } from "react-icons/hi2";
// import { MdPeople } from "react-icons/md";
// import { FaGear } from "react-icons/fa6";
// import { FaSignOutAlt } from "react-icons/fa";
// import { useAuth } from '../hooks/useAuth';
// import { useAppDispatch } from '../store/hooks';
// import { useLoaderData, useNavigate } from 'react-router-dom';
// import { logout } from '../store/user/userSlice';
// import { toast } from 'react-toastify';
// import { openCompanyForm } from '../store/user/companySlice';
// import { closeFieldForm } from '../store/user/fieldSlice';
// import { closeSiteForm } from '../store/user/siteSlice';
// import { closeWellForm } from '../store/user/wellSlice';
// import { closeWellBoreForm } from '../store/user/wellBoreSlice';
// import { closeDesignForm } from '../store/user/designSlice';
// import { ICompany, IResponseLoader } from '../types/types';
// import { returnCompanies } from '../helpers/dataLoader';
// import { convertFieldsToMenuItems } from '../helpers/menuItemTurner';
// import instance from '../api/axios.api';

// const SideBar: FC = () => {
//   const isAuth = useAuth()
//   const dispatch = useAppDispatch()
//   const navigate = useNavigate()
//   console.log("1")
//   const { companies: initialCompanies = [] } = useLoaderData() as IResponseLoader || {};
//   console.log(initialCompanies)
//   console.log("2")

//   const logoutHandler = () => {
//     dispatch(logout())
//     toast.success('You successfully logged out')
//     navigate('/auth')
//   }

//   const companyCreateFormOpenHandler = () => {
//     navigate("/")
//     dispatch(openCompanyForm())
//     dispatch(closeFieldForm())
//     dispatch(closeSiteForm())
//     dispatch(closeWellForm())
//     dispatch(closeWellBoreForm())
//     dispatch(closeDesignForm())
//   }

//     const [companies, setCompanies] = useState<ICompany[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             // Ensure initialCompanies is an array and is not empty
//             if (Array.isArray(initialCompanies) && initialCompanies.length > 0) {
//                 try {
//                     // Await returnCompanies with initialCompanies
//                     const tempCompanyData = await returnCompanies(initialCompanies);
//                     setCompanies(tempCompanyData); // Update state with fully resolved data
//                 } catch (error) {
//                     console.error("Error fetching company data:", error);
//                 }
//             }
//         };

//         fetchData();
//         console.log(companies)
//     }, [initialCompanies]);

//   return isAuth ? 
//     (<div className='flex flex-col w-1/5 bg-[#16171B] text-white fixed h-screen'>
//       <h1 className='flex text-4xl font-semibold font-montserrat mt-12 mb-16 justify-center items-start' onClick={() => {navigate("/")}}>MunaiPlan</h1>
//       <div 
//         onClick={companyCreateFormOpenHandler}
//         className='flex justify-center items-start'>
//         <button className='flex text-sm rounded-2xl bg-[#FDFFFF] text-[#16171B] w-52 justify-center items-center h-10 mb-5 hover:bg-gray-300'>+ Создать компанию</button>
//       </div>
//       {/* Dropdown */}
//       <div className='flex flex-col ml-10 mr-10 mb-6 overflow-y-auto flex-grow'>
//         <div className='flex flex-col gap-x-1 items-start justify-center'>
//           {companies.map((company) => (
//             <SideBarMenu key={company.id} 
//               item={{
//                 id: company.id,
//                 name: company.name,
//                 children: convertFieldsToMenuItems(company.fields || []), // Transform fields to MenuItem[]
//             }} />
//           ))}
//         </div>
//       </div>
//       {/* Catalog, Logout, Account */}
//       <div id="footer" className="flex bottom-0 left-0 w-full bg-[#16171B] h-1/5 pl-4 pr-4 pt-5 border-t border-gray-400 text-white items-start">
//         <div className='flex flex-col flex-grow'>
//           <div className='flex justify-start items-center'>
//             <HiMiniSquares2X2 className='mr-2 text-white' />
//             <button onClick={() => navigate('/catalog')}>
//               Каталог
//             </button>
//           </div>
//           <div className='flex justify-start items-center mt-2'>
//             <MdPeople className='mr-2 text-white' />
//             <button onClick={() => navigate('/account')}>
//               Аккаунт
//             </button>
//           </div>
//           <div className='flex justify-start items-center mt-2 mb-2'>
//             <FaGear className='mr-2 text-white' />
//             <button onClick={() => navigate('/settings')}>
//               Настройки
//             </button>
//           </div>
//         </div>
//         <div className='flex items-center justify-end ml-4'>
//           <FaSignOutAlt className='mr-2 text-white'/>
//           <button onClick={logoutHandler}>
//             Выйти
//           </button>
//         </div>
//       </div>
//     </div>) : (
//       <div className="w-1/2 bg-[#16171B] flex items-top justify-left">
//         <h1 className="text-white text-3xl font-semibold ml-24 mt-12 font-inter" onClick={() => {navigate("/")}}>MunaiPlan</h1>
//       </div>
// )};

// export default SideBar;
