"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const discord_js_1 = require("discord.js");
const WorkerInterface_1 = require("./Interfaces/WorkerInterface");
const promises_1 = require("fs/promises");
class Worker {
    constructor(workerSetup) {
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
        this.client = new discord_js_1.Client();
        this.prefix = workerSetup.prefix;
        this.__autoload();
    }
    __autoload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getAllFiles(this.commandsFolder, WorkerInterface_1.GetFileType.Command);
            yield this.getAllFiles(this.listenersFolder, WorkerInterface_1.GetFileType.Listener);
            yield this.loadListeners();
            yield this.loadCommands();
            yield this.setupDiscord();
        });
    }
    loadListeners() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this.list.Listeners), _c; _c = yield _b.next(), !_c.done;) {
                    const file = _c.value;
                    let dispatcher = yield Promise.resolve().then(() => require(file));
                    dispatcher = new dispatcher.default();
                    const setupLoaded = dispatcher.setup();
                    this.listLoaded.Listeners[setupLoaded.eventName] = {
                        object: dispatcher,
                        setup: setupLoaded
                    };
                    this.client.on(setupLoaded.eventName, (...args) => {
                        if (setupLoaded.getClient) {
                            dispatcher[setupLoaded.executable](this.client, ...args);
                        }
                        else {
                            dispatcher[setupLoaded.executable](...args);
                        }
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    loadCommands() {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _b = __asyncValues(this.list.Commands), _c; _c = yield _b.next(), !_c.done;) {
                    const file = _c.value;
                    let dispatcher = yield Promise.resolve().then(() => require(file));
                    dispatcher = new dispatcher.default();
                    const setupLoaded = dispatcher.setup();
                    this.listLoaded.Commands[setupLoaded.commandName] = {
                        object: dispatcher,
                        setup: setupLoaded
                    };
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.client.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                const firstLetter = message.content[0];
                if (firstLetter === this.prefix) {
                    const listSplits = message.content.substring(1).split(' ');
                    let commandName;
                    let isRun = false;
                    let args = [];
                    if (listSplits.length <= 0) {
                        throw new Error('Expected Command Name!');
                    }
                    commandName = listSplits[0];
                    listSplits.shift();
                    const argsCount = listSplits.length;
                    listSplits.forEach((item, index) => {
                        let value;
                        if (Number(item) === NaN) {
                            value = Number(item);
                        }
                        else {
                            value = item;
                        }
                        args.push(value);
                        if (argsCount === index + 1) {
                            if (commandName in this.listLoaded.Commands) {
                                const requiredClient = this.listLoaded.Commands[commandName].setup.getClient;
                                const execName = this.listLoaded.Commands[commandName].setup.executable;
                                if (requiredClient) {
                                    this.listLoaded.Commands[commandName].object[execName](this.client, message, args);
                                }
                                else {
                                    this.listLoaded.Commands[commandName].object[execName](message, args);
                                }
                                isRun = true;
                            }
                        }
                    });
                    if (argsCount === 0 && isRun === false) {
                        if (commandName in this.listLoaded.Commands) {
                            const requiredClient = this.listLoaded.Commands[commandName].setup.getClient;
                            const execName = this.listLoaded.Commands[commandName].setup.executable;
                            if (requiredClient) {
                                this.listLoaded.Commands[commandName].object[execName](this.client, message, args);
                            }
                            else {
                                this.listLoaded.Commands[commandName].object[execName](message, args);
                            }
                        }
                    }
                }
            }));
        });
    }
    setupDiscord() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.login(this.botToken);
        });
    }
    getAllFiles(path, fileType) {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function* () {
            path = (path[path.length - 1] !== '/' || path[path.length - 1] !== '\\') ? path + '\\' : path;
            const indexToAccess = fileType === WorkerInterface_1.GetFileType.Command ? 'Commands' : 'Listeners';
            try {
                const dir = yield promises_1.opendir(path);
                try {
                    for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                        const dirent = dir_1_1.value;
                        const payloadFileName = dirent.name.split('.');
                        if (payloadFileName[payloadFileName.length - 1] !== 'js') {
                            continue;
                        }
                        this.list[indexToAccess].push(path + dirent.name);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (dir_1_1 && !dir_1_1.done && (_a = dir_1.return)) yield _a.call(dir_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=worker.js.map