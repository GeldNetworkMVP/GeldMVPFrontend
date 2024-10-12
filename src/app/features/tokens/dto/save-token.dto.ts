export interface SaveTokenDto {
  plotid: string;
  tokenname: string;
  description: string;
  price: string;
  filetype?: string;
  bcstatus: null | string;
  bchash: null;
}
