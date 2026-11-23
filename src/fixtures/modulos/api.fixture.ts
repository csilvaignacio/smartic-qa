import type { APIRequestContext } from "@playwright/test";
import { test as base } from "@fixtures/base.fixture";
import { LoginClient, type RespuestaLogin } from "@api/clients/login.client";
import { ENTORNO } from "@config/entorno";

export type ApiFixtures = {
  loginClient: LoginClient;
  /** Contexto HTTP que ya envía el token en `Authorization`. */
  apiAutenticada: APIRequestContext;
};

export type ApiFixturesWorker = {
  /** Token del usuario QA; un solo login por worker, no por test. */
  tokenApi: string;
};

export const test = base.extend<ApiFixtures, ApiFixturesWorker>({
  tokenApi: [
    async ({ playwright }, use) => {
      const contexto = await playwright.request.newContext();
      const { estado, cuerpo } = await new LoginClient(contexto).iniciarSesion<RespuestaLogin>({
        username: ENTORNO.admin.usuario,
        password: ENTORNO.admin.clave,
      });
      await contexto.dispose();
      if (estado !== 200 || cuerpo.mfaRequired) {
        throw new Error(
          `No se pudo obtener el token por API: estado ${estado}, mfaRequired ${cuerpo.mfaRequired}.`,
        );
      }
      await use(cuerpo.token);
    },
    { scope: "worker" },
  ],
  loginClient: async ({ request }, use) => {
    await use(new LoginClient(request));
  },
  // El backend espera el token tal cual, sin el prefijo "Bearer" (con él responde 401).
  apiAutenticada: async ({ playwright, tokenApi }, use) => {
    const contexto = await playwright.request.newContext({ extraHTTPHeaders: { Authorization: tokenApi } });
    await use(contexto);
    await contexto.dispose();
  },
});
