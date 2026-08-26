import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import { ThreadsRepository } from './threads.repository';

@Module({
  controllers: [ThreadsController],
  providers: [ThreadsService, ThreadsRepository],
})
export class ThreadsModule { }
