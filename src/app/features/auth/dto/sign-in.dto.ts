export interface SignInDto {
  email: string;
  pw: string;
}

export interface Profile {
  company: string;
  contact: string;
  designation: string;
  email: string;
  userid: string;
}

export interface SignInResponseDto extends Profile {
  token: string;
}
