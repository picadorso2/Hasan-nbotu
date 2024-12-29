const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kullanıcı-bilgi")
    .setDescription("Belirtilen kullanıcı hakkında detaylı bilgi verir.")
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Bilgilerini görmek istediğiniz kullanıcıyı seçin.")
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    const user = interaction.options.getUser("kullanıcı") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("👤 Kullanıcı Bilgisi")
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: "Kullanıcı Adı", value: `${user.tag}`, inline: true },
        { name: "Kullanıcı ID", value: `${user.id}`, inline: true },
        { name: "Oluşturulma Tarihi", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: "Sunucuya Katılma Tarihi", value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : "Sunucuda değil", inline: true },
        { name: "Roller", value: member ? member.roles.cache.map(role => role).join(", ") || "Hiç rol yok" : "Sunucuda değil", inline: false },
        { name: "Bot Mu?", value: user.bot ? "Evet" : "Hayır", inline: true }
      )
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
