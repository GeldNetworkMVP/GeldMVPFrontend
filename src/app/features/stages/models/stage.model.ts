export interface Stage {
  _id: string;
  stagename: string;
  description: string;
  fields: { valuekey: string; valuetype: 'text' | Omit<string, 'text'> }[];
}
