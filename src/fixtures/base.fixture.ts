import {test as base} from '@playwright/test';
import { SideMenuComponent } from '@components/SideMenuComponent';

type BaseFixtures = {
    sideMenu: SideMenuComponent;
}

export const baseFixtures = base.extend<BaseFixtures>({
    sideMenu: async ({page}, use) => {
        await use(new SideMenuComponent(page));
    }
});