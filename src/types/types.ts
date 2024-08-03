export interface IUser {
    id: number
    email: string
    token: string
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
    id: string | null 
    name: string | null
    division: string | null
    group: string | null
    representative: string | null
    address: string | null
    phone: string | null
    fields: IField[] | null
}

export interface IField {
    companyId: string
    name: string
    description: string
    reductionLevel: string
    activeFieldUnit: string
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
}

export interface IWell {
    id: string
    name: string
    description: string
    location: string
    universalWellIdentifier: string
    type: string
    wellNumber: string
    workingGroup: string
    activeWellUnit: string
    wellBores: IWellBore[]
    createdAt: Date
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

}

export interface ITrajectory{

}