const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.resolve(__dirname, '../data/userLevels.json');

const loadUserLevels = () => {
    try {
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify({}, null, 2), 'utf8');
        }
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error(`Błąd podczas wczytywania poziomów użytkowników: ${error.message}`);
        return {};
    }
};

const saveUserLevels = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Błąd podczas zapisywania poziomów użytkowników: ${error.message}`);
    }
};

const assignRoleToUser = async (user, level, guild) => {
    const roleName = `Ranga ${Math.floor(level / 5) + 1}`;
    const role = guild.roles.cache.find(r => r.name === roleName);

    if (role) {
        if (!user.roles.cache.has(role.id)) {
            try {
                await user.roles.add(role);
                console.log(`Przyznano rolę ${roleName} użytkownikowi ${user.tag}.`);
            } catch (error) {
                console.error(`Błąd przy przypisywaniu roli ${roleName}: ${error.message}`);
            }
        }
    } else {
        console.error(`Rola ${roleName} nie istnieje na serwerze.`);
    }
};

const handleExperience = async (message) => {
    if (message.author.bot) return;

    const userLevels = loadUserLevels();
    const userId = message.author.id;

    if (!userLevels[userId]) {
        userLevels[userId] = {
            exp: 0,
            level: 1,
        };
    }

    const user = userLevels[userId];
    const expGain = Math.floor(Math.random() * 10) + 15;
    user.exp += expGain;

    const expToNextLevel = 170 * user.level * user.level;

    if (user.exp >= expToNextLevel) {
        user.exp -= expToNextLevel;
        user.level += 1;

        let rank = Math.floor(user.level / 5);
        if (rank > 10) rank = 10;

        const levelUpEmbed = new EmbedBuilder()
            .setColor(0x0000)
            .setTitle(`Gratulacje ${message.author.tag}!`)
            .setDescription(`poziom ${user.level}** ranga **${rank}**`)
            .addFields(
                { name: 'exp:', value: `${user.exp} / ${expToNextLevel}`, inline: true },
            )
            .setFooter({ text: 'd' })
            .setTimestamp();

        message.channel.send({ embeds: [levelUpEmbed] });

        await assignRoleToUser(message.member, user.level, message.guild);
    }

    saveUserLevels(userLevels);
};

module.exports = { handleExperience };
