import { ActionHistory } from '@application/enums/action.enum';
import type { ManutenceHistoryObjectInterface } from '@application/interfaces/manutence-history-object';
import { randomUUID } from 'crypto';

export class PrismaHistoryManutenceMapper {
  static toPrisma(
    action: ActionHistory,
    data: Date,
    userId: string,
    manutenceId: string,
    manutencao: ManutenceHistoryObjectInterface,
  ) {
    return {
      id: randomUUID(),
      action: action,
      data: data,
      manutenceId: manutenceId,
      usuarioId: userId,
      manutencao: JSON.parse(JSON.stringify(manutencao)),
    };
  }

  // static toDomain(rawHistory: RawHistoricoManutencao): HistoryManutence {
  //   return new HistoryManutence(
  //     {
  //       data: rawHistory.data,
  //       action: rawHistory.action as ActionHistory,
  //       usuarioId: rawHistory.usuarioId,
  //       usuario: new User(
  //         {
  //           email: new Email(rawHistory.usuario.email),
  //           name: new Name(rawHistory.usuario.name),
  //           telephone: new Telefone(rawHistory.usuario.telephone),
  //           createdAt: rawHistory.usuario.createdAt,
  //           typeUser: rawHistory.usuario.typeUser as Role,
  //           manutences: [],
  //           password: new Password(rawHistory.usuario.password),
  //         },
  //         rawHistory.usuario.id,
  //       ),
  //       manutencao: new Manutence(
  //         {
  //           message: new Message(rawHistory.manutencao.message),
  //           photos: Array.isArray(rawHistory.manutencao.photos)
  //             ? history.manutencao.photos.map((photo: any) => ({
  //                 fileName: photo.fileName,
  //                 signedUrl: photo.signedUrl,
  //               }))
  //             : [],
  //           video: history.manutencao.video,
  //           title: history.manutencao.title,
  //           address: history.manutencao.address,
  //           status_manutence: history.manutencao
  //             .status_manutence as StatusManutence,
  //           createdAt: history.manutencao.createdAt,
  //           userId: history.manutencao.userId,
  //           adminId: history.manutencao.adminId || undefined,
  //           chatRoomId: history.manutencao.chatRoomId || undefined,
  //         },
  //         history.manutencao.id,
  //       ),
  //       typeUser: history.usuario.typeUser as Role,
  //       occurredAt: history.data,
  //     },
  //     history.id,
  //   );
  // }
}
