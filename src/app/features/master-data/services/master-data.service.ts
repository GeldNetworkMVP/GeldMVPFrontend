import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import { GetAllMasterDataContainersWithoutPaginationDto } from '../dto/get-all-master-data-containers-without-pagination.dto';
import { SaveMasterDataContainerDto } from '../dto/save-masterdata-container.dto';

@Injectable({ providedIn: 'root' })
export class MasterDataService extends BaseService {

    saveMasterDataContainer(dto: SaveMasterDataContainerDto) {
        return this.post('masterdata/save', dto);
    }


    getAllMasterDataContainersWithoutPagination() {
        return this.get<GetAllMasterDataContainersWithoutPaginationDto>('masterdata');
    }
}
