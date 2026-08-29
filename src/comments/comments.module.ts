import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { ThreadsModule } from 'src/threads/threads.module';

@Module({
  imports: [ThreadsModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
})
export class CommentsModule { }
