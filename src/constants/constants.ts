
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
        'Member',
        'Admin',
        'Super Admin'
    ],
    USER_ROLES: [
        'Admin',
        'Doctor',
        'Assistant'
    ],
    MEDICAL_ARTS: [
        'Audiologist',
        'Allergist',
        'Andrologist',
        'Anesthesiologist',
        'Cardiologist',
        'Cardiovascular Surgeon',
        'Clinical Neurophysiologist',
        'Dentist',
        'Dermatologist',
        'Emergency Doctors',
        'Endocrinologist',
        'Epidemiologist',
        'ENT Specialist',
        'Family Practitioner',
        'Gastroenterologist',
        'Gynecologist',
        'General Psychiatrist',
        'Hematologist',
        'Hepatologist',
        'Infectious Disease Specialist',
        'Internal Medicine Specialist',
        'Internists',
        'Medical Geneticist',
        'Microbiologist',
        'Neonatologist',
        'Nephrologist',
        'Neurologist',
        'Neurosurgeon',
        'Obstetrician',
        'Oncologist',
        'Opthalmologist',
        'Orthopedic Surgeon',
        'Orthopedist',
        'Primatologist',
        'Pale Pathologist',
        'Parasitologist',
        'Pathologist',
        'Pediatrician',
        'Plastic Surgeon',
        'Podiatrist',
        'Psychiatrist',
        'Pulomonologist',
        'Radiologist',
        'Reproductive Endocrinologist',
        'Rheumatologist',
        'Surgeon',
        'Thoraxic Oncologist',
        'Urologist',
        'Veterinarian'
    ],
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

