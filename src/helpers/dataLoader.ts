import instance from "../api/axios.api";
import { ICase, ICompany, IDesign, IField, ISite, IWell, IWellBore } from "../types/types";

export async function returnCompanies(companies: ICompany[]): Promise<ICompany[]> {
    const tempCompanies: ICompany[] = [];
    for (const company of companies) {
        console.log(company)
        const fields = await returnFields(company.id); // Resolving the promise here
        company.fields = fields
        tempCompanies.push({ ...company, fields }); // Assigning resolved fields to the company
    }
    return tempCompanies;
}

async function returnFields(companyId: string): Promise<IField[]> {
    const fieldsResponse = await instance.get<IField[]>(`/api/v1/fields/?companyId=${companyId}`);
    const fields: IField[] = fieldsResponse.data;
    const tempFields: IField[] = [];
    if (fields) {
        for (const field of fields) {
            console.log(field)
            const sites = await returnSites(field.id); // Resolving the promise here
            field.sites = sites
            tempFields.push({ ...field, sites }); // Assigning resolved sites to the field
        }
        return tempFields;
    } else {
        return fields
    }
}

async function returnSites(fieldId: string): Promise<ISite[]> {
    console.log(fieldId)
    const sitesResponse = await instance.get<ISite[]>(`/api/v1/sites/?fieldId=${fieldId}`);
    const sites: ISite[] = sitesResponse.data;
    console.log(sites)
    const tempSites: ISite[] = [];
    if (sites) {
        for (const site of sites) {
            console.log(site)
            const wells = await returnWells(site.id); // Resolving the promise here
            tempSites.push({ ...site, wells }); // Assigning resolved wells to the site
        }
        console.log('end')
        return tempSites;
    } else {
        return sites
    }
}

async function returnWells(siteId: string): Promise<IWell[]> { 
    const wellsResponse = await instance.get<IWell[]>(`/api/v1/wells/?siteId=${siteId}`);
    const wells: IWell[] = wellsResponse.data;
    const tempWells: IWell[] = [];
    if (wells) {
        for (const well of wells) {
            const wellBores = await returnWellBores(well.id); // Resolving the promise here
            tempWells.push({ ...well, wellBores }); // Assigning resolved wellbores to the well
        }
        return tempWells;
    } else {
        return wells
    }
}

async function returnWellBores(wellId: string): Promise<IWellBore[]> {
    const wellBoresResponse = await instance.get<IWellBore[]>(`/api/v1/wellbores/?wellId=${wellId}`);
    const wellBores: IWellBore[] = wellBoresResponse.data;
    const tempWellBores: IWellBore[] = [];
    for (const wellBore of wellBores) {
        const designs = await returnDesigns(wellBore.id); // Resolving the promise here
        tempWellBores.push({ ...wellBore, designs }); // Assigning resolved designs to the wellbore
    }
    return tempWellBores;
}

async function returnDesigns(wellBoreId: string): Promise<IDesign[]> {
    const designsResponse = await instance.get<IDesign[]>(`/api/v1/designs/?wellBoreId=${wellBoreId}`);
    const designs: IDesign[] = designsResponse.data;
    const tempDesigns: IDesign[] = [];
    for (const design of designs) {
        const cases = await returnCases(design.id); // Resolving the promise here
        tempDesigns.push({ ...design, cases }); // Assigning resolved cases to the design
    }
    return tempDesigns;
}

async function returnCases(designId: string): Promise<ICase[]> {
    const casesResponse = await instance.get<ICase[]>(`/api/v1/trajectories/?designId=${designId}`);
    const cases: ICase[] = casesResponse.data;
    return cases; // No further nested levels, so we just return cases
}