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
        { code: '0', description: 'Audiologist' },
        { code: '1', description: 'Allergist' },
        { code: '2', description: 'Andrologist' },
        { code: '3', description: 'Anesthesiologist' },
        { code: '4', description: 'Cardiologist' },
        { code: '5', description: 'Cardiovascular Surgeon' },
        { code: '6', description: 'Clinical Neurophysiologist' },
        { code: '7', description: 'Dentist' },
        { code: '8', description: 'Dermatologist' },
        { code: '9', description: 'Emergency Doctors' },
        { code: '10', description: 'Endocrinologist' },
        { code: '11', description: 'Epidemiologist' },
        { code: '12', description: 'ENT Specialist' },
        { code: '13', description: 'Family Practitioner' },
        { code: '14', description: 'Gastroenterologist' },
        { code: '15', description: 'Gynecologist' },
        { code: '16', description: 'General Psychiatrist' },
        { code: '17', description: 'Hematologist' },
        { code: '18', description: 'Hepatologist' },
        { code: '19', description: 'Infectious Disease Specialist' },
        { code: '20', description: 'Internal Medicine Specialist' },
        { code: '21', description: 'Internists' },
        { code: '22', description: 'Medical Geneticist' },
        { code: '23', description: 'Microbiologist' },
        { code: '24', description: 'Neonatologist' },
        { code: '25', description: 'Nephrologist' },
        { code: '26', description: 'Neurologist' },
        { code: '27', description: 'Neurosurgeon' },
        { code: '28', description: 'Obstetrician' },
        { code: '29', description: 'Oncologist' },
        { code: '30', description: 'Opthalmologist' },
        { code: '31', description: 'Orthopedic Surgeon' },
        { code: '32', description: 'Orthopedist' },
        { code: '33', description: 'Primatologist' },
        { code: '34', description: 'Pale Pathologist' },
        { code: '35', description: 'Parasitologist' },
        { code: '36', description: 'Pathologist' },
        { code: '37', description: 'Pediatrician' },
        { code: '38', description: 'Plastic Surgeon' },
        { code: '39', description: 'Podiatrist' },
        { code: '40', description: 'Psychiatrist' },
        { code: '41', description: 'Pulomonologist' },
        { code: '42', description: 'Radiologist' },
        { code: '43', description: 'Reproductive Endocrinologist' },
        { code: '44', description: 'Rheumatologist' },
        { code: '45', description: 'Surgeon' },
        { code: '46', description: 'Thoraxic Oncologist' },
        { code: '47', description: 'Urologist' },
        { code: '48', description: 'Veterinarian' }
    ]
};
