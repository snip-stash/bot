import { ActionRowBuilder, EmbedBuilder, ModalBuilder } from "@discordjs/builders";
import type {
    API,
    APIActionRowComponent,
    APIEmbed,
    APIInteraction,
    APIModalInteractionResponseCallbackData,
} from "@discordjs/core";
import { MessageFlags } from "@discordjs/core";

export class BaseInteraction {
    constructor(
        public interaction: APIInteraction,
        public api: API,
    ) {}

    get id() {
        return this.interaction.id;
    }

    get token() {
        return this.interaction.token;
    }

    get member() {
        return this.interaction.member;
    }

    public async reply(
        options: {
            content?: string;
            embeds?: EmbedBuilder[] | APIEmbed[];
            components?: APIActionRowComponent<any>[] | ActionRowBuilder<any>[];
            ephemeral?: boolean;
        } = {},
    ) {
        const flags: number = options.ephemeral ? MessageFlags.Ephemeral : 0;

        return await this.api.interactions.reply(this.id, this.token, {
            content: options.content,
            embeds: options.embeds?.map((embed) => {
                if (embed instanceof EmbedBuilder) {
                    return embed.toJSON();
                }
                return embed;
            }),
            components: options.components?.map((component) => {
                if (component instanceof ActionRowBuilder) {
                    return component.toJSON();
                }
                return component;
            }),
            flags,
        });
    }

    public async deployModal(modal: ModalBuilder | APIModalInteractionResponseCallbackData) {
        const json = modal instanceof ModalBuilder ? modal.toJSON() : modal;
        return await this.api.interactions.createModal(this.id, this.token, json);
    }
}
