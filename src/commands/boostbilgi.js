const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("boost-bilgi")
    .setDescription("Sunucunun boost bilgilerini gösterir."),
  run: async (client, interaction) => {
    const guild = interaction.guild;

    const boosters = guild.members.cache.filter(member => member.premiumSince); // Boost yapan üyeleri alır.
    const boostCount = guild.premiumSubscriptionCount || 0;
    const boostLevel = guild.premiumTier;

    const embed = new EmbedBuilder()
      .setColor("Purple")
      .setTitle("🌟 Boost Bilgisi")
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: "🔰 Sunucu Boost Seviyesi", value: `${boostLevel || "0"}`, inline: true },
        { name: "🎉 Toplam Boost Sayısı", value: `${boostCount}`, inline: true },
        { name: "⭐ Boost Yapan Üyeler", value: boosters.size > 0 ? boosters.map(member => `<@${member.id}>`).join(", ") : "Hiç kimse boost yapmamış." }
      )
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
