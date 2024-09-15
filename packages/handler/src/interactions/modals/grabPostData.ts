import { EmbedBuilder, bold, codeBlock, formatEmoji, inlineCode } from "@discordjs/builders";
import prisma from "database";
import type { Modal } from "../../services/commands.js";

// Replace this function someplace else, like in a utility file.
async function createPost(
    interaction: any,
    code: string,
    error: string | null,
    title: string,
    description: string,
    language: string,
) {
    // There needs to be a check to see if the user already exists in the database.
    // Add this whenever this function gets replaced
    const user = await (await prisma).user.create({
        data: {
            id: interaction.member_id,
            discord_id: interaction.member_id,
            username: interaction.member_name,
            premium: false,
            code_runs_left: 30,
        },
    });
    
    const post = await (await prisma).post.create({
        data: {
            paste: {
                create: [
                    {
                        content: code,
                        content_type: "CODE",
                    },
                    {
                        content: error || "",
                        content_type: "ERROR",
                    },
                ],
            },
            uploader_id: user.id,
            title: title,
            description: description,
            likes: 0,
            dislikes: 0,
            language: language,
        },
        include: { uploader: true, paste: true },
    });

    return post;
}

export const interaction: Modal = {
    custom_id: "create-post-modal",
    async execute(interaction): Promise<void> {
        const title = interaction.getModalValue("create-post-title")?.value;
        const description = interaction.getModalValue("create-post-description")?.value;
        const language = interaction.getModalValue("create-post-language")?.value;
        const code = interaction.getModalValue("create-post-code")?.value;
        const error = interaction.getModalValue("create-post-error")?.value || null;

        if (!title || !description || !code || !language) {
            await interaction.reply({
                content: "Please fill out the required fields.",
                ephemeral: true,
            });
            return;
        }

        const prismaPost = await createPost(interaction, code, error, title, description, language);

        const embed = new EmbedBuilder()
            .setDescription(`
                ${formatEmoji("1283395868648673331")} ${bold(inlineCode(title))}
                ${formatEmoji("1283395921366880266")} ${bold(inlineCode("description"))}
                ${codeBlock(language, description)}
                ${formatEmoji("1283395929444978740")} ${bold(inlineCode("Code"))}
                ${codeBlock(language, code)}
                ${
                    error
                        ? `${formatEmoji("1283395936550260818")} ${bold(inlineCode("Error"))}
                ${codeBlock(language, error)}`
                        : ""
                }
                `)
            .setColor(0x2f3136)
            .setFooter({ text: `ID: ${prismaPost.id}` });
        await interaction.reply({
            content: bold("You have successfully made a post!"),
            embeds: [embed],
            ephemeral: true,
        });
    },
};
