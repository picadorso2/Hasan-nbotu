const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kanal")
    .setDescription("Kanalı kilitle veya aç.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(subcommand =>
      subcommand
        .setName("kilitle")
        .setDescription("Kanalı kilitler ve mesaj gönderimini devre dışı bırakır.")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("aç")
        .setDescription("Kanalı açar ve mesaj gönderimine izin verir.")
    ),
  run: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.channel;

    const embed = new EmbedBuilder()
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      embed
        .setColor("Red")
        .setTitle("❌ Yetki Hatası")
        .setDescription("Bu komutu kullanmak için `Kanalları Yönet` yetkisine sahip olmalısınız.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)) {
      embed
        .setColor("Red")
        .setTitle("❌ Bot Yetki Hatası")
        .setDescription("Bu kanalı yönetmek için botun `Kanalları Yönet` yetkisi olmalıdır.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (subcommand === "kilitle") {
      await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });

      embed
        .setColor("Red")
        .setTitle("🔒 Kanal Kilitlendi")
        .setDescription(`${channel} başarıyla kilitlendi. Artık üyeler mesaj gönderemez.`)
        .addFields(
          { name: "Kilitlenen Kanal", value: channel.name, inline: true },
          { name: "Yetkili", value: interaction.user.tag, inline: true }
        );

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === "aç") {
      await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null });

      embed
        .setColor("Green")
        .setTitle("🔓 Kanal Açıldı")
        .setDescription(`${channel} başarıyla açıldı. Artık üyeler mesaj gönderebilir.`)
        .addFields(
          { name: "Açılan Kanal", value: channel.name, inline: true },
          { name: "Yetkili", value: interaction.user.tag, inline: true }
        );

      return interaction.reply({ embeds: [embed] });
    }
  },
};
