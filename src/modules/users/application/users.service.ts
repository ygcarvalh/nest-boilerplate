import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../infrastructure/persistence/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userModel.findByPk(id);
  }

  async updateRefreshTokenHash(userId: number, refreshTokenHash: string | null) {
    await this.userModel.update({ refreshTokenHash }, { where: { id: userId } });
  }

  async updatePassword(userId: number, passwordHash: string) {
    await this.userModel.update({ passwordHash }, { where: { id: userId } });
  }

  async updateLastLogin(userId: number, lastLogin: Date) {
    await this.userModel.update({ lastLogin }, { where: { id: userId } });
  }
}
