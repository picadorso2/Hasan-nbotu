const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Bir kullanıcıyı belirli bir süreliğine susturur.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Susturulacak kullanıcıyı seçin.")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("süre")
        .setDescription("Kaç dakika susturulacak?")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Susturma sebebini belirtin.")
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    const user = interaction.options.getUser("kullanıcı");
    const duration = interaction.options.getInteger("süre");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi";
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🔇 Susturma İşlemi")
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    if (user.id === interaction.guild.ownerId) {
      embed.setDescription("❌ Sunucu sahibini susturamazsınız.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member) {
      embed.setDescription("❌ Belirtilen kullanıcı sunucuda bulunamadı.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.member.roles.highest.position <= member.roles.highest.position) {
      embed.setDescription("❌ Bu kullanıcıyı susturmak için yeterli rol pozisyonuna sahip değilsiniz.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.moderatable) {
      embed.setDescription("❌ Bu kullanıcıyı susturmak için botun yetkisi yetersiz.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (duration <= 0 || duration > 10080) {
      embed.setDescription("❌ Süre 1 dakika ile 7 gün (10080 dakika) arasında olmalıdır.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const milliseconds = duration * 60 * 1000;
      await member.timeout(milliseconds, reason);

      embed
        .setDescription("✅ Kullanıcı başarıyla susturuldu.")
        .addFields(
          { name: "Kullanıcı", value: `${user.tag} (${user.id})`, inline: true },
          { name: "Süre", value: `${duration} dakika`, inline: true },
          { name: "Sebep", value: reason, inline: true },
          { name: "Yetkili", value: interaction.user.tag, inline: true }
        );

      interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        if (member.communicationDisabledUntilTimestamp <= Date.now()) {
          const unmuteEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🔓 Susturma Kaldırıldı")
            .setDescription(`**${user.tag}** adlı kullanıcının mutesi kaldırıldı.`)
            .setTimestamp();

          await interaction.channel.send({ embeds: [unmuteEmbed] });
        }
      }, milliseconds);
    } catch (error) {
      console.error(error);
      embed.setDescription("❌ Kullanıcıyı sustururken bir hata oluştu.");
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
