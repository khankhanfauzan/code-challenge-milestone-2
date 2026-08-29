import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateThreadDto } from "./dto/create-thread.dto";
import { UpdateThreadDto } from "./dto/update-thread.dto";

const authorSelect = { select: { id: true, username: true } }

@Injectable()
export class ThreadsRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(userId: string, dto: CreateThreadDto) {
        return this.prisma.thread.create({
            data: {
                title: dto.title,
                content: dto.content, userId
            },
            include: { user: authorSelect }
        });
    }

    findAll() {
        return this.prisma.thread.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: authorSelect,
                _count: {
                    select: { comments: true }
                }
            }
        });
    }

    findByUserId(userId: string) {
        return this.prisma.thread.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: authorSelect,
                _count: {
                    select: { comments: true }
                }
            }
        });
    }

    findById(id: string) {
        return this.prisma.thread.findUnique({
            where: { id },
            include: {
                user: authorSelect,
                comments: {
                    orderBy: { createdAt: 'asc' },
                    include: { user: authorSelect }
                }
            },
        });
    }

    findRawById(id: string) {
        return this.prisma.thread.findUnique({
            where: { id }, include: {
                user: authorSelect,
                comments: {
                    orderBy: { createdAt: 'asc' },
                    include: { user: authorSelect }
                }
            },
        });
    }

    update(id: string, dto: UpdateThreadDto) {
        return this.prisma.thread.update({
            where: { id },
            data: dto, include:
                { user: authorSelect }
        });
    }

    delete(id: string) {
        return this.prisma.thread.delete({
            where: { id }
        });
    }
}