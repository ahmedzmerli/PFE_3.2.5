export interface RegistrationRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }

  export interface AuthenticationRequest {
    email: string;
    password: string;
  }

  export interface AuthenticationResponse {
    token: string;
    permissions: string[];
  }
