import { Client } from "discord.js";

export enum ListEvents {
    channelCreate = 'channelCreate',
    channelDelete = 'channelDelete',
    channelPinsUpdate = 'channelPinsUpdate',
    channelUpdate = 'channelUpdate',
    debug = 'debug',
    emojiCreate = 'emojiCreate',
    emojiDelete = 'emojiDelete',
    emojiUpdate = 'emojiUpdate',
    error = 'error',
    guildBanAdd = 'guildBanAdd',
    guildBanRemove = 'guildBanRemove',
    guildCreate = 'guildCreate',
    guildDelete = 'guildDelete',
    guildIntegrationsUpdate = 'guildIntegrationsUpdate',
    guildMemberAdd = 'guildMemberAdd',
    guildMemberAvailable = 'guildMemberAvailable',
    guildMemberRemove = 'guildMemberRemove',
    guildMembersChunk = 'guildMembersChunk',
    guildMemberSpeaking = 'guildMemberSpeaking',
    guildMemberUpdate = 'guildMemberUpdate',
    guildUnavailable = 'guildUnavailable',
    guildUpdate = 'guildUpdate',
    message = 'message',
    messageDelete = 'messageDelete',
    messageDeleteBulk = 'messageDeleteBulk',
    messageReactionAdd = 'messageReactionAdd',
    messageReactionRemove = 'messageReactionRemove',
    messageReactionRemoveAll = 'messageReactionRemoveAll',
    messageReactionRemoveEmoji = 'messageReactionRemoveEmoji',
    messageUpdate = 'messageUpdate',
    presenceUpdate = 'presenceUpdate',
    rateLimit = 'rateLimit',
    ready = 'ready',
    roleCreate = 'roleCreate',
    roleDelete = 'roleDelete',
    roleUpdate = 'roleUpdate',
    shardDisconnect = 'shardDisconnect',
    shardError = 'shardError',
    shardReady = 'shardReady',
    shardReconnecting = 'shardReconnecting',
    shardResume = 'shardResume',
    typingStart = 'typingStart',
    userUpdate = 'userUpdate',
    voiceStateUpdate = 'voiceStateUpdate',
    warn = 'warn',
    webhookUpdate = 'webhookUpdate' 
}

export interface SetupListener {
    eventName: ListEvents;
    getClient: boolean;
    executable: string;
}

export interface ListenerHandler {
    setup(): SetupListener;
}