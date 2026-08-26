import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadsRepository } from './threads.repository';

@Injectable()
export class ThreadsService {
  constructor(private readonly threadsRepository: ThreadsRepository) { }

  create(userId: string, dto: CreateThreadDto) {
    return this.threadsRepository.create(userId, dto);
  }

  findAll() {
    return this.threadsRepository.findAll();
  }

  findMine(userId: string) {
    return this.threadsRepository.findByUserId(userId);
  }

  async findOne(id: string) {
    const thread = await this.threadsRepository.findById(id);
    if (!thread) throw new NotFoundException(`Thread with id "${id}" not found`);
    return thread;
  }

  async update(id: string, userId: string, dto: UpdateThreadDto) {
    await this.ensureOwnership(id, userId);
    return this.threadsRepository.update(id, dto);
  }

  async remove(id: string, userId: string) {
    await this.ensureOwnership(id, userId);
    await this.threadsRepository.delete(id);
    return { message: "Thread deleted successfully" }
  }


  private async ensureOwnership(id: string, userId: string) {
    const thread = await this.threadsRepository.findRawById(id);
    if (!thread) throw new NotFoundException(`Thread with id "${id}" not found`);
    if (thread.userId !== userId) {
      throw new ForbiddenException("You are not allowed to modify a thread you did not create");
    }
  }
}
