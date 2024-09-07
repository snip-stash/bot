import { Logger } from "log";
import { PrismaClient } from "../prisma/gen/client/default.js";

const logger = new Logger();

export async function seedPrisma() {
    logger.infoSingle("Seeding Database", "Prisma");
    const prisma = new PrismaClient();

    try {
        await prisma.users.createMany({
            data: [
                {
                    discord_id: 123456789012345678n,
                    discord_name: "Sammy",
                    premium: true,
                    posts: 15,
                    runs_left: 5,
                },
                {
                    discord_id: 987654321098765432n,
                    discord_name: "Tommy",
                    premium: false,
                    posts: 10,
                    runs_left: 2,
                },
                {
                    discord_id: 192837465564738291n,
                    discord_name: "Madi",
                    premium: true,
                    posts: 20,
                    runs_left: 3,
                },
            ],
            skipDuplicates: true, // This prevents conflicts
        });

        await prisma.snippet.createMany({
            data: [
                {
                    snippet_id: 1,
                    discord_id: 123456789012345678n,
                    snippet_code: 'console.log("Hello World!");',
                    snippet_lang: "js",
                    snippet_outcome: "Success",
                },
                {
                    snippet_id: 2,
                    discord_id: 987654321098765432n,
                    snippet_code: 'print("Hello World!")',
                    snippet_lang: "py",
                    snippet_outcome: "Success",
                },
                {
                    snippet_id: 3,
                    discord_id: 192837465564738291n,
                    snippet_code: 'System.out.println("Hello World!");',
                    snippet_lang: "java",
                    snippet_outcome: "Success",
                },
            ],
            skipDuplicates: true,
        });

        await prisma.post.createMany({
            data: [
                {
                    post_id: 1,
                    discord_id: 123456789012345678n,
                    post_header: "JavaScript Test Post",
                    post_content:
                        "Hello guys, I have a problem with the code Im trying to run. Can someone help me?\nCode: console.log('Hello World!');",
                    post_date: new Date(),
                    post_lang: "js",
                    post_keywords: "test post",
                    post_likes: 10,
                    post_dislikes: 0,
                    post_comments: 5,
                },
                {
                    post_id: 2,
                    discord_id: 987654321098765432n,
                    post_header: "Python Test Post",
                    post_content:
                        "Hello everyone. I am trying to run this code but it keeps giving me an error. Can someone help me?\nCode: def main():\n\tuserValue = input('Enter digit: ')\n\tprint(f'You typed: {userValue}')",
                    post_date: new Date(),
                    post_lang: "py",
                    post_keywords: "another post",
                    post_likes: 5,
                    post_dislikes: 1,
                    post_comments: 2,
                },
                {
                    post_id: 3,
                    discord_id: 192837465564738291n,
                    post_header: "Java Test Post",
                    post_content:
                        "Hey, I am trying to make a simple problem, but im currently running into some problems. Can someone help me?\nCode: public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println('Hello World!');\n\t}\n}",
                    post_date: new Date(),
                    post_lang: "java",
                    post_keywords: "more post",
                    post_likes: 8,
                    post_dislikes: 2,
                    post_comments: 1,
                },
            ],
            skipDuplicates: true,
        });

        await prisma.postComment.createMany({
            data: [
                {
                    comment_id: 1,
                    post_id: 1,
                    discord_id: 123456789012345678n,
                    comment_content: "Nice post!",
                    comment_date: new Date(),
                },
                {
                    comment_id: 2,
                    post_id: 1,
                    discord_id: 987654321098765432n,
                    comment_content: "Thanks for sharing!",
                    comment_date: new Date(),
                },
                {
                    comment_id: 3,
                    post_id: 2,
                    discord_id: 192837465564738291n,
                    comment_content: "Interesting read!",
                    comment_date: new Date(),
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
