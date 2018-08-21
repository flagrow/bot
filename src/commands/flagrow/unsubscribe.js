const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { notifications } = require('../../db');

class UnsubscribeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unsubscribe',
      group: 'flagrow',
      memberName: 'unsubscribe',
      aliases: ['unsub'],
      description: 'Unsubscribe to extension events',
      userPermissions: ['ADMINISTRATOR'],
      ratelimit: 1,
      guildOnly: true,
    });

    this.pattern = this.client.dispatcher.buildCommandPattern();
  }

  run(msg) {
    if (!this.pattern.test(msg.content)) return;
    
    const subscribed = notifications.has(msg.channel.id);
    const message = !subscribed ? 'This channel is not subscribed to notifications' : 'Successfully unsubscribed from extension notifications';

    if (subscribed) notifications.delete(msg.channel.id);

    return msg.embed({
      title: message,
    });
  }
}

module.exports = UnsubscribeCommand;