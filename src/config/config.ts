
export const CONFIG = {
    // Others
    API: {
        assistantDetails: '/assistantdetails',
        
        doctorDetails: '/doctordetails',
        getNoOfClinics: '/doctordetails/clinics',

        authenticate: '/users/authenticate',
        changePassword: '/users/changepass',
        changeStatus: '/users/changestatus',
        contacts: '/usercontacts',
        createAccount: '/users',
        getUserContacts: '/usercontacts/u',
        searchUser: '/users/sbc',

        queue: '/queue',
        queueBoard: '/queue-board',

        clinicaccess: '/clinicaccess',
        updateAccessExpiryProcess: '/clinicaccess/accessroleexp',
        clinicDetailRecord: '/clinicdetails',
        clinicTimeSlots: '/clinictimeslots',
        clinicContacts: '/cliniccontacts',
        customclinic: '/customclinic',
        getClinicAccessByUserId: '/clinicaccess/u/gbcid',
        getClinicRecordByUserId: '/clinicdetails/u',
        getClinicTimeSlotByClinicId: '/clinictimeslots/cidli',
        getClinicContactByClinicId: '/cliniccontacts/cidli',
        getClinicMember: `/members/clnid`
    },
    SOCKETS: {
        queue: '/queue-socket'
    }
};

export const REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PASSWORD: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/
}

export const MESSAGES = {
    ERROR: {
        GENERIC: 'Something went wrong...',
        NOT_FOUND: 'Can\'t connect to server please check internet connection'
    },
    SUCCESS: {
        GENERIC: 'Congrats'
    }
}

export const YEAR_RANGE = 100;
