const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bir kullanıcıyı sunucudan yasaklar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Yasaklanacak kullanıcıyı seçin.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Yasaklama sebebini belirtin.")
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName("dm")
        .setDescription("Kullanıcıya DM üzerinden yasaklandığını bildir.")
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    const user = interaction.options.getUser("kullanıcı");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi";
    const sendDM = interaction.options.getBoolean("dm") || false;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚫 Yasaklama İşlemi")
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    if (user.id === interaction.guild.ownerId) {
      embed.setDescription("❌ Sunucu sahibini yasaklayamazsınız.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member) {
      embed.setDescription("❌ Belirtilen kullanıcı sunucuda bulunamadı.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.member.roles.highest.position <= member.roles.highest.position) {
      embed.setDescription("❌ Bu kullanıcıyı yasaklamak için yeterli rol pozisyonuna sahip değilsiniz.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.bannable) {
      embed.setDescription("❌ Bu kullanıcıyı yasaklamak için botun yetkisi yetersiz.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      if (sendDM) {
        await user.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("🚫 Yasaklandınız")
              .setDescription(`**${interaction.guild.name}** sunucusundan yasaklandınız.`)
              .addFields(
                { name: "Sebep", value: reason },
                { name: "Yetkili", value: interaction.user.tag }
              )
              .setTimestamp(),
          ],
        });
      }

      await member.ban({ reason });

      embed
        .setDescription("✅ Kullanıcı başarıyla yasaklandı.")
        .addFields(
          { name: "Kullanıcı", value: `${user.tag} (${user.id})`, inline: true },
          { name: "Sebep", value: reason, inline: true },
          { name: "Yetkili", value: interaction.user.tag, inline: true }
        );

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      embed.setDescription("❌ Kullanıcıyı yasaklarken bir hata oluştu.");
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
