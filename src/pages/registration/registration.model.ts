export class RegistrationData {
    password: string;
    photo: string;
    profile: Profile;
    assistants: Profile[];
}

export class Profile {
    prc: number;
    ptr: number;
    doctorType: string;
    specialization: string;
    email: string;
    lastName: string;
    firstName: string;
    middleName?: string;
    birthDate: Date;
    gender?: string;
    maritalStatus?: string;
    contactNo: string;
}
