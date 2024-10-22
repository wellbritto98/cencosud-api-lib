import axios from "axios";

let isRefreshing = false;
interface FailedRequest {
  onSuccess: (token: string) => void;
  onFailure: (err: any) => void;
}
let failedRequestsQueue: FailedRequest[] = [];

export const getAxios = (token: string | null) => {
  return axios.create({
    baseURL: "http://localhost:5137/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export function setupAPIClient() {
  let token = localStorage.getItem("jwt");
  console.log("token", token);
  const api = getAxios(token);

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        if (error?.response?.data?.error === "Unauthorized") {
          console.log("renova token");
          const refreshToken = localStorage.getItem("refreshToken");
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              // Faz a requisição para renovar o token usando o refreshToken
              const response = await api.post('/RefreshToken', { refreshToken });

              const newToken = response.data.token;

              // Atualiza o token no localStorage
              localStorage.setItem("jwt", newToken);

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
              onSuccess: (token: string) => {
                originalConfig.headers.Authorization = `Bearer ${token}`;
                resolve(api(originalConfig));
              },
              onFailure: (err: any) => {
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
