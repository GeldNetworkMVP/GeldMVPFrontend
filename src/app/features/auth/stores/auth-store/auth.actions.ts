import { Profile } from '../../dto/sign-in.dto';

const AUTH_KEY = '[Auth]';

export class SetProfile {
  static readonly type = `${AUTH_KEY} Set Master Data Containers`;

  constructor(public profile: Profile | null) {}
}
