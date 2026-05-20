import { Role } from 'src/common/enum/roles.enum';

export type SocketUserPayload = {
  id: number;
  role: Role;
};

export type SocketJwtPayload = SocketUserPayload & {
  sub?: number;
  email: string;
};
