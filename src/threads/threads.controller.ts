import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as getUserDecorator from 'src/common/decorators/get-user.decorator';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@getUserDecorator.GetUser() user: getUserDecorator.AuthUser, @Body() dto: CreateThreadDto) {
    return this.threadsService.create(user.id, dto);
  }

  @Get()
  findAll() {
    return this.threadsService.findAll();
  }

  @Get('my-threads')
  @UseGuards(JwtAuthGuard)
  findMine(@getUserDecorator.GetUser() user: getUserDecorator.AuthUser) {
    return this.threadsService.findMine(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.threadsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @getUserDecorator.GetUser() user: getUserDecorator.AuthUser, @Body() dto: UpdateThreadDto) {
    return this.threadsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @getUserDecorator.GetUser() user: getUserDecorator.AuthUser) {
    return this.threadsService.remove(id, user.id);
  }
}
