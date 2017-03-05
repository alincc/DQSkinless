export class RegistrationData {
    user: RegistrationForm;
    assistant: RegistrationForm[];
}

export class RegistrationForm {
    password: string;
    photo: string;
    profile: Profile;
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
    address?: string;
    gender?: string;
    maritalStatus?: string;
    contactNo: string;

    get fullName() {
        return this.lastName + ', ' + this.firstName + ' ' + this.middleName;
    }
}
