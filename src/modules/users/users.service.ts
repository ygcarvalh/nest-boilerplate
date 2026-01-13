import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from '../roles/role.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Role) private readonly roleModel: typeof Role,
  ) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userModel.findByPk(id);
  }

  async updateRefreshTokenHash(
    userId: number,
    refreshTokenHash: string | null,
  ) {
    await this.userModel.update(
      { refreshTokenHash },
      { where: { id: userId } },
    );
  }

  async updatePassword(userId: number, passwordHash: string) {
    await this.userModel.update({ passwordHash }, { where: { id: userId } });
  }

  async updateLastLogin(userId: number, lastLogin: Date) {
    await this.userModel.update({ lastLogin }, { where: { id: userId } });
  }

  async updateRole(userId: number, roleName: string) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      return null;
    }
    const role = await this.roleModel.findOne({ where: { name: roleName } });
    if (!role) {
      return null;
    }
    await this.userModel.update({ role: role.name }, { where: { id: userId } });
    return role.name;
  }
}
