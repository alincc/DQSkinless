import { Accordion } from '../components/accordion/accordion.component';
import { AccountCreationModal } from '../components/account-creation-modal/account-creation-modal.component';
import { AccessRoleModal } from '../components/access-role-modal/access-role-modal.component';
import { AddQueueFormModal } from '../components/add-queue-form-modal/add-queue-form.modal.component';
import { AllergyModal } from '../components/allergy-modal/allergy-modal.component';
import { ChangePasswordForm } from '../components/change-password-form/change-password-form.component';
import { ConditionModal } from '../components/condition-modal/condition-modal.component';
import { ContactModal } from '../components/contact-modal/contact-modal.component';
import { ContentWithLoading } from '../components/content-with-loading/content-with-loading.component';
import { ConsultationSegment } from '../components/consultation-segment/consultation-segment.component';
import { DrawingPad } from '../components/drawing-pad/drawing-pad.component';
import { ForgotPasswordModal } from '../components/forgot-password-modal/forgot-password-modal.component';
import { MedicationModal } from '../components/medication-modal/medication-modal.component';
import { PatientForm } from '../components/patient-form/patient-form.component';
import { PatientList } from '../components/patient-list/patient-list.component';
import { ProfileForm } from '../components/profile-form/profile-form.component';
import { ScheduleModal } from '../components/schedule-modal/schedule-modal.component';
import { SearchUserModal } from '../components/search-user-modal/search-user-modal.component';
import { ReminderWidgetComponent } from '../components/reminder-widget/reminder-widget.component';
import { UploadPhoto } from '../components/upload-photo/upload-photo.component';
import { XHRButton } from '../components/xhr-button/xhr-button.component';
import { QueueWidgetComponent } from '../components/queue-widget/queue-widget.component';

import { PatientAllergy } from '../components/patient-allergy/patient-allergy.component';
import { PatientCondition } from '../components/patient-condition/patient-condition.component';
import { PatientMedication } from '../components/patient-medication/patient-medication.component';

export const components = [
    Accordion,
    AccountCreationModal,
    AccessRoleModal,
    AddQueueFormModal,
    AllergyModal,
    ChangePasswordForm,
    ConditionModal,
    ContactModal,
    ContentWithLoading,
    DrawingPad,
    ForgotPasswordModal,
    MedicationModal,
    PatientCondition,
    PatientMedication,
    PatientForm,
    PatientList,
    ProfileForm,
    ReminderWidgetComponent,
    QueueWidgetComponent,
    SearchUserModal,
    ScheduleModal,
    UploadPhoto,
    XHRButton,
    ConsultationSegment,
    PatientAllergy
];