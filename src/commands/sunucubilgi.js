const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sunucu-bilgi")
    .setDescription("Sunucu hakkında detaylı bilgi verir."),
  run: async (client, interaction) => {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🌐 Sunucu Bilgisi")
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: "Sunucu Adı", value: guild.name, inline: true },
        { name: "Sunucu ID", value: guild.id, inline: true },
        { name: "Sahibi", value: `<@${guild.ownerId}>`, inline: true },
        { name: "Oluşturulma Tarihi", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: "Üye Sayısı", value: `${guild.memberCount}`, inline: true },
        { name: "Boost Seviyesi", value: `${guild.premiumTier}`, inline: true },
        { name: "Boost Sayısı", value: `${guild.premiumSubscriptionCount}`, inline: true },
        { name: "Kanal Sayısı", value: `${guild.channels.cache.size}`, inline: true },
        { name: "Rol Sayısı", value: `${guild.roles.cache.size}`, inline: true }
      )
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
