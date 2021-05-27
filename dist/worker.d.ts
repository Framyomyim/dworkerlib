import { Client } from 'discord.js';
import { WorkerHandler, WorkerInputs, ListInterface, GetFileType, ListsLoaded } from './Interfaces/WorkerInterface';
export declare class Worker implements WorkerHandler {
    botToken: string;
    listenersFolder: string;
    commandsFolder: string;
    list: ListInterface;
    client: Client;
    prefix: string;
    listLoaded: ListsLoaded;
    constructor(workerSetup: WorkerInputs);
    __autoload(): Promise<void>;
    loadListeners(): Promise<void>;
    loadCommands(): Promise<void>;
    setupDiscord(): Promise<void>;
    getAllFiles(path: string, fileType: GetFileType): Promise<void>;
}
