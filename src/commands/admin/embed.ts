import Axios from 'axios';
import { oneLine, stripIndent } from 'common-tags';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message, MessageEmbedOptions, TextChannel } from 'discord.js';
import type { AxiosResponse } from 'axios';
import type { URL } from 'url';

interface CmdArgs {
  embedOptionsLink: URL;
  textChannel: TextChannel;
}

export default class EmbedCommand extends RuppyCommand {
  public constructor() {
    super('embed', {
      category: CmdCategories.Admin,
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      description: {
        content: 'Create / send custom message as embed in given channel.',
      },
      args: [
        {
          id: 'embedOptionsLink',
          match: 'content',
          type: 'url',
          prompt: {
            start:
              'enter URL to raw JSON of embed options (exp: sourcebin, hastebin, etc)',
            retry: 'Not a valid URL.',
          },
        },
        {
          id: 'textChannel',
          match: 'content',
          type: 'textChannel',
          prompt: {
            start: 'enter channel ID the embed to send',
            retry: 'Channel not found with that ID.',
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { embedOptionsLink, textChannel }: CmdArgs
  ) {
    try {
      const { data }: AxiosResponse<MessageEmbedOptions> = await Axios.get(
        embedOptionsLink.toString()
      );
      const embed: MessageEmbedOptions = data;

      const msg = await textChannel.send({ embed });
      await msg.react('☑');
      return await message.util?.send(
        oneLine`Embed message successfully sent to ${textChannel}`
      );
    } catch (error) {
      this.logger.error('Embed Command error:', error);

      return await message.util?.send(
        stripIndent`
          Sorry, something went wrong. Please tell developer with this info:
          \`\`\`js
          ${new Date().toISOString()}
          \`\`\`
        `
      );
    }
  }
}
