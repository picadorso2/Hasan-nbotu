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
        
        { name: "/ban", value: "Bir kullanıcıyı sunucudan yasaklar.", inline: false },
        { name: "/kick", value: "Bir kullanıcıyı sunucudan atar.", inline: false },
        { name: "/tempban", value: "Bir kullanıcıyı belirli bir süreliğine yasaklar.", inline: false },
        { name: "/unban", value: "Bir kullanıcının yasaklamasını kaldırır.", inline: false },
        { name: "/softban", value: "Bir kullanıcıyı yasaklayıp, hemen tekrar davet eder.", inline: false },
        { name: "/massban", value: "Birden fazla kullanıcıyı aynı anda yasaklar.", inline: false },
        { name: "/clear", value: "Belirtilen miktarda mesajı siler (1-100).", inline: false },
        { name: "/sil", value: "Belirtilen miktarda mesajı siler (1-100).", inline: false },
        { name: "/lock", value: "Kanalı kilitler ve mesaj gönderimini engeller.", inline: false },
        { name: "/unlock", value: "Kanalı açar ve mesaj gönderimine izin verir.", inline: false },
        { name: "/nuke", value: "Kanalı patlatır ve tüm mesajları siler.", inline: false },
        { name: "/rol-ver", value: "Belirtilen bir kullanıcıya rol verir.", inline: false },
        { name: "/rol-al", value: "Belirtilen bir kullanıcının rolünü alır.", inline: false },
        { name: "/rol-bilgi", value: "Belirtilen rol hakkında detaylı bilgi verir.", inline: false },
        { name: "/kullanıcı-bilgi", value: "Belirtilen kullanıcı hakkında detaylı bilgi verir.", inline: false },
        { name: "/boost-bilgi", value: "Sunucunun boost bilgilerini gösterir.", inline: false },
        { name: "/sunucu-bilgi", value: "Sunucu hakkında detaylı bilgi verir.", inline: false },
        { name: "/uyarılar ekle", value: "Bir kullanıcıya uyarı ekler.", inline: false },
        { name: "/uyarılar sil", value: "Bir kullanıcının uyarısını siler.", inline: false },
        { name: "/uyarılar liste", value: "Bir kullanıcının tüm uyarılarını listeler.", inline: false },
        { name: "/uyarılar kontrol", value: "Bir kullanıcının toplam uyarı sayısını kontrol eder.", inline: false },
        { name: "/yavaş-mod", value: "Kanal için yavaş mod ayarlar (saniye olarak).", inline: false },
        { name: "/ban-log", value: "Bir kullanıcı yasaklandığında, yasaklanan kanal bilgilerini ayarlar.", inline: false },
        { name: "/mute", value: "Bir kullanıcıyı sessize alır (geçici mute).", inline: false },
        { name: "/unmute", value: "Bir kullanıcının mute'ini kaldırır.", inline: false },
        { name: "/tempban", value: "Bir kullanıcıyı belirli bir süreliğine yasaklar.", inline: false },
        { name: "/massban", value: "Birden fazla kullanıcıyı aynı anda yasaklar (etiket ile).", inline: false },
        { name: "/yardım", value: "Botun tüm komutlarının listesini gösterir.", inline: false }
      )
      .setFooter({ text: `developer by: picadorso2`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
