export interface UsuarioLogin {
  email: string;
  password: string;
}

export interface Usuario {
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
  refresh_token: string;
}
