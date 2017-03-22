import { environment } from './environment';

export const CONFIG = {
    // Others
    API: {
        authenticate: '/users/authenticate'
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
