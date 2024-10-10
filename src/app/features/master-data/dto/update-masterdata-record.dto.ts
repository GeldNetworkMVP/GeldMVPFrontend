export interface UpdateMasterdataRecordDto {
  _id: string;
  dataobject: {
    dataid: string;
    [key: string]: unknown;
  };
}
