import { Message, Client } from 'discord.js';
import { CommandHandler, SetupCommand, ArgumentsTypes } from './../../src/Interfaces/CommandInterface';

export default class implements CommandHandler {
    setup() {
        const setup: SetupCommand = {
            commandName: 'ping',
            executable: 'run',
            getClient: true,
            args: {
                fullname: {
                    type: ArgumentsTypes.string,
                    required: true
                }
            }
        };

        return setup;
    }

    async run(args: Array<any>, message: Message, client: Client): Promise<void> {
        await message.reply('Pong!');
    }
}