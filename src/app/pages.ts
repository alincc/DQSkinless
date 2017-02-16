import { TabsPage } from '../pages/tabs/tabs';
import { SchedulePage } from '../pages/schedule/schedule.page';
import { PatientPage } from '../pages/patient/patient.page';
import { ChatPage } from '../pages/chat/chat.page';
import { ManagerPage } from '../pages/manager/manager.page';
import { LoginPage } from '../pages/login/login.page';
import { NotificationPage } from '../pages/notification/notification.page';
import { ProfilePage } from '../pages/profile/profile.page';
import { ChangePasswordPage } from '../pages/change-password/change-password.page';
import { BlankPage } from '../pages/blank/blank.page';
import { RegistrationPage } from '../pages/registration/registration.page';

import { ChangePasswordForm } from '../pages/change-password/form/change-password.form';
import { ProfileForm } from '../pages/profile/form/profile.form';
import { UploadPhotoForm } from '../pages/profile/upload-photo/upload-photo.form';
import { AssistantManagerForm } from '../pages/assistant-manager/assistant-manager.form';
export const pages: any[] = [
	TabsPage
	,SchedulePage
	,PatientPage
	,ChatPage
	,ManagerPage
	,LoginPage
	,NotificationPage
	,ProfilePage
	,ChangePasswordPage
	,BlankPage
	,RegistrationPage

	,ChangePasswordForm
	,ProfileForm
	,UploadPhotoForm
	,AssistantManagerForm
]