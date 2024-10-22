export interface RefreshToken {
    token: string;
    createdAt: string;
    expired: string;
  }
  
  export interface LoginResponseData {
    token: string;
    refreshToken: RefreshToken;
  }
  
  export interface LoginResponse {
    success: boolean;
    message: string;
    data: LoginResponseData;
  }
  