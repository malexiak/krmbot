const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const sendRulesMessage = require('./utils/sendRulesMessage');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];

    if (eventName === 'guildMemberAdd') {
        client.on('guildMemberAdd', event);
    } else {
        client.on(eventName, event.bind(null, client));
    }
}

client.on('interactionCreate', async interaction => {
    console.log('Wykryto interakcję:', interaction.commandName);

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.log('Nie znaleziono komendy:', interaction.commandName);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'Wystąpił błąd podczas wykonywania tej komendy.',
            ephemeral: true,
        });
    }
});


client.once('ready', async () => {
    console.log(`Zalogowano jako ${client.user.tag}!`);
    await sendRulesMessage(client);
});

client.login(process.env.token);
