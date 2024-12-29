const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Belirtilen kullanıcıyı geçici olarak sunucudan yasaklar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Yasaklamak istediğiniz kullanıcıyı seçin.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("süre")
        .setDescription("Kullanıcının ne kadar süreyle yasaklanacağını girin (örnek: 1m, 1h, 1d).")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Yasaklama sebebini belirtin.")
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    const user = interaction.options.getUser("kullanıcı");
    const member = interaction.guild.members.cache.get(user.id);
    const duration = interaction.options.getString("süre");
    const reason = interaction.options.getString("sebep") || "Belirtilmedi";

    if (!member) {
      return interaction.reply({ content: "Kullanıcı sunucuda bulunamadı.", ephemeral: true });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({ content: "Kendinizi yasaklayamazsınız.", ephemeral: true });
    }

    if (member.id === interaction.guild.ownerId) {
      return interaction.reply({ content: "Sunucu sahibini yasaklayamazsınız.", ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: "Bu kullanıcıyı yasaklamak için yeterli yetkiye sahip değilsiniz.", ephemeral: true });
    }

    const time = ms(duration);

    if (!time || time < 1000) {
      return interaction.reply({ content: "Lütfen geçerli bir süre belirtin (örnek: 1m, 1h, 1d).", ephemeral: true });
    }

    await member
      .ban({ reason: `${reason} (Süre: ${duration})` })
      .catch(err => {
        return interaction.reply({ content: "Kullanıcı yasaklanırken bir hata oluştu. Lütfen yetkilerinizi kontrol edin.", ephemeral: true });
      });

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("⛔ Kullanıcı Geçici Olarak Yasaklandı")
      .addFields(
        { name: "Kullanıcı", value: `${user.tag}`, inline: true },
        { name: "Süre", value: duration, inline: true },
        { name: "Sebep", value: reason, inline: true }
      )
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });

   
    setTimeout(async () => {
      await interaction.guild.members.unban(user.id).catch(err => {
        console.error(`Kullanıcının yasağı kaldırılırken bir hata oluştu: ${err.message}`);
      });

      const unbanEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Kullanıcının Yasağı Kaldırıldı")
        .setDescription(`**${user.tag}** adlı kullanıcının yasağı otomatik olarak kaldırıldı.`)
        .setTimestamp();

      interaction.channel.send({ embeds: [unbanEmbed] });
    }, time);
  },
};
