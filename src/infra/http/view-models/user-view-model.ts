import type { User } from '@application/entities/user';

export class UserViewModel {
  static toGetFormatHttp(user: User) {
    return {
      id: user.id,
      name: user.name.value,
      telephone: user.telephone?.value,
      typeUser: user.typeUser,
      email: user.email.value,
      cpf: user.cpf.value,
      address: user.address,
      createdAt: user.createdAt,
      stats: user.getStats(),
    };
  }
}
