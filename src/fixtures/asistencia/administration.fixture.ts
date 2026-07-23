import { test as base } from "@playwright/test";
import { CollaboratorProfilePage } from "@pages/modules/asistencia/Administracion/CollaboratorProfilePage";

type AdministrationFixtures = {
  collaboratorProfile: CollaboratorProfilePage;
};

export const administrationFixtures = base.extend<AdministrationFixtures>({
  collaboratorProfile: async ({ page }, use) => {
    await use(new CollaboratorProfilePage(page));
  },
});
