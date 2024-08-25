import {FC, useState} from 'react'
import { useAppDispatch } from '../store/hooks'
import { createCompany, openCompanyForm } from '../store/user/companySlice'
import { toast } from 'react-toastify'
import { companyService } from '../services/forms.service'
import { Form, useNavigate } from 'react-router-dom'
import { instance } from '../api/axios.api'
import { ICompany, IField } from '../types/types'
import CreateCompany from '../components/forms/CreateCompany'

export const companiesLoader = async() => {
  try {
    const companies = await instance.get<ICompany[]>('/api/v1/companies');
    console.log(companies)
    const data = { companies: companies.data };
    console.log("START");
    console.log(data);  // Make sure data is correctly logged
    console.log("END");
    return data;
  } catch (error) {
    console.error('Failed to load companies:', error);
    return { companies: [] };  // Return an empty array if there's an error
  }
};

export const companiesAction = async({request }: any) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData()
      console.log(formData.get("name"))
      const newCompany = {
        name: formData.get("name"),
        division: formData.get("division"),
        group: formData.get("group"),
        representative: formData.get("representative"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        fields: [],
      }
      await instance.post('/api/v1/companies', newCompany)
      toast.success("Company was added")
      return null
    }
    case "DELETE": {
        const formData = await request.formData()
        const companyID = formData.get('id')
        await instance.delete(`/api/v1/companies/${companyID}`)
        toast.success("Компания была успешно удалена")
        return null
    }
  }
}


const Company: FC = () => {
    return <>
        <CreateCompany type={"post"} prevName={""} prevDivision={""} prevAddress={""} prevGroup={""} prevPhone={""} prevRepresentative={""}/>
    </>
}

export default Company;