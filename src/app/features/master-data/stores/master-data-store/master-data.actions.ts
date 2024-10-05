import { MasterDataStateModel } from "./master-data-state.type";

const MASTER_DATA_ACTION_KEY = '[MasterData]';

export class SetMasterDataContainers {
  static readonly type = `${MASTER_DATA_ACTION_KEY} Set Master Data Containers`;

  constructor(public masterDataContainer: MasterDataStateModel['masterDataContainers']) {}
}

export class SetMasterDataContainersLoading {
  static readonly type = `${MASTER_DATA_ACTION_KEY} Set Master Data Containers Loading`;

  constructor(public loading: boolean) {}
}