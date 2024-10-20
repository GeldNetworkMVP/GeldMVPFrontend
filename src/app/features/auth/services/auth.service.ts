import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import { RegisterDto } from '../dto/register.dto';
import { SignInDto, SignInResponseDto } from '../dto/sign-in.dto';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  login(dto: SignInDto) {
    return this.post<SignInResponseDto>('usersignin', dto);
  }

  register(dto: RegisterDto) {
    return this.post(`appuser/save`, dto);
  }
}
