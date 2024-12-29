const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Bir kullanıcının yasaklamasını kaldırır.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
      option
        .setName("kullanıcı_id")
        .setDescription("Yasaklaması kaldırılacak kullanıcının ID'sini girin.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Yasak kaldırma sebebini girin.")
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    const userId = interaction.options.getString("kullanıcı_id");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi";

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔓 Kullanıcı Yasak Kaldırıldı")
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    const errorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Hata")
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      errorEmbed.setDescription("Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısınız.");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      const bannedUsers = await interaction.guild.bans.fetch();
      const bannedUser = bannedUsers.get(userId);

      if (!bannedUser) {
        errorEmbed.setDescription(`Bu ID'ye sahip kullanıcı yasaklanmamış.`);
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      await interaction.guild.members.unban(userId, reason);

      embed
        .setDescription("Kullanıcı başarıyla yasaktan kaldırıldı.")
        .addFields(
          { name: "Kullanıcı ID", value: userId, inline: true },
          { name: "Sebep", value: reason, inline: true },
          { name: "Yetkili", value: interaction.user.tag, inline: true }
        );

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      errorEmbed.setDescription("Yasak kaldırılırken bir hata oluştu. Lütfen doğru bir kullanıcı ID'si girdiğinizden emin olun.");
      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
