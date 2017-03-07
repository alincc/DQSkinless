import { RegistrationForm, Profile } from '../../../shared/model/registration.model';

export class MOCK_ASSISTANTS {

    get mockAssistants(): RegistrationForm[] {
        let mock = [];

        let assistant1 = new RegistrationForm();
        let assistant2 = new RegistrationForm();
        let assistant3 = new RegistrationForm();

        let profile = new Profile();
        let profile2 = new Profile();
        let profile3 = new Profile();

        profile.lastName = 'Reyes';
        profile.firstName = 'Wildog';
        profile.middleName = 'Way'
        profile.email = 'test@email.com';
        profile.contactNo = '12345';
        profile.gender = '0';

        assistant1.profile = profile;

        profile2.lastName = 'Macatangay';
        profile2.firstName = 'Wilbert';
        profile2.middleName = 'Reyes'
        profile2.email = 'test@email.com';
        profile2.contactNo = '12345';
        profile2.gender = '0';

        assistant2.profile = profile2;

        profile3.lastName = 'Wakwacky';
        profile3.firstName = 'Blue';
        profile3.middleName = 'wak'
        profile3.email = 'test@email.com';
        profile3.contactNo = '12345';
        profile3.gender = '0';

        assistant3.profile = profile3;

        mock.push(assistant1);
        mock.push(assistant2);
        mock.push(assistant3);

        return mock;
    }

}