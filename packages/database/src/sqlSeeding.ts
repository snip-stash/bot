import { Logger } from "log";
import { PrismaClient } from "../prisma/gen/client/default.js";

const logger = new Logger();

export async function seedPrisma() {
    logger.infoSingle("Seeding Database", "Prisma");
    const prisma = new PrismaClient();
    try {
        await prisma.user.createMany({
            data: [
                {
                    id: 123456789012345678n,
                    username: "Sammy",
                    premium: true,
                    posts: 15,
                    runs: 5,
                },
                {
                    id: 987654321098765432n,
                    username: "Tommy",
                    premium: false,
                    posts: 10,
                    runs: 2,
                },
                {
                    id: 192837465564738291n,
                    username: "Madi",
                    premium: true,
                    posts: 20,
                    runs: 3,
                },
            ],
            skipDuplicates: true,
        });

        await prisma.snippet.createMany({
            data: [
                {
                    code: 'console.log("Hello World in JavaScript!");',
                    lang: "js",
                    execution: "Hello World in JavaScript!",
                    date: new Date(),
                    user_id: 123456789012345678n,
                },
                {
                    code: 'printf("Hello World in Python!")',
                    lang: "py",
                    execution: "Hello World in Python!",
                    date: new Date(),
                    user_id: 987654321098765432n,
                },
                {
                    code: 'System.out.println("Hello World!);',
                    lang: "java",
                    execution: "Error: Missing closing quote",
                    date: new Date(),
                    user_id: 192837465564738291n,
                },
            ],
            skipDuplicates: true,
        });

        await prisma.comments.createMany({
            data: [
                {
                    content: "It appears you used a backtick instead of a quote.",
                    likes: 10,
                    dislikes: 0,
                    date: new Date(),
                },
                {
                    content: "You need to import the print function from the future.",
                    likes: 2,
                    dislikes: 5,
                    date: new Date(),
                },
                {
                    content: "You missed a closing quote in the string.",
                    likes: 5,
                    dislikes: 1,
                    date: new Date(),
                },
            ],
            skipDuplicates: true,
        });

        await prisma.paste.createMany({
            data: [
                {
                    content: 'console.log("Hello World in JavaScript!`);',
                    lang: "js",
                    uploader_id: 123456789012345678n,
                },
                {
                    content: "Error: Missing closing quote",
                    lang: "js",
                    uploader_id: 123456789012345678n,
                },
                {
                    content:
                        "from typing import Dict\n\ndef grabUser() -> Dict[str, str]:\n\tname = input('Enter Name: ')\n\tage = input('Enter Age: ')\n\tuser_dict = {'name': name, 'age': age}\n\tprint(f'Details: Name: {name} Age: {age}')\n\tprint('Your details have been stored')\n\n\treturn user_dict\n\ngrabUser()",
                    lang: "py",
                    uploader_id: 987654321098765432n,
                },
                {
                    content: 'System.println("Hello World!");',
                    lang: "java",
                    uploader_id: 192837465564738291n,
                },
                {
                    content: "Error: System.println does not exist",
                    lang: "java",
                    uploader_id: 192837465564738291n,
                },
            ],
            skipDuplicates: true,
        });

        await prisma.post.createMany({
            data: [
                {
                    title: "Need help with Javascript !!",
                    description: "Hello guys, I have a problem with the code I'm trying to run. Can someone help me?",
                    date: new Date(),
                    likes: 10,
                    dislike: 0,
                    keywords: ["javascript", "nodejs", "express", "error", "help"],
                    code: 1,
                    error: 2,
                    comments: 1,
                },
                {
                    title: "Python script !",
                    description: "Hey, I just wrote this new Python script. Can someone review it for me?",
                    date: new Date(),
                    likes: 5,
                    dislike: 2,
                    keywords: ["python", "script", "library", "beginner", "pypi"],
                    code: 3,
                    comments: 2,
                },
                {
                    title: "Java error",
                    description: "I'm getting a syntax error in my Java code. Can someone point out the mistake?",
                    date: new Date(),
                    likes: 8,
                    dislike: 1,
                    keywords: ["java", "error", "syntax", "beginner", "help"],
                    code: 4,
                    error: 5,
                    comments: 3,
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
