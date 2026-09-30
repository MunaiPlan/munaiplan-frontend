/** Shared API shapes used by more than one module. Feature-local shapes live next to their feature. */

export interface IUser {
    token: string
    tokenExpiresAt: number
    refreshToken: string
    refreshTokenExpiresAt: number
}

export interface IUserData {
    email: string,
    password: string
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
    holes: unknown[],
    is_complete: boolean
}

export interface IString {
    id?: string
    name: string
    depth: number
    caseId?: string
    sections: ISection[]
}

export interface ISection {
    id: string
    description: string
    manufacturer: string
    type: string
    body_md: number
    body_length: number
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

export interface IFluid {
    id?: string;
    name: string;
    description: string;
    density: number;
    fluid_base_type: IFluidType;
    base_fluid: IFluidType;
    caseId?: string;
}

export interface IFluidType {
    id: string;
    name: string;
}

export interface IRig {
    id?: string;
    case_id?: string;

    block_rating: number | null;
    torque_rating: number | null;

    rated_working_pressure: number;
    bop_pressure_rating: number;
    surface_pressure_loss: number;
    standpipe_length: number | null;
    standpipe_internal_diameter: number | null;
    hose_length: number | null;
    hose_internal_diameter: number | null;
    swivel_length: number | null;
    swivel_internal_diameter: number | null;
    kelly_length: number | null;
    kelly_internal_diameter: number | null;
    pump_discharge_line_length: number | null;
    pump_discharge_line_internal_diameter: number | null;
    top_drive_stackup_length: number | null;
    top_drive_stackup_internal_diameter: number | null;
}
