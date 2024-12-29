const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("Mevcut kanalı sıfırlar (tüm mesajları siler).")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Yetki Hatası")
        .setDescription("Bu komutu kullanmak için `Kanalları Yönet` yetkisine sahip olmalısınız.")
        .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
    }

    const channel = interaction.channel;

    const confirmEmbed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("⚠️ Kanalı Sıfırlama Onayı")
      .setDescription("Bu kanalı sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz!")
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("💥 Kanal Nuke İşlemi")
      .setDescription(`Kanal başarıyla sıfırlandı.`)
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    const confirmationMessage = await interaction.reply({ embeds: [confirmEmbed], fetchReply: true });
    await confirmationMessage.react("✅");
    await confirmationMessage.react("❌");

    const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && user.id === interaction.user.id;
    const collector = confirmationMessage.createReactionCollector({ filter, max: 1, time: 15000 });

    collector.on("collect", async reaction => {
      if (reaction.emoji.name === "✅") {
        const position = channel.position;
        const newChannel = await channel.clone();
        await channel.delete();
        await newChannel.setPosition(position);
        newChannel.send({ embeds: [embed] });
      } else {
        const cancelEmbed = new EmbedBuilder()
          .setColor("Green")
          .setDescription("❌ Kanal sıfırlama işlemi iptal edildi.");
        interaction.editReply({ embeds: [cancelEmbed] });
      }
    });

    collector.on("end", collected => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setColor("Orange")
          .setDescription("❌ Kanal sıfırlama işlemi zaman aşımına uğradı.");
        interaction.editReply({ embeds: [timeoutEmbed] });
      }
    });
  },
};
