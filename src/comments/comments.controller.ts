import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as getUserDecorator from 'src/common/decorators/get-user.decorator';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post('threads/:threadId/comments')
  @UseGuards(JwtAuthGuard)
  create(@Param('threadId') threadId: string, @getUserDecorator.GetUser() user: getUserDecorator.AuthUser, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(threadId, user.id, dto);
  }

  @Get('threads/:threadId/comments')
  findAll(@Param('threadId') threadId: string) {
    return this.commentsService.findByThread(threadId);
  }

  @Get('comments/:id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Put('comments/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @getUserDecorator.GetUser() user: getUserDecorator.AuthUser, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, user.id, dto);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @getUserDecorator.GetUser() user: getUserDecorator.AuthUser) {
    return this.commentsService.remove(id, user.id);
  }
}
