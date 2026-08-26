import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async findPublicProfile(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return user;
  }
}
