
const assets = 'assets';
export const DIAGRAM = {
    assets: [
        assets + '/diagram/m-back.jpg',
        assets + '/diagram/m-front.jpg',
        assets + '/diagram/m-head.jpg',
        assets + '/diagram/w-back.jpg',
        assets + '/diagram/w-front.jpg',
        assets + '/diagram/w-head.jpg'
    ],
    label: [
        'Man Back',
        'Man Front',
        'Man Head',
        'Woman Back',
        'Woman Front',
        'Woman Head'
    ]
}


export const LOVS = {
    GENDER: [
        'Male',
        'Female'
    ],
    ACCESS_ROLES: [
        'Owner',
        'Admin',
        'Member'
    ],
    USER_ROLES: [
        'Admin',
        'Doctor',
        'Assistant'
    ],
    MEDICAL_ARTS: [
        /* 0  */ 'Audiologist',
        /* 1  */ 'Allergist',
        /* 2  */ 'Andrologist',
        /* 3  */ 'Anesthesiologist',
        /* 4  */ 'Cardiologist',
        /* 5  */ 'Cardiovascular Surgeon',
        /* 6  */ 'Clinical Neurophysiologist',
        /* 7  */ 'Dentist',
        /* 8  */ 'Dermatologist',
        /* 9  */ 'Emergency Doctors',
        /* 10 */ 'Endocrinologist',
        /* 11 */ 'Epidemiologist',
        /* 12 */ 'ENT Specialist',
        /* 13 */ 'Family Practitioner',
        /* 14 */ 'Gastroenterologist',
        /* 15 */ 'Gynecologist',
        /* 16 */ 'General Psychiatrist',
        /* 17 */ 'Hematologist',
        /* 18 */ 'Hepatologist',
        /* 19 */ 'Infectious Disease Specialist',
        /* 20 */ 'Internal Medicine Specialist',
        /* 21 */ 'Internists',
        /* 22 */ 'Medical Geneticist',
        /* 23 */ 'Microbiologist',
        /* 24 */ 'Neonatologist',
        /* 25 */ 'Nephrologist',
        /* 26 */ 'Neurologist',
        /* 27 */ 'Neurosurgeon',
        /* 28 */ 'Obstetrician',
        /* 29 */ 'Oncologist',
        /* 30 */ 'Opthalmologist',
        /* 31 */ 'Orthopedic Surgeon',
        /* 32 */ 'Orthopedist',
        /* 33 */ 'Primatologist',
        /* 34 */ 'Pale Pathologist',
        /* 35 */ 'Parasitologist',
        /* 36 */ 'Pathologist',
        /* 37 */ 'Pediatrician',
        /* 38 */ 'Plastic Surgeon',
        /* 39 */ 'Podiatrist',
        /* 40 */ 'Psychiatrist',
        /* 41 */ 'Pulomonologist',
        /* 42 */ 'Radiologist',
        /* 43 */ 'Reproductive Endocrinologist',
        /* 44 */ 'Rheumatologist',
        /* 45 */ 'Surgeon',
        /* 46 */ 'Thoraxic Oncologist',
        /* 47 */ 'Urologist',
        /* 48 */ 'Veterinarian'
    ],
    ALLOWABLE_MEDICAL_ARTS: [
        8
    ], /* FOR DELETION */
    CONTACT_TYPE: [
        'Home',
        'Mobile',
        'Office',
        'Other'
    ],
    DAYS: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ],
    PD_RELATIONSHIP: [
        'Owner',
        'Shared',
        'Transfered',
        'Collaboration'
    ],
    SEARCH_BY: [
        'Username',
        'Last name',
        'First name'
    ],
    LEGAL_STATUS: [
        'Single',
        'Married',
        'Widowed',
        'Separated',
        'Divorced'
    ]
}

export const MODE = {
    add: 'Add',
    edit: 'Edit',
    View: 'View'
}

export const QUEUE = {
    MAP: {
        DONE: "D",
        NEXT: "N",
        FETCH: "F",
        REQUEUE: "R"
    },
    STATUS: {
        DONE: "D",
        SERVING: "S",
        NO_SHOW: "N",
        QUEUED: "Q",
        EN_ROUTE: "E",
        RESCHED: "R",
        OUT: 'O',
        TRASH: 'T'
    },
    TYPE: {
        WALKIN: "W",
        SCHEDULED: "S"
    }
}

