import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

const authorSelect = { select: { id: true, username: true } };

@Injectable()
export class CommentsRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(threadId: string, userId: string, dto: CreateCommentDto) {
        return this.prisma.comment.create(
            {
                data: { content: dto.content, threadId, userId },
                include: { user: authorSelect }
            }
        );
    }

    findByThreadId(threadId: string) {
        return this.prisma.comment.findMany(
            { where: { threadId }, orderBy: { createdAt: 'asc' }, include: { user: authorSelect } }
        );
    }

    findByUserId(userId: string) {
        return this.prisma.comment.findMany(
            { where: { userId }, orderBy: { createdAt: 'asc' }, include: { user: authorSelect } }
        )
    }

    findByRawId(id: string) {
        return this.prisma.comment.findUnique({
            where: { id }
        })
    }

    update(id: string, dto: UpdateCommentDto) {
        return this.prisma.comment.update({
            where: { id }, data: dto, include: { user: authorSelect }
        });
    }

    delete(id: string) {
        return this.prisma.comment.delete({ where: { id } });
    }
}