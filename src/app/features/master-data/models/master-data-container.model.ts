export interface MasterDataContainer {
  _id: string;
  dataname: string;
  description: string;
  mfields: string[] | null;
  noOfRecords: number
}
