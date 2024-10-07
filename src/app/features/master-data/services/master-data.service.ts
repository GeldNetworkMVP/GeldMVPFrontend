import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import { GetAllMasterDataContainersWithoutPaginationDto } from '../dto/get-all-master-data-containers-without-pagination.dto';
import { GetAllRecordsPaginatedByContainerIdDto, GetAllRecordsPaginatedByContainerQueryParams } from '../dto/get-all-records-paginated-by-container-id.dto';
import { GetMasterDataContainerByIdDto } from '../dto/get-master-data-container-by-id.dto';
import { SaveMasterDataContainerDto } from '../dto/save-masterdata-container.dto';
import { SaveMasterdataRecordDto } from '../dto/save-masterdata-record.dto';

@Injectable({ providedIn: 'root' })
export class MasterDataService extends BaseService {
  saveMasterDataContainer(dto: SaveMasterDataContainerDto) {
    return this.post('masterdata/save', dto);
  }

  getAllMasterDataContainersWithoutPagination() {
    return this.get<GetAllMasterDataContainersWithoutPaginationDto>(
      'masterdata'
    );
  }

  getMasterDataContainer(containerId: string) {
    return this.get<GetMasterDataContainerByIdDto>(
      `masterdata/${containerId}`
    );
  }

  getAllRecordsPaginatedByContainerId({
    sort,
    limit,
    page,
    fields,
    dataid,
  }: GetAllRecordsPaginatedByContainerQueryParams) {
    const params = {
      sort,
      limit,
      page,
      fields: fields.map((field) => field.trim()).join(','),
    };
    return this.get<GetAllRecordsPaginatedByContainerIdDto>(`masterrecord/${dataid}`, {
      params,
    });
  }


  saveMasterRecord(dto: SaveMasterdataRecordDto) {
    return this.post('record/save', dto);
  }
}
