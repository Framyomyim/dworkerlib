import { Client, Message } from 'discord.js';
import { WorkerHandler, WorkerInputs, ListInterface, GetFileType, ListsLoaded } from './Interfaces/WorkerInterface';
import { opendir } from 'fs/promises';
import { SetupCommand } from './Interfaces/CommandInterface';
import { SetupListener } from './Interfaces/ListenerInterface';

export class Worker implements WorkerHandler {
    botToken: string;
    listenersFolder: string;
    commandsFolder: string;
    list: ListInterface;
    client: Client;
    prefix: string;
    listLoaded: ListsLoaded;

    constructor(workerSetup: WorkerInputs) {
        this.botToken = workerSetup.token;
        this.commandsFolder = workerSetup.commandsFolder;
        this.listenersFolder = workerSetup.listenersFolder;
        this.list = {
            Listeners: [],
            Commands: []
        };
        this.listLoaded = {
            Listeners: {},
            Commands: {}
        };
        this.client = new Client();
        this.prefix = workerSetup.prefix;

        this.__autoload();
    }

    async __autoload() {
        await this.getAllFiles(this.commandsFolder, GetFileType.Command);
        await this.getAllFiles(this.listenersFolder, GetFileType.Listener);

        await this.loadListeners();
        await this.loadCommands();

        await this.setupDiscord();
    }

    async loadListeners() {
        for await (const file of this.list.Listeners) {
            let dispatcher = await import(file);
            dispatcher = new dispatcher.default();
            const setupLoaded: SetupListener = dispatcher.setup();
            
            this.listLoaded.Listeners[setupLoaded.eventName] = {
                object: dispatcher,
                setup: setupLoaded
            };

            this.client.on(setupLoaded.eventName, (...args: any) => {
                if(setupLoaded.getClient) {
                    dispatcher[setupLoaded.executable](this.client, ...args);
                } else {
                    dispatcher[setupLoaded.executable](...args);
                }
            });
        }
    }

    async loadCommands() {
        for await (const file of this.list.Commands) {
            let dispatcher = await import(file);
            dispatcher = new dispatcher.default();
            const setupLoaded: SetupCommand = dispatcher.setup();

            this.listLoaded.Commands[setupLoaded.commandName] = {
                object: dispatcher,
                setup: setupLoaded
            };
        }

        this.client.on('message', async (message: Message) => {
            const firstLetter: string = message.content[0];
            if(firstLetter === this.prefix) {
                const listSplits: Array<string> = message.content.substring(1).split(' ');
                let commandName: string;
                let isRun: boolean = false;
                let args: Array<string|number> = [];

                if(listSplits.length <= 0) {
                    throw new Error('Expected Command Name!');
                }

                commandName = listSplits[0];
                listSplits.shift();

                const argsCount: number = listSplits.length;
                listSplits.forEach((item: string, index: number) => {
                    let value: any;
                    if(Number(item) === NaN) {
                        value = Number(item);
                    } else {
                        value = item;
                    }

                    args.push(value);

                    if(argsCount === index + 1) {
                        if(commandName in this.listLoaded.Commands) {
                            const requiredClient = this.listLoaded.Commands[commandName].setup.getClient;
                            const execName = this.listLoaded.Commands[commandName].setup.executable;
                            if(requiredClient) {
                                this.listLoaded.Commands[commandName].object[execName](this.client, message, args);
                            } else {
                                this.listLoaded.Commands[commandName].object[execName](message, args);
                            }

                            isRun = true;
                        }
                    }
                });

                if(argsCount === 0 && isRun === false) {
                    if(commandName in this.listLoaded.Commands) {
                        const requiredClient = this.listLoaded.Commands[commandName].setup.getClient;
                        const execName = this.listLoaded.Commands[commandName].setup.executable;
                        if(requiredClient) {
                            this.listLoaded.Commands[commandName].object[execName](this.client, message, args);
                        } else {
                            this.listLoaded.Commands[commandName].object[execName](message, args);
                        }
                    }
                }
            }
        });
    }

    async setupDiscord() {
        this.client.login(this.botToken);        
    }

    async getAllFiles(path: string, fileType: GetFileType) {
        path = (path[path.length - 1] !== '/' || path[path.length - 1] !== '\\') ? path + '\\' : path;
        const indexToAccess: string = fileType === GetFileType.Command ? 'Commands' : 'Listeners';
        try {
            const dir = await opendir(path);
            for await (const dirent of dir) {
                const payloadFileName: Array<string> = dirent.name.split('.');
                if(payloadFileName[payloadFileName.length - 1] !== 'js') {
                    continue;
                }
                this.list[indexToAccess].push(path + dirent.name);
            }
        } catch(error) {
            throw new Error(error);
        }
    }
    
} 