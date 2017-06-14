
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
        resetPassword: '/users/passwdres',

        queue: '/queue',
        queueBoard: '/queue-board',

        clinicAccess: '/clinicaccess',
        updateAccessExpiryProcess: '/clinicaccess/accessroleexp',
        clinicDetailRecord: '/clinicdetails',
        clinicTimeSlots: '/clinictimeslots',
        clinicContacts: '/cliniccontacts',
        customClinic: '/customclinic',
        getClinicAccessByUserId: '/clinicaccess/u/gbcid',
        getClinicRecordByUserId: '/clinicdetails/u',
        getClinicTimeSlotByClinicId: '/clinictimeslots/cidli',
        getClinicContactByClinicId: '/cliniccontacts/cidli',
        getClinicMember: '/members/clnid',
        patientDetails: '/patientdetails',
        patientAccess: '/patientaccess',
        patientContacts: 'patientcontacts',
        customPatient: '/custompatient/pdmetc'
    },
    SOCKETS: {
        queue: '/queue-socket'
    },
    ONE_SIGNAL: {
        create: 'https://onesignal.com/api/v1/notifications'
    }
};

export const REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PASSWORD: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/
}

export const MESSAGES = {
    ERROR: {
        GENERIC: 'Something went wrong...',
        NOT_FOUND: 'Can\'t connect to server please check internet connection',
        NO_INTERNET: 'Cannot reach server, this might due to poor internet connection'
    },
    SUCCESS: {
        GENERIC: 'Congrats'
    }
}

export const YEAR_RANGE = 100;

export const ONE_SIGNAL = {
    APP_ID: 'bd78e626-b77c-4b1e-9e98-ee6a55758ebf',
    REST_KEY: 'NzgwZjBjZjYtM2NmYi00YjIzLWJiZTItZmU2OTA0MGUwZTEx',
    PROJECT_NUMBER: '79472100423',
    PUSH_TYPE: {
        MESSAGES: 'messages'
    },
    API: {
        CREATE: "https://onesignal.com/api/v1/notifications"
    }
}

export const DB_CONFIG = {
    MESSAGE_LIMIT: 10,
    DB_NAME: "MedAppWS.db",
    LOCATION: 'default',
    SQL: {
        GET_INBOX: 'select * from messages where clinic = ? and account = ? order by id desc limit ?',
        STORE_TO_INBOX: "insert into messages(name,message,avatar, clinic, account, userId) values (?,?,?,?,?,?)",
        CREATE: 'create table if not exists messages(id integer primary key autoincrement, name varchar(15), date date, message varchar(500), avatar varchar(100) , clinic integer, account integer, status integer default 0, userId integer)'
    }
}
