import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    findByUserName(username: string) {
        return this.prisma.user.findUnique({ where: { username } });
    }

    findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    create(data: { username: string; email: string; passwordHash: string }) {
        return this.prisma.user.create({
            data,
            select: { id: true, username: true, email: true, createdAt: true },
        });
    }

}