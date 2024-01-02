import { User } from '@domain/models/User';
import { UserInfoResponseDto } from '../../dtos/response/UserInfoResponseDto';

export class UserInfoResponseMapper {
  static toResponseDto(model: User): UserInfoResponseDto {
    return {
      email: model.getEmail().getValue(),
      firstName: model.getFirtname(),
      lastName: model.getLastname(),
      dateBirth: model.getDateBirth(),
      objective: model.getObjective(),
    };
  }
}
