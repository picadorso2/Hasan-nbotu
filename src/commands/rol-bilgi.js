const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rol-bilgi")
    .setDescription("Belirtilen rol hakkında detaylı bilgi verir.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option =>
      option
        .setName("rol")
        .setDescription("Bilgilerini görmek istediğiniz rolü seçin.")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const role = interaction.options.getRole("rol");

    const embed = new EmbedBuilder()
      .setColor(role.color || "Blue")
      .setTitle("📜 Rol Bilgisi")
      .addFields(
        { name: "Rol Adı", value: role.name, inline: true },
        { name: "Rol ID", value: role.id, inline: true },
        { name: "Renk Kodu", value: role.hexColor, inline: true },
        { name: "Oluşturulma Tarihi", value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`, inline: true },
        { name: "Pozisyon", value: `${role.position}`, inline: true },
        { name: "Üye Sayısı", value: `${role.members.size}`, inline: true },
        { name: "Ayrı Görünür", value: role.hoist ? "Evet" : "Hayır", inline: true },
        { name: "Etiketlenebilir", value: role.mentionable ? "Evet" : "Hayır", inline: true }
      )
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
