export interface SaveMasterDataContainerDto {
  dataname: string;
  description: string;
  mfields: string[];
}

export type UpdateMasterDataContainerDto = Partial<SaveMasterDataContainerDto> & {_id: string}
