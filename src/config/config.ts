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
    gender: [
        {
            id: '1',
            description: 'Male'
        },
        {
            id: '2',
            description: 'Female'
        }
    ],
    roles: {
        doctor: 'doctor',
        nonDoctor: 'nonDoctor',
    },
    medicalArts: [
        {
            code: '0',
            description: 'Audiologist'
        },
        {
            code: '1',
            description: 'Allergist'
        },
        {
            code: '2',
            description: 'Andrologists'
        },
        {
            code: '3',
            description: 'Anesthesiologist'
        },
        {
            code: '4',
            description: 'Cardiologist'
        },
        {
            code: '5',
            description: 'Cardiovascular Surgeon'
        },
        {
            code: '6',
            description: 'Clinical Neurophysiologist'
        },
        {
            code: '7',
            description: 'Dentist'
        },
        {
            code: '8',
            description: 'Dermatologist'
        },
        {
            code: '9',
            description: 'Emergency Doctors'
        },
        {
            code: '10',
            description: 'Endocrinologist'
        },
        {
            code: '11',
            description: 'Epidemiologists'
        },
        {
            code: '12',
            description: 'ENT Specialist'
        },
        {
            code: '13',
            description: 'Family Practitioner'
        },
        {
            code: '14',
            description: 'Gastroenterologist'
        },
        {
            code: '15',
            description: 'Gynecologist'
        },
        {
            code: '16',
            description: 'General Psychiatrist'
        },
        {
            code: '17',
            description: 'Hematologist'
        },
        {
            code: '18',
            description: 'Hepatologists'
        },
        {
            code: '20',
            description: 'Infectious Disease Specialist'
        },
        {
            code: '21',
            description: 'Internal Medicine Specialists'
        },
        {
            code: '22',
            description: 'Internists'
        },
        {
            code: '17',
            description: 'Medical Geneticist'
        },
        {
            code: '24',
            description: 'Medical Geneticist'
        },
        {
            code: '25',
            description: 'Microbiologist'
        },
        {
            code: '26',
            description: 'Neonatologist'
        },
        {
            code: '27',
            description: 'Nephrologists'
        },
        {
            code: '28',
            description: 'Neurologist'
        },
        {
            code: '29',
            description: 'Neurosurgeons'
        },
        {
            code: '30',
            description: 'Obstetrician'
        },
        {
            code: '31',
            description: 'Oncologist'
        },
        {
            code: '32',
            description: 'Ophthalmologist'
        },
        {
            code: '33',
            description: 'Orthopedic Surgeon'
        },
        {
            code: '34',
            description: 'Orthopedist'
        },
        {
            code: '35',
            description: 'Primatologist'
        },
        {
            code: '36',
            description: 'Pale pathologist'
        },
        {
            code: '37',
            description: 'Parasitologist'
        },
        {
            code: '38',
            description: 'Pathologists'
        },
        {
            code: '39',
            description: 'Pediatrician'
        },
        {
            code: '40',
            description: 'Plastic Surgeon'
        },
        {
            code: '41',
            description: 'Podiatrists'
        },
        {
            code: '42',
            description: 'Psychiatrists'
        },
        {
            code: '43',
            description: 'Pulmonologist'
        },
        {
            code: '44',
            description: 'Radiologists'
        },
        {
            code: '45',
            description: 'Reproductive Endocrinologist'
        },
        {
            code: '46',
            description: 'Rheumatologist'
        },
        {
            code: '47',
            description: 'Surgeon'
        }, {
            code: '45',
            description: 'Thoracic Oncologist'
        },
        {
            code: '46',
            description: 'Urologist'
        },
        {
            code: '47',
            description: 'Veterinarian'
        }
    ]
};
