const { handleExperience } = require('../utils/experienceSystem');

module.exports = (client, message) => {
    handleExperience(message);
};
