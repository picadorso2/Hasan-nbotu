const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banlist")
    .setDescription("Sunucudaki yasaklı kullanıcıları listeler.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  run: async (client, interaction) => {
    try {
      const bans = await interaction.guild.bans.fetch();
      
      if (bans.size === 0) {
        return interaction.reply({ content: "Sunucuda yasaklı kullanıcı bulunmamaktadır.", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("🚫 Yasaklı Kullanıcılar Listesi")
        .setDescription("Sunucudaki yasaklı kullanıcıların listesi aşağıda belirtilmiştir.")
        .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      bans.forEach(ban => {
        embed.addFields({ name: ban.user.tag, value: `Yasaklanma Tarihi: ${ban.createdAt.toDateString()}`, inline: false });
      });

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({ content: `Yasaklı kullanıcılar listesi alınamadı: ${error.message}`, ephemeral: true });
    }
  },
};
