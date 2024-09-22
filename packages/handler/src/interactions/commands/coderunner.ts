import {
    ActionRowBuilder,
    type ModalActionRowComponentBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "@discordjs/core";
import { env } from "core";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Logger } from "log";
import type { Command } from "../../services/commands.js";
import { getCommandOption } from "../../utility/interactionUtils.js";

type Runtime = {
    language: string;
    version: string;
    aliases: string[];
    runtime: string;
};

const PISTON_URL = `http://${env.PISTON_HOST}:${env.PISTON_PORT}/api/v2`;
const logger = new Logger();

const languages = Array.from([
    { name: "JavaScript", value: "js" },
    { name: "TypeScript", value: "ts" },
]);

const runtimes = (await (await fetch(`${PISTON_URL}/runtimes`)).json()) as Runtime[];

export const interaction: Command = {
    data: new SlashCommandBuilder()
        .setName("code-runner")
        .setDescription("Run code in a variety of languages")
        .addStringOption((option) =>
            option
                .setName("language")
                .setDescription("The language to run the code in")
                .setRequired(true)
                .addChoices(languages),
        ),
    async execute(interaction): Promise<void> {
        const languageOption = getCommandOption("language", ApplicationCommandOptionType.String, interaction.options);

        if (!languageOption || !languages.some((lang) => lang.value === languageOption))
            return await interaction.reply({ content: "Invalid Language", ephemeral: true });

        const runtime = runtimes.find((runtime) => runtime.aliases.includes(languageOption));

        if (!runtime) {
            logger.warn(`No runtime found for ${languageOption}`, "Piston", runtimes);
            return await interaction.reply({ content: "Problem finding runtime", ephemeral: true });
        }

        const codeInput = new TextInputBuilder()
            .setCustomId("coderunner-code")
            .setPlaceholder("console.log('Hello, World!')")
            .setMinLength(3)
            .setLabel("Code")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const row = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(codeInput);

        const modal = new ModalBuilder()
            .setCustomId(`coderunner-modal:${languageOption}:${runtime.version}`)
            .setTitle("Code input")
            .addComponents(row);

        await interaction.deployModal(modal);
    },
};
