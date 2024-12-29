const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sil")
    .setDescription("Belirtilen sayıda mesajı siler.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option
        .setName("miktar")
        .setDescription("Silmek istediğiniz mesaj miktarı (1-100).")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const amount = interaction.options.getInteger("miktar");

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: "1 ile 100 arasında bir sayı belirtmelisiniz.", ephemeral: true });
    }

    const channel = interaction.channel;
    await channel.bulkDelete(amount, true).catch(err => {
      return interaction.reply({ content: "Mesajlar silinirken bir hata oluştu. Lütfen yetkilerinizi kontrol edin.", ephemeral: true });
    });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🧹 Mesajlar Silindi")
      .setDescription(`Başarıyla **${amount}** adet mesaj silindi.`)
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
