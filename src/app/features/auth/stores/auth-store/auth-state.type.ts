import { Profile } from '../../dto/sign-in.dto';

export interface AuthStateModel {
  profile: Profile | null;
}
