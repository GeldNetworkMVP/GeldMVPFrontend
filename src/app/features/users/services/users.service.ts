import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import { GetAllUsersResponseDto } from '../dto/get-all-users-response.dto';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseService {
  //   getAllTokensByStatus({
  //     limit,
  //     page,
  //     sort,
  //     status,
  //   }: GetAllTokensByStatusQueryParams) {
  //     const params = {
  //       limit,
  //       page,
  //       sort,
  //     };
  //     return this.get<GetAllTokensByStatusDto>(`tokens/${status}`, {
  //       params: params,
  //     });
  //   }

  getAllUsers() {
    return this.get<GetAllUsersResponseDto>('users');
  }

  acceptUser(userId: string) {
    return this.put(`updateuserstatus`, {
      _id: userId,
      status: 'accepted',
    });
  }
}
