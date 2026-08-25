import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';


const connectionString = process.env['DATABASE_URL']
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...')


    const passwordHash = await bcrypt.hash('password123', 10);

    const john = await prisma.user.upsert(
        {
            where: { email: 'johndoe@example.com' },
            update: {},
            create: { username: 'johndoe', email: 'johndoe@example.com', passwordHash }
        }
    );

    const jane = await prisma.user.upsert(
        {
            where: { email: 'jane@example.com' },
            update: {},
            create: { username: 'jane', email: 'jane@example.com', passwordHash }
        }
    );

    await prisma.thread.createMany({
        data: [
            { userId: john.id, title: 'How do I set up environment variables in Node.js?', content: 'I am new to backend development...' },
            { userId: jane.id, title: 'When should I use PostgreSQL vs MongoDB?', content: 'For a medium-scale e-commerce project...' },
            { userId: john.id, title: 'Getting a CORS error when hitting the API from React', content: "I keep getting an 'Access-Control-Allow-Origin' error..." },
        ],
    });

    console.log('Seed Comnpleted');

}

main().finally(() => prisma.$disconnect());

