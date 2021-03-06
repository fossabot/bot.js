const Discord = require('discord.js');
const { PlayerManager } = require("discord.js-lavalink");
class MusicClient extends Discord.Client {
    constructor(options) {
        super(options);
        this.player = null;
        this.once("ready", this._ready.bind(this));
    }
    _ready() {
        this.player = new PlayerManager(this, [{ host: config.lavalink.host, port: config.lavalink.port, region: "eu-central", password: config.lavalink.password }], {
            user: this.user.id,
            shards: 1
        });
    }
}
const client = new MusicClient();
client.commands = new Discord.Collection();
var fs = require("fs");
const config = require("./config.json");
var clc = require("cli-colors");
require('./events/eventLoader')(client);

module.exports.client = client;
fs.readdirSync('./commands/').forEach(category => {
    const commandFile = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
    for (const file of commandFile) {
        const props = require(`./commands/${category}/${file}`);
        console.log(clc.yellow(`[${category}] `) + clc.green(`./commands/${category}/${file}`));
        client.commands.set(props.help.name, {category: category, run: props.run, help: props.help});
        if(props.help.aliases != undefined) {
            try{props.help.aliases.forEach(alias => client.commands.set(alias, {category: category, run: props.run, help: props.help}));} catch(e) {}
        }
    }
});

client.login(config.tokens.token);