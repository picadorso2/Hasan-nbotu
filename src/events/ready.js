const { ActivityType } = require("discord.js")
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
  client.user.setActivity("DEVELOPER BY PİCADORSO2")
}};
