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
    bottom_hole_location: string
    wellbore_depth: number
    average_hook_load: number
    riser_pressure: number
    average_inlet_flow: number
    average_column_rotation_frequency: number
    maximum_column_rotation_frequency: number
    average_weight_on_bit: number
    maximum_weight_on_bit: number
    average_torque: number
    maximum_torque: number
    down_static_friction: number
    depth_interval: number
    designs: IDesign[]
    createdAt: Date
    wellId: string
}

export interface IDesign {
    id: string
    plan_name: string
    stage: string
    version: string
    actualDate: Date
    trajectories: ITrajectory[]
    createdAt: Date
    wellboreId: string
}

export interface ICase{
    id: string
    case_name: string
    case_description: string
    drill_depth: number
    pipe_size: number
    createdAt: Date
    trajectoryId: string
    fluids: IFluid[],
    strings: IString[],
    holes: IHole[],
    is_complete: boolean
}

export interface IFluid {
    id: string
    caseId: string
    name: string
    description: string
    density: number
    fluid_base_type_id: string
    base_fluid_id: string
}

export interface IString {
    id: string
    name: string
    depth: number
    caseId: string
    sections: ISection[]
}


export interface IHole {
    id: string
    caseId: string
    md_top: number
    md_base: number
    length: number
    shoe_md: number
    od: number
    caising_internal_diameter: number
    drift_internal_diameter: number
    effective_hole_diameter: number
    weigth: number
    grade: string
    min_yield_strength: number
    burst_rating: number
    collapse_rating: number
    friction_factor_casing: number
    linear_capacity_casing: number
    description_casing: string
    manufacturer_casing: string
    model_casing: string
    open_hole_md_top: number
    open_hole_md_base: number
    open_hole_length: number
    open_hole_internal_diameter: number
    effective_diameter: number
    friction_factor_open_hole: number
    linear_capacity_open_hole: number
    volume_excess: number
    description_open_hole: string
    tripping_in_casing: number
    tripping_out_casing: number
    rotating_on_bottom_casing: number
    slide_drilling_casing: number
    back_reaming_casing: number
    rotating_off_bottom_casing: number
    tripping_in_open_hole: number
    tripping_out_open_hole: number
    rotating_on_bottom_open_hole: number
    slide_drilling_open_hole: number
    back_reaming_open_hole: number
    rotating_off_bottom_open_hole: number
}

export interface ITrajectory{
    id: string
    name: string
    description: string
    designId: string
    headers: ITrajectoryHeader[]
    units: ITrajectoryUnit[]
    cases: ICase[]
}

export interface ITrajectoryHeader {
    id: string
    trajectoryId: string
    customer: string
    project: string
    profile_type: string
    field: string
    your_ref: string
    structure: string
    job_number: string
    wellhead: string
    kelly_bushing_elev: number
    profile: string
    createdAt: Date
}

export interface ITrajectoryUnit {
    id: string
    trajectoryId: string
    md: number
    incl: number
    azim: number
    sub_sea: number
    tvd: number
    local_n_coord: number
    local_e_coord: number
    global_n_coord: number
    global_e_coord: number
    dogleg: number
    vertical_section: number
    createdAt: Date
}

export interface IResponseLoader {
    companies: ICompany[]
}


export interface ISection {
    id: string
    description: string
    manufacturer: string
    type: string
    body_od: number
    body_id: number
    avg_joint_length: number
    stabilizer_length: number
    stabilizer_od: number
    stabilizer_id: number
    weight: number
    material: string
    grade: string
    class: number
    friction_coefficient: number
    min_yield_strength: number
}