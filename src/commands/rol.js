const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rol")
    .setDescription("Bir kullanıcıya rol ver veya rol al.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(subcommand =>
      subcommand
        .setName("ver")
        .setDescription("Bir kullanıcıya rol verir.")
        .addUserOption(option =>
          option
            .setName("kullanıcı")
            .setDescription("Rol verilecek kullanıcıyı seçin.")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rol")
            .setDescription("Verilecek rolü seçin.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("al")
        .setDescription("Bir kullanıcıdan rol alır.")
        .addUserOption(option =>
          option
            .setName("kullanıcı")
            .setDescription("Rol alınacak kullanıcıyı seçin.")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rol")
            .setDescription("Alınacak rolü seçin.")
            .setRequired(true)
        )
    ),
  run: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser("kullanıcı");
    const role = interaction.options.getRole("rol");
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setFooter({ text: `Komut kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      embed
        .setColor("Red")
        .setTitle("❌ Yetki Hatası")
        .setDescription("Bu komutu kullanmak için `Rolleri Yönet` yetkisine sahip olmalısınız.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member) {
      embed
        .setColor("Red")
        .setTitle("❌ Hata")
        .setDescription("Belirttiğiniz kullanıcı bu sunucuda bulunamadı.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.member.roles.highest.position <= role.position) {
      embed
        .setColor("Red")
        .setTitle("❌ Yetki Hatası")
        .setDescription("Bu rolü yönetmek için yeterli yetkiye sahip değilsiniz.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.guild.members.me.roles.highest.position > role.position) {
      embed
        .setColor("Red")
        .setTitle("❌ Bot Yetki Hatası")
        .setDescription("Bu rolü yönetmek için botun yetkisi yetersiz.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (subcommand === "ver") {
      if (member.roles.cache.has(role.id)) {
        embed
          .setColor("Orange")
          .setTitle("⚠️ Kullanıcı Zaten Role Sahip")
          .setDescription(`${user.tag} zaten bu role sahip.`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await member.roles.add(role);

      embed
        .setColor("Green")
        .setTitle("✅ Rol Verildi")
        .setDescription(`${user.tag} kullanıcısına başarıyla ${role.name} rolü verildi.`)
        .addFields(
          { name: "Kullanıcı", value: user.tag, inline: true },
          { name: "Verilen Rol", value: role.name, inline: true },
          { name: "Yetkili", value: interaction.user.tag, inline: true }
        );

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === "al") {
      if (!member.roles.cache.has(role.id)) {
        embed
          .setColor("Orange")
          .setTitle("⚠️ Kullanıcı Role Sahip Değil")
          .setDescription(`${user.tag} bu role sahip değil.`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await member.roles.remove(role);

      embed
        .setColor("Green")
        .setTitle("✅ Rol Alındı")
        .setDescription(`${user.tag} kullanıcısından başarıyla ${role.name} rolü alındı.`)
        .addFields(
          { name: "Kullanıcı", value: user.tag, inline: true },
          { name: "Alınan Rol", value: role.name, inline: true },
          { name: "Yetkili", value: interaction.user.tag, inline: true }
        );

      return interaction.reply({ embeds: [embed] });
    }
  },
};
