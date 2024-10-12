import { MasterDataContainer } from './../../models/master-data-container.model';
export interface MasterDataStateModel {
  masterDataContainers: MasterDataContainer[];
  masterDataContainersLoading: boolean;
}
