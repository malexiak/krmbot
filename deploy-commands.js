const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
    try {
        console.log('Rozpoczynam odświeżanie komend aplikacji...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.client_id, process.env.guild_id),
            { body: commands },
        );        

        console.log('Pomyślnie odświeżono komendy aplikacji.');
    } catch (error) {
        console.error(error);
    }
})();
