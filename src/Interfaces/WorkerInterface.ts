import { Client } from "discord.js";
import { CommandHandler, SetupCommand } from './CommandInterface';
import { ListenerHandler, SetupListener } from './ListenerInterface';

export enum GetFileType {
    Command,
    Listener
}

export interface ListInterface {
    Listeners: Array<string>,
    Commands: Array<string>
}

export interface ItemLoaded {
    [nameOfLoaded: string]: {
        object: CommandHandler | ListenerHandler,
        setup: SetupCommand | SetupListener
    };
}

export interface ListsLoaded {
    Listeners: ItemLoaded,
    Commands: ItemLoaded
}

export interface WorkerHandler {
    botToken: string;
    listenersFolder: string;
    commandsFolder: string;
    list: ListInterface;
    client: Client;
    prefix: string;
    listLoaded: ListsLoaded;

    __autoload: () => any;
    setupDiscord: () => any;
    loadListeners: () => any;
    loadCommands: () => any;
    getAllFiles: (folder: string, fileType: GetFileType) => any;
}

export interface WorkerInputs {
    token: string;
    commandsFolder: string;
    listenersFolder: string;
    prefix: string;
};