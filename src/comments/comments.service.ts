import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsRepository } from './comments.repository';
import { ThreadsRepository } from 'src/threads/threads.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository,
    private readonly threadsRepository: ThreadsRepository,
  ) { }

  async create(threadId: string, userId: string, dto: CreateCommentDto) {
    await this.ensureThreadNotEmpty(threadId)
    return this.commentsRepository.create(threadId, userId, dto);
  }

  async findByThread(threadId: string) {
    await this.ensureThreadNotEmpty(threadId)
    return this.commentsRepository.findByThreadId(threadId);
  }

  async findOne(id: string) {
    const comment = await this.commentsRepository.findByRawId(id);
    if (!comment) throw new NotFoundException(`Comment with id "${id} not found"`);
    return comment;
  }

  async update(id: string, userId: string, dto: UpdateCommentDto) {
    await this.ensureOwnership(id, userId);
    return this.commentsRepository.update(id, dto);
  }

  async remove(id: string, userId: string) {
    await this.ensureOwnership(id, userId);
    await this.commentsRepository.delete(id);
    return {
      message: 'Comment deleted successfully'
    };
  }


  private async ensureOwnership(id: string, userId: string) {
    const comment = await this.commentsRepository.findByRawId(id);
    if (!comment) throw new NotFoundException(`Comment with id "${id} not found"`);
    if (comment.userId !== userId) {
      throw new ForbiddenException('You are not allowed to modify a comment you did not create');
    }
  }

  private async ensureThreadNotEmpty(threadId: string) {
    const thread = this.threadsRepository.findRawById(threadId);
    if (!thread) throw new NotFoundException(`Thread with id "${threadId} not found"`);
  }
}