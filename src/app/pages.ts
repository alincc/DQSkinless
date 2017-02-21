import { MoreMenuPopover } from '../pages/schedule/more.popover';
import { PatientProfilePage } from '../pages/patient-profile/patient-profile.page';
import { BlankPage } from '../pages/blank/blank.page';
import { ChatPage } from '../pages/chat/chat.page';
import { LoginPage } from '../pages/login/login.page';
import { ManagerPage } from '../pages/manager/manager.page';
import { NotificationPage } from '../pages/notification/notification.page';
import { PatientPage } from '../pages/patient/patient.page';
import { ProfilePage } from '../pages/profile/profile.page';
import { RegistrationPage } from '../pages/registration/registration.page';
import { SchedulePage } from '../pages/schedule/schedule.page';
import { StepOnePage } from '../pages/registration/step-one/step-one.page';
import { StepTwoPage } from '../pages/registration/step-two/step-two.page';
import { TabsPage } from '../pages/tabs/tabs';


import { ChangePasswordPage } from '../pages/change-password/change-password.page';
import { UploadPhotoForm } from '../pages/profile/upload-photo/upload-photo.form';
import { AssistantManagerForm } from '../pages/assistant-manager/assistant-manager.form';

export const pages: any[] = [
	BlankPage,
	ChatPage,
	LoginPage,
	ManagerPage,
	NotificationPage,
	PatientPage,
	PatientProfilePage,
	ProfilePage,
	RegistrationPage,
	SchedulePage,
	MoreMenuPopover,
	StepOnePage,
	StepTwoPage,
	TabsPage,

	ChangePasswordPage,
	
	UploadPhotoForm,
	AssistantManagerForm
]