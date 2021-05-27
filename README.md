# DWorker Library - for discord.js
**DWorker** Is a Open Source library that made for helping to make your discord bot. We have a lot of easier ways to make your bot. `Easier, Does More`

---

### First step! Install dependecies
Requirements
1. discord.js
2. @types/node
```
npm install dworkerlib discord.js @types/node
```

### Second step! Setup Typescript config
Let's create file called **tsconfig.json** and copy json below this and then put to your file.
```json
{
  "compilerOptions": {
    "declaration": true,
    "strictNullChecks": true,
    "target": "es6",
    "outDir": "dist",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "lib": [
      "es2015"
    ],
    "rootDir": "src"
  },
  "include": [
    "src"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### Third step! Setup structure
Create folders in your project root to be like this.
```
- yourProject/
    - dist/
    - node_modules/
    - src/
        - Commands/
        - Listeners/
```

### Fourth step! Setup the DWorker
Go create **index.ts** in **src/** folder and copy code below this and then put to your file.
```typescript
import { Worker } from 'dworkerlib';
import * as path from 'path';

new Worker({
    token: 'your token', // Your bot token
    commandsFolder: path.join(__dirname, 'Commands'), // Your Commands folder
    listenersFolder: path.join(__dirname, 'Listeners'), // Your Listeners folder
    prefix: '+' // Prefix of bot's commands
});
```

That's all you need to setup your project.

---

Next... I'll show you how to create a **Command** and **Listener**

### Create Command
Create a file in folder **src/Commands/** and name whatever you want, but mine is **Ping.ts**
```typescript
import { Message } from "discord.js";
import { CommandHandler, SetupCommand } from "dworkerlib/dist/Interfaces/CommandInterface";

export default class implements CommandHandler {
    setup() {
        const setup: SetupCommand = {
            commandName: 'ping',
            getClient: false,
            executable: 'run'
        };

        return setup;
    }

    async run(message: Message) {
        await message.reply('Pong!');
    }
}
```

### Create Listener
Do the same as create command but create in folder **src/Listeners/**
```typescript
import { Client } from "discord.js";
import { ListenerHandler, ListEvents, SetupListener } from "dworkerlib/dist/Interfaces/ListenerInterface";

export default class implements ListenerHandler {
    setup() {
        const setup: SetupListener = {
            eventName: ListEvents.ready,
            executable: 'whenBotReady',
            getClient: true
        };

        return setup;
    }

    whenBotReady(client: Client) {
        console.log('[Bot] Is Ready now...');

        client.user?.setPresence({
            status: 'idle',
            activity: {
                type: 'PLAYING',
                name: 'Using a DWorker Library'
            }
        });
    }
}
```

---

## When you need to run your bot
You just type `tsc` and then type `node dist/index` 
Let's enjoy your bot!! ❤