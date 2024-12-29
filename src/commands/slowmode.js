const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yavaş-mod")
    .setDescription("Kanal için yavaş mod ayarlar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(option =>
      option
        .setName("süre")
        .setDescription("Yavaş mod süresi (saniye olarak).")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const slowmodeDuration = interaction.options.getInteger("süre");

    if (slowmodeDuration < 0 || slowmodeDuration > 21600) {
      return interaction.reply({ content: "Yavaş mod süresi 0 ile 21600 saniye (6 saat) arasında olmalıdır.", ephemeral: true });
    }

    const channel = interaction.channel;
    await channel.setRateLimitPerUser(slowmodeDuration).catch(err => {
      return interaction.reply({ content: "Yavaş mod ayarlanırken bir hata oluştu. Lütfen yetkilerinizi kontrol edin.", ephemeral: true });
    });

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🐌 Yavaş Mod Ayarlandı")
      .setDescription(`Bu kanal için yavaş mod **${slowmodeDuration} saniye** olarak ayarlandı.`)
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
