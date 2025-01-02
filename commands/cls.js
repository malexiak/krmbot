const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cls')
        .setDescription('clear')
        .addIntegerOption(option =>
            option.setName('ilosc')
                .setDescription('ilosc')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('uzytkownik')
                .setDescription('usexr')
                .setRequired(false)),

    async execute(interaction) {
        console.log('Uruchamianie komendy /cls');
        const ilosc = interaction.options.getInteger('ilosc');
        const uzytkownik = interaction.options.getUser('uzytkownik');
    
        console.log('Parametry:', { ilosc, uzytkownik });
    
        if (ilosc < 1 || ilosc > 100) {
            return interaction.reply({ content: 'Nieprawidłowa ilość wiadomości. Podaj liczbę od 1 do 100.', ephemeral: true });
        }
    
        const kanal = interaction.channel;
    
        try {
            if (uzytkownik) {
                const fetchedMessages = await kanal.messages.fetch({ limit: 100 });
                const userMessages = fetchedMessages.filter(msg => msg.author.id === uzytkownik.id).first(ilosc);
    
                await kanal.bulkDelete(userMessages, true);
                return interaction.reply({ content: `Usunięto ${userMessages.length} wiadomości użytkownika ${uzytkownik.tag}.`, ephemeral: true });
            } else {
                await kanal.bulkDelete(ilosc, true);
                return interaction.reply({ content: `Usunięto ${ilosc} wiadomości.`, ephemeral: true });
            }
        } catch (error) {
            console.error('Błąd w czasie wykonywania komendy:', error);
            return interaction.reply({ content: 'Wystąpił błąd podczas usuwania wiadomości.', ephemeral: true });
        }
    }
            
};
