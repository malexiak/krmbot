const { EmbedBuilder } = require('discord.js');

module.exports = async (client) => {
    const rulesChannelId = process.env.rules_id;
    const rulesChannel = client.channels.cache.get(rulesChannelId);

    if (!rulesChannel) {
        console.error('Nie ma kanału rules.');
        return;
    }

    try {
        const messages = await rulesChannel.messages.fetch({ limit: 50 });

        const existingMessage = messages.find(
            msg =>
                msg.author.id === client.user.id &&
                msg.embeds.length > 0 &&
                msg.embeds[0].title &&
                msg.embeds[0].title.toLowerCase() === 'regulamin serwera'
        );

        const rulesEmbed = new EmbedBuilder()
            .setColor(0x0000)
            .setTitle('Regulamin serwera')
            .setDescription('chuj')
            .addFields(
                { name: 'Bądź kurwa nienormalny', value: '\u200b' },
                { name: 'Oglądaj streamy', value: '\u200b' },
                { name: 'Sub prime obowiązkowy', value: '\u200b' },
            )
            .setFooter({ text: 'cwel' })
            .setTimestamp();

        if (existingMessage) {
            await existingMessage.edit({ embeds: [rulesEmbed] });
            console.log('Regulamin został zaktualizowany.');
        } else {
            await rulesChannel.send({ embeds: [rulesEmbed] });
            console.log('Regulamin został wysłany.');
        }
    } catch (error) {
        console.error(`Błąd podczas wysyłania lub aktualizowania regulaminu: ${error.message}`);
    }
};
