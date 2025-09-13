export interface SaveTokenDto {
  plotid: string;
  tokenname: string;
  description: string;
  price: string;
  filetype?: string;
  tokenissuer: null | string;
  bchash: null;
}
