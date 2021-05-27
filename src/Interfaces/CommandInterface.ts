export interface SetupCommand {
    commandName: string;
    executable: string,
    getClient: boolean;
}

export interface CommandHandler {
    setup(): SetupCommand;
}