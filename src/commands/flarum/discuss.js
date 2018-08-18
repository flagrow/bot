const { Command } = require('discord.js-commando');
const { discuss } = require('../../api');

module.exports = class DiscussCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'discuss',
      group: 'flarum',
      memberName: 'discuss',
      description: 'Search discussions on Flarum Discuss',
      examples: ['$discuss search rewritebase'],
    });
  }

  async run(msg) {
    const [action, ...args] = msg.content
      .toLowerCase()
      .split(' ')
      .slice(1);

    if (!action || !args.length || !this[action])
      return msg.reply(this.usage('search <query>'));

    return this[action](msg, args.join(' '));
  }

  async search(msg, q) {
    await msg.channel.startTyping();

    return discuss
      .get(`/api/discussions`, {
        'filter[q]': q,
        'page[limit]': 5,
      })
      .then(async discussions => {
        await msg.channel.stopTyping();

        return msg.embed({
          title: `Discussion search for '${q}'.`,
          url: `${discuss.base}/?q=${encodeURIComponent(q)}`,
          color: 0x5f4bb6,
          author: {
            name: 'Flarum Discuss',
            url: discuss.base,
            icon_url:
              'https://cdn.discordapp.com/icons/360670804914208769/ad3f98190755e4e1160298e7e14cb55f.webp',
          },
          fields: discussions.map(d => ({
            name: d.attributes.title,
            value: `[Comments ${d.attributes.commentsCount}, participants ${
              d.attributes.participantsCount
            }](${discuss.base}/d/${d.id})`,
          })),
          footer: !discussions.length && {
            text: 'No results found for your search.',
          },
        });
      });
  }
};
