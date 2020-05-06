const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");


const client = new Client({
    disableEveryone: true
});


client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();

client.categories = fs.readdirSync("./commands/");
client.categories = fs.readdirSync("./events/");

config({
    path: __dirname + "/.env"
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventStart = eventFunction.run.bind(null, client);
        let eventName = file.split(".")[0];
        client.events.set(eventName, eventStart)
        client.on(eventName, (...args) => eventFunction.run(client, utils, ...args));
    });
});

fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./commands/${ f }`);
        props.fileName = f;
        client.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.username} est en ligne !`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "Surveille le discord",
            type: "STREAMING"
        }
    }); 
});

client.on("message", async message => {
    const prefix = process.env.PREFIX;

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);

    
         
});

client.login();