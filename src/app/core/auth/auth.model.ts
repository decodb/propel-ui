export interface SignInDto {
  email: string,
  password: string
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateCompanyDto {
  name: string;
  industry: string;
  website?: string;
  phone: string;
}

export interface CreateRegistrationDto {
  user: CreateUserDto;
  company: CreateCompanyDto;
  file: File;
}

export interface AuthRegisterResponse {
  email: string,
  err?: string
}

export interface AuthForgotPasswordResponse {
  email: string,
  err?: string
}

export interface AuthPasswordResetResponse {
  message: string,
  err?: string
}