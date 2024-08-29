import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../api/axios.api';
import { ICompany } from '../types/types';
import { toast } from 'react-toastify';
import SideBar from '../components/SideBar';
import { FaPen, FaTrash } from 'react-icons/fa';
import CreateCompany from '../components/forms/CreateCompany';
import { useDispatch } from 'react-redux';
import { openCompanyForm } from '../store/user/companySlice';
import { closeFieldForm } from '../store/user/fieldSlice';
import { closeSiteForm } from '../store/user/siteSlice';
import { closeWellForm } from '../store/user/wellSlice';
import { closeWellBoreForm } from '../store/user/wellBoreSlice';
import { closeDesignForm } from '../store/user/designSlice';

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<ICompany | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await instance.get<ICompany>(`/api/v1/companies/${id}`);
        setCompany(response.data);
      } catch (error) {
        toast.error('Failed to load company details');
      }
    };

    fetchCompany();
  }, [id]);

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/v1/companies/${id}`);
      toast.success('Company deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete the company');
    }
  };

  const companyCreateFormOpenHandler = () => {
    dispatch(openCompanyForm());
    dispatch(closeFieldForm());
    dispatch(closeSiteForm());
    dispatch(closeWellForm());
    dispatch(closeWellBoreForm());
    dispatch(closeDesignForm());
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className='h-screen w-full flex'>
      <SideBar />
      <div className='flex flex-col h-screen w-full'>
        {!isEdit ? (
          <>
            <div className='flex flex-col items-center'>
              <h1>{company.name}</h1>
              <p>Division: {company.division}</p>
              <p>Group: {company.group}</p>
              <p>Representative: {company.representative}</p>
              <p>Address: {company.address}</p>
              <p>Phone: {company.phone}</p>
            </div>
            <div className='flex flex-col items-center'>
              <button
                className='btn hover:btn-green items-center justify-center'
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                <FaPen />
              </button>
              <button
                className='btn hover:btn-red items-center justify-center ml-auto'
                onClick={handleDelete}
              >
                <FaTrash />
              </button>
            </div>
          </>
        ) : (
          company && (
            <CreateCompany
              prevName={company.name}
              prevDivision={company.division}
              prevGroup={company.group}
              prevAddress={company.address}
              prevRepresentative={company.representative}
              prevPhone={company.phone}
              type='put'
              id={id}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;