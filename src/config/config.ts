import { environment } from './environment';

export const config = {
    // Environment Specific
    production: environment.production,
    envName: environment.envName,
    endpoint: environment.endpoint,

    // Others
    api: {

    },
    regex: {
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        password: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/
    },
    messages: {
        error: {
            generic: 'Something went wrong...'
        }
    },
    GENDER: [
        {
            id: '1',
            description: 'Male'
        },
        {
            id: '2',
            description: 'Female'
        }
    ]
};
