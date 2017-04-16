
export const CONFIG = {
    // Others
    API: {
        assistantDetails: '/assistantdetails',

        doctorDetails: '/doctordetails',
        getNoOfClinics: '/doctordetails/clinics',

        authenticate: '/users/authenticate',
        changePassword: '/users/changepass',
        changeStatus: '/users/changestatus',
        contacts: '/usercontacts/',
        getUserContacts: '/usercontacts/u'

    },
    SOCKETS: {
        queue: '/queue/'

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

export const HTTP_CONFIG = {

}
