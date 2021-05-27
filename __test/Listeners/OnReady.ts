import { Client } from 'discord.js';
import { ListenerHandler, ListEvents, SetupListener } from './../../src/Interfaces/ListenerInterface';

export default class implements ListenerHandler {
    setup() {
        const setup: SetupListener = {
            eventName: ListEvents.ready,
            getClient: true,
            executable: 'run'
        };

        return setup;
    }

    async run(client: Client): Promise<void> {
        console.log('Bot is ready');
    }
}