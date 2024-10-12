import { MasterDataRecord } from '../models/master-data-record.model';

export interface GetAllRecordsPaginatedByContainerIdDto {
  Status: number;
  Response: {
    content: MasterDataRecord[];
    PaginationInfo: {
      totalelements: number;
      totalPages: number;
      pagesize: number;
      previouspage: number;
      currentpg: number;
      nextpage: number;
    };
  };
}

export interface GetAllRecordsPaginatedByContainerQueryParams {
  limit: number;
  page: number;
  sort: number;
  fields: string[];
  dataid: string;
}
