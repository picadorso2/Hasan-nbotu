const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Tüm komutların listesini gör."),
  
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle("📜 Yardım Menüsü")
      .setDescription("Aşağıda mevcut komutların listesini bulabilirsiniz:")
      .addFields(
        { name: "🎮 Moderasyon Komutları", value: "/ban, /kick, /tempban, /unban, /softban, /massban, /clear, /sil, /lock, /unlock, /nuke, /mute, /unmute", inline: false },
        { name: "⚙️ Rol Komutları", value: "/rol-ver, /rol-al, /rol-bilgi", inline: false },
        { name: "🧑‍💻 Kullanıcı Bilgi Komutları", value: "/kullanıcı-bilgi, /boost-bilgi", inline: false },
        { name: "🌐 Sunucu Bilgisi", value: "/sunucu-bilgi", inline: false },
        { name: "🔔 Uyarı Sistemi", value: "/uyarılar ekle, /uyarılar sil, /uyarılar liste, /uyarılar kontrol", inline: false },
        { name: "⏳ Yavaş Mod", value: "/yavaş-mod", inline: false },
        { name: "🔇 Mute Komutları", value: "/mute, /unmute", inline: false },
        { name: "🚀 Yardım", value: "/yardım", inline: false }
      )
      .setFooter({ text: `developer by: picadorso2`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
