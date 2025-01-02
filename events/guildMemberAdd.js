const dotenv = require('dotenv');
dotenv.config();

module.exports = async (member) => {
    const channelId = process.env.welcome_id;
    const welcomeChannel = member.guild.channels.cache.get(channelId);

    if (welcomeChannel) {
        const welcomeMessage = `elo ${member.user} baw sie dobrze cwelu`;
        welcomeChannel.send(welcomeMessage).catch(console.error);
    } else {
        console.error('nie ma takiego kanalu');
    }

    const roleId = process.env.welcome_role_id;
    const role = member.guild.roles.cache.get(roleId);

    if (role) {
        try {
            await member.roles.add(role);
            console.log(`Przyznano rolę ${role.name} użytkownikowi ${member.user.tag}.`);
        } catch (error) {
            console.error(`Nie udało się przyznać roli: ${error.message}`);
        }
    } else {
        console.error('nie ma takiej rolis');
    }
};
