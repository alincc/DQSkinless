export class RegistrationForm {
    password: string;
    photo: string;
    profile: Profile;
}

export class Profile {
    prc: string;
    ptr: string;
    medicalArt: string;
    specialization: string;
    email: string;
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string;
    address: string;
    gender: string;
    maritalStatus?: string;
    contactNo: string;

    get fullName() {
        return (this.lastName ? this.lastName + ', ' : '') + this.firstName + ' ' + (this.middleName ? this.middleName : '');
    }

    constructor() {
        this.prc = '';
        this.ptr = '';
        this.medicalArt = '';
        this.specialization = '';
        this.email = '';
        this.lastName = '';
        this.firstName = '';
        this.middleName = '';
        this.birthDate = '';
        this.address = ''
        this.gender = '';
        this.maritalStatus = '';
        this.contactNo = '';
    }
}
