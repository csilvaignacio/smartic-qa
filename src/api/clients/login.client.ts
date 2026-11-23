import type { APIRequestContext } from "@playwright/test";
import { ENTORNO } from "@config/entorno";
import { RUTAS_API } from "@config/rutas";

export type CredencialesLogin = {
  username: string;
  password: string;
};

export type RespuestaLogin = {
  token: string;
  mfaRequired: boolean;
};

export type RespuestaApi<T> = {
  estado: number;
  cuerpo: T;
};

export class LoginClient {
  constructor(private readonly request: APIRequestContext) {}

  async iniciarSesion<T>(credenciales: CredencialesLogin): Promise<RespuestaApi<T>> {
    const respuesta = await this.request.post(`${ENTORNO.urlApi}${RUTAS_API.auth.login}`, {
      data: credenciales,
    });
    return {
      estado: respuesta.status(),
      cuerpo: (await respuesta.json()) as T,
    };
  }
}
