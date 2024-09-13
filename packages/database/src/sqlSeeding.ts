import { env } from "core";
import { Logger } from "log";
import { PrismaClient } from "../prisma/gen/client/default.js";

const logger = new Logger();

export function nanoid(num: number): string {
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let nanoid = "";
    for (let i = 0; i < num; i++) {
        nanoid += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return nanoid;
}

export async function seedPrisma() {
    if (!env.DATABASE_SEEDING) return;

    logger.infoSingle("Seeding Database", "Prisma");
    const prisma = new PrismaClient();
    try {
        await prisma.user.createMany({
            data: [
                {
                    id: 560821786011369472n,
                    username: "Sammy",
                    avatar: Buffer.from(
                        "https://cdn.discordapp.com/avatars/560821786011369472/d002a9612dcd76f2d8c4672d133ac938.png?size=1024",
                    ),
                    premium: true,
                    amount_of_posts: 15,
                    code_runs: 5,
                },
                {
                    username: "Tommy",
                    avatar: Buffer.from(
                        "https://cdn.discordapp.com/avatars/237438743287483258/efaded10086292900e73d6dac5ba3521.png?size=1024",
                    ),
                    premium: false,
                    amount_of_posts: 10,
                    code_runs: 2,
                },
                {
                    id: 237438743287483258n,
                    username: "Madi",
                    premium: true,
                    amount_of_posts: 20,
                    code_runs: 3,
                },
            ],
            skipDuplicates: true,
        });

        await prisma.snippet.createMany({
            data: [
                {
                    code: 'console.log("Hello World in JavaScript!");',
                    language: "js",
                    result: "Hello World in JavaScript!",
                    uploader_id: 560821786011369472n,
                },
                {
                    code: 'printf("Hello World in Python!")',
                    language: "py",
                    result: "NameError: name 'printf' is not defined",
                    uploader_id: 1n,
                },
                {
                    code: 'System.out.println("Hello World!);',
                    language: "java",
                    result: "error: unclosed string literal",
                    uploader_id: 237438743287483258n,
                },
            ],
            skipDuplicates: true,
        });

        await prisma.post.createMany({
            data: [
                {
                    uploader_id: 560821786011369472n,
                    title: "Need help with Javascript !!",
                    description: "Hello guys, I have a problem with the code I'm trying to run. Can someone help me?",
                    likes: 10,
                    dislikes: 0,
                    keywords: ["javascript", "nodejs", "express", "error", "help"],
                    paste_id: nanoid(8),
                },
                {
                    uploader_id: 1n,
                    title: "Python script !",
                    description: "Hey, I just wrote this new Python script. Can someone review it for me?",
                    likes: 5,
                    dislikes: 2,
                    paste_id: nanoid(8),
                },
                {
                    uploader_id: 237438743287483258n,
                    title: "Java error",
                    description: "I'm getting a syntax error in my Java code. Can someone point out the mistake?",
                    likes: 8,
                    dislikes: 1,
                    keywords: ["java", "error", "syntax", "beginner", "help"],
                    paste_id: nanoid(8),
                },
            ],
            skipDuplicates: true,
        });

        await prisma.paste.createMany({
            data: [
                {
                    id: "1",
                    content: 'console.log("Hello World in JavaScript!`);',
                    language: "js",
                    uploader_id: 560821786011369472n,
                },
                {
                    id: "2",
                    content:
                        "from typing import Dict\n\ndef grabUser() -> Dict[str, str]:\n\tname = input('Enter Name: ')\n\tage = input('Enter Age: ')\n\tuser_dict = {'name': name, 'age': age}\n\tprint(f'Details: Name: {name} Age: {age}')\n\tprint('Your details have been stored')\n\n\treturn user_dict\n\ngrabUser()",
                    language: "py",
                    uploader_id: 1n,
                },
                {
                    id: "3",
                    content: 'System.println("Hello World!");',
                    language: "java",
                    uploader_id: 237438743287483258n,
                },
            ],
            skipDuplicates: true,
        });

        await prisma.comments.createMany({
            data: [
                {
                    uploader_id: 560821786011369472n,
                    content: "It appears you used a backtick instead of a quote.",
                    likes: 10,
                    dislikes: 0,
                },
                {
                    uploader_id: 1n,
                    content: "You need to import the print function from the future.",
                    likes: 2,
                    dislikes: 5,
                },
                {
                    uploader_id: 237438743287483258n,
                    content: "You missed a closing quote in the string.",
                    likes: 5,
                    dislikes: 1,
                },
            ],
            skipDuplicates: true,
        });

        logger.infoSingle("Seeding complete", "Prisma");
    } catch (err: any) {
        logger.error(`Error seeding database: ${err.message}`, "Prisma");
    } finally {
        await prisma.$disconnect();
    }
}
