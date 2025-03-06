import type { User } from '@application/entities/user';

export class UserViewModel {
  static toGetFormatHttp(user: User) {
    return {
      id: user.id,
      name: user.name,
      telephone: user.telephone,
      typeUser: user.typeUser,
      email: user.email,
      password: user.password,
      manutences: user.manutences,
      createdAt: user.createdAt,
    };
  }
}
