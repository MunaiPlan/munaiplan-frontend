export interface IUser {
    id: number
    email: string
    token: string
    tokenExpiresAt: number
    refreshToken: string
    refreshTokenExpiresAt: number
}


export interface IUserData {
    email: string,
    password: string
}

export interface RegistrationData {
    email: string,
    name: string,
    surname: string,
    password: string,
    phone: string
}


export interface RegistrationResponseData {
    expires_at: number,
    refresh_token: string,
    refresh_token_expires_at: number,
    refresh_token_type: string,
    success: boolean,
    token: string,
    token_type: string
  }

export interface SignInEmailAndPassword {
    email: string,
    password: string
}

export interface SignIn {
    body: SignInEmailAndPassword,
    organizationId: string
}

export interface SignInResponse {
    expires_at: number,
    refresh_token: string,
    refresh_token_expires_at: number,
    refresh_token_type: string,
    success: boolean,
    token: string,
    token_type: string
}

export interface IResponseUser {
    email: string
    id: number
    createdAt: string
    updatedAt: string
    password: string
}

export interface IResponseUserData {
    token: string
    user: IResponseUser
}


export interface ICompany {
    id: string
    name: string
    division: string
    group: string
    representative: string
    address: string
    phone: string
    fields: IField[] | null
}

export interface IField {
    id: string
    companyId: string
    name: string
    description: string
    reduction_level: string
    active_field_unit: string
    company: ICompany | undefined
    sites: ISite[]
}

export interface ISite {
    id: string
    name: string
    area: number
    block: string
    azimuth: number
    country: string
    state: string
    region: string
    wells: IWell[]
    fieldId: string
}

export interface IWell {
    id: string
    name: string
    description: string
    location: string
    universal_well_identifier: string
    type: string
    well_number: string
    working_group: string
    active_well_unit: string
    wellBores: IWellBore[]
    createdAt: Date
    siteId: string
}

export interface IWellBore {
    id: string
    name: string
    bottomLocation: string
    wellBoreDepth: number
    averageHookLead: number
    riserPressure: number
    averageInLetFlow: number
    averageColumnRotationFrequency: number
    maximumColumnRotationFrequency: number
    averageWeightOnBit: number
    maximumWeightOnBit: number
    averageTorque: number
    maximumTorque: number
    downStaticFriction: number
    depthInterval: number
    designs: IDesign[]
    createdAt: Date
}

export interface IDesign {
    id: string
    planName: string
    stage: string
    version: string
    actualDate: Date
    cases: ICase[]
    trajectories: ITrajectory[]
    createdAt: Date
}

export interface ICase{
    id: string
    caseName: string
    caseDescription: string
    drillDepth: number
    pipeSize: number
    createdAt: Date
}

export interface ITrajectory{

}

export interface IResponseLoader {
    companies: ICompany[]
}