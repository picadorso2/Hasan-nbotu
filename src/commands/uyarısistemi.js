const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uyarılar")
    .setDescription("Kullanıcıların uyarılarını yönetmenizi sağlar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(subcommand =>
      subcommand
        .setName("ekle")
        .setDescription("Belirtilen kullanıcıya uyarı ekler.")
        .addUserOption(option =>
          option
            .setName("kullanıcı")
            .setDescription("Uyarı eklemek istediğiniz kullanıcıyı seçin.")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("sebep")
            .setDescription("Uyarı sebebini belirtin.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("sil")
        .setDescription("Belirtilen kullanıcının bir uyarısını siler.")
        .addUserOption(option =>
          option
            .setName("kullanıcı")
            .setDescription("Uyarısını silmek istediğiniz kullanıcıyı seçin.")
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName("sayı")
            .setDescription("Hangi uyarıyı silmek istediğinizi belirtin.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("liste")
        .setDescription("Belirtilen kullanıcının tüm uyarılarını listeler.")
        .addUserOption(option =>
          option
            .setName("kullanıcı")
            .setDescription("Uyarılarını listelemek istediğiniz kullanıcıyı seçin.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("kontrol")
        .setDescription("Belirtilen kullanıcının uyarı sayısını kontrol eder.")
        .addUserOption(option =>
          option
            .setName("kullanıcı")
            .setDescription("Uyarı sayısını kontrol etmek istediğiniz kullanıcıyı seçin.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("benim")
        .setDescription("Kendi uyarılarınızı kontrol eder.")
    ),
  
  run: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "ekle") {
      const user = interaction.options.getUser("kullanıcı");
      const reason = interaction.options.getString("sebep");
      const warns = db.get(`warns_${interaction.guild.id}_${user.id}`) || [];
      warns.push(reason);
      db.set(`warns_${interaction.guild.id}_${user.id}`, warns);

      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("⚠️ Uyarı Eklendi")
        .setDescription(`${user.tag} kullanıcısına **${reason}** sebebiyle bir uyarı eklendi.`)
        .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
      interaction.reply({ embeds: [embed] });

    } else if (subcommand === "sil") {
      const user = interaction.options.getUser("kullanıcı");
      const warnIndex = interaction.options.getInteger("sayı") - 1;
      const warns = db.get(`warns_${interaction.guild.id}_${user.id}`) || [];

      if (warns.length < warnIndex + 1 || warnIndex < 0) {
        return interaction.reply({ content: "Belirtilen uyarı bulunamadı.", ephemeral: true });
      }

      warns.splice(warnIndex, 1);
      db.set(`warns_${interaction.guild.id}_${user.id}`, warns);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🛑 Uyarı Silindi")
        .setDescription(`${user.tag} kullanıcısının ${warnIndex + 1}. uyarısı başarıyla silindi.`)
        .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
      interaction.reply({ embeds: [embed] });

    } else if (subcommand === "liste") {
      const user = interaction.options.getUser("kullanıcı");
      const warns = db.get(`warns_${interaction.guild.id}_${user.id}`) || [];
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("📜 Kullanıcı Uyarıları")
        .setDescription(`${user.tag} kullanıcısının uyarıları:`)
        .addFields({ name: "Uyarılar", value: warns.length > 0 ? warns.map((warn, index) => `**${index + 1}.** ${warn}`).join("\n") : "Hiçbir uyarı bulunmamaktadır." })
        .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
      interaction.reply({ embeds: [embed] });

    } else if (subcommand === "kontrol") {
      const user = interaction.options.getUser("kullanıcı");
      const warns = db.get(`warns_${interaction.guild.id}_${user.id}`) || [];
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("📊 Kullanıcı Uyarı Durumu")
        .setDescription(`${user.tag} kullanıcısının toplam uyarı sayısı: **${warns.length}**`)
        .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
      interaction.reply({ embeds: [embed] });

    } else if (subcommand === "benim") {
      const user = interaction.user;
      const warns = db.get(`warns_${interaction.guild.id}_${user.id}`) || [];
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("📊 Kendi Uyarı Durumunuz")
        .setDescription(`Kendi uyarılarınız: **${warns.length}**`)
        .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    }
  },
};
