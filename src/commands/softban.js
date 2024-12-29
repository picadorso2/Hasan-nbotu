const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("softban")
    .setDescription("Kullanıcıyı geçici olarak yasaklar ve hemen unban yapar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Yasaklamak istediğiniz kullanıcıyı seçin.")
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
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi";

    const member = interaction.guild.members.cache.get(user.id);

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

    await member.ban({ reason });
    await interaction.guild.members.unban(user.id);

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("🔨 Softban İşlemi")
      .setDescription(`${user.tag} kullanıcısı geçici olarak yasaklandı ve hemen unban yapıldı.`)
      .addFields({ name: "Sebep", value: reason })
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
