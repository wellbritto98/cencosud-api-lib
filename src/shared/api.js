import axios from "axios";
import { parseCookies } from "nookies";

let isRefreshing = false;
let failedRequestsQueue = [];
 
export const getAxios = (token) => {
  return axios.create({
    baseURL: "https://wikimundo.azurewebsites.net",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);
  const api = getAxios(cookies["jwt"]);

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        if (error?.response?.data?.error === "Unauthorized") {
          console.log("renova token");
          cookies = parseCookies(ctx);
          const { refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              // Faz a requisição para renovar o token usando o refreshToken
              await api.post('/RefreshToken', { refreshToken });

              // Agora que a API configurou os cookies, use-os para atualizar o token nos headers
              cookies = parseCookies(ctx);
              const newToken = cookies["jwt"];

              // Atualiza o header Authorization com o novo token
              originalConfig.headers.Authorization = `Bearer ${newToken}`;

              // Processa todas as requisições que falharam enquanto o token era renovado
              failedRequestsQueue.forEach(req => req.onSuccess(newToken));
              failedRequestsQueue = [];
            } catch (err) {
              // Processa as requisições que falharam durante a renovação do token
              failedRequestsQueue.forEach(req => req.onFailure(err));
              failedRequestsQueue = [];
              return Promise.reject(err);
            } finally {
              isRefreshing = false;
            }
          }

          // Adiciona a requisição original na fila
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token) => {
                originalConfig.headers.Authorization = `Bearer ${token}`;
                resolve(api(originalConfig));
              },
              onFailure: (err) => {
                reject(err);
              },
            });
          });
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export const api = setupAPIClient();
