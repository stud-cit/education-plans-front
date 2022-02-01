import { ROLES } from '@/utils/constants';

export default {
    getItems(user) {

        // item
        const ListPlans = {
            title: 'Плани',
            icon: 'mdi-account-circle',
            route: 'ListPlans',
        };
        const About = {
            title: 'О Нас',
            icon: 'mdi-account-plus',
            route: 'About',
        };
        // const CreateDirector = {
        //     title: 'CreateDirector',
        //     icon: 'mdi-account-plus',
        //     route: 'CreateDirector',
        // };
        // const ListDirectors = {
        //     title: 'ListDirectors',
        //     icon: 'mdi-clipboard-list',
        //     route: 'ListDirectors',
        // };
        // const SettingMyProfile = {
        //     title: 'MyProfile',
        //     icon: 'mdi-account-settings',
        //     route: 'SettingMyProfile',
        // };
        //
        // // items
        // const CreateDirectorAndOptions = {
        //     title: 'Directors',
        //     icon: 'mdi-account-multiple',
        //     submenu: [
        //         ListDirectors,
        //         CreateDirector,
        //     ],
        // };
        //
        // const SettingRoot = {
        //     title: 'Settings',
        //     icon: 'mdi-cog',
        //     submenu: [
        //         SettingMyProfile
        //     ],
        // };

        let rows = [];
        if (user) {
            // rows.push(MyProfile);

            switch (user.role_id) {

                case ROLES.ID.admin:
                    rows.push(
                        ListPlans,
                        About
                    );
                    break;
            }
        }
        return rows;
    }
}