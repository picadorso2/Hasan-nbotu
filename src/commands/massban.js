const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("massban")
    .setDescription("Belirtilen birden fazla kullanıcıyı etiketle yasaklar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
      option
        .setName("kullanıcılar")
        .setDescription("Yasaklamak istediğiniz kullanıcıları etiketleyin (örn: @Ahmet @Mehmet).")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Yasaklama sebebini belirtin.")
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    const users = interaction.options.getString("kullanıcılar").split(" ");
    const reason = interaction.options.getString("sebep") || "Belirtilmedi";

    if (!users.length) {
      return interaction.reply({ content: "Lütfen yasaklanacak kullanıcıları etiketleyin.", ephemeral: true });
    }

    const bannedUsers = [];
    const failedUsers = [];

    for (const userTag of users) {
      const user = interaction.guild.members.cache.get(userTag.replace(/[<@!>]/g, ''));

      if (!user) {
        failedUsers.push(userTag);
        continue;
      }

      try {
        await interaction.guild.members.ban(user.id, { reason });
        bannedUsers.push(userTag);
      } catch (error) {
        failedUsers.push(userTag);
      }
    }

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("⛔ Çoklu Yasaklama İşlemi")
      .addFields(
        { name: "Başarıyla Yasaklananlar", value: bannedUsers.length > 0 ? bannedUsers.join("\n") : "Hiçbiri", inline: true },
        { name: "Yasaklanamayanlar", value: failedUsers.length > 0 ? failedUsers.join("\n") : "Hiçbiri", inline: true },
        { name: "Sebep", value: reason, inline: false }
      )
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
