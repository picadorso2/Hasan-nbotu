const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("duyuru")
        .setDescription("Gelişmiş duyuru komutu.")
        .addChannelOption(option => 
            option.setName("kanal")
                .setDescription("Duyurunun gönderileceği kanal.")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("baslik")
                .setDescription("Duyuru başlığı.")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("mesaj")
                .setDescription("Duyuru mesajı.")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("alt_bilgi")
                .setDescription("Duyuru alt bilgisi.")
                .setRequired(false))
        .addStringOption(option => 
            option.setName("imza")
                .setDescription("Duyuru imzası.")
                .setRequired(false)),
    
    async execute(interaction) {
        const kanal = interaction.options.getChannel("kanal");
        const baslik = interaction.options.getString("baslik");
        const mesaj = interaction.options.getString("mesaj");
        const alt_bilgi = interaction.options.getString("alt_bilgi") || "Bir duyuru gönderildi!";
        const imza = interaction.options.getString("imza") || interaction.user.tag;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: "🚫 | Duyuru gönderme yetkiniz yok!", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle(`📢 ${baslik}`)
            .setDescription(mesaj)
            .setFooter({ text: imza, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        if (alt_bilgi) embed.setAuthor({ name: alt_bilgi });

        const onayRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("onayla_duyuru")
                .setLabel("Duyuruyu Gönder")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("reddet_duyuru")
                .setLabel("İptal Et")
                .setStyle(ButtonStyle.Danger)
        );

        const onayMesaji = await interaction.reply({
            content: "Duyuruyu göndermek istediğinizden emin misiniz?",
            embeds: [embed],
            components: [onayRow],
            ephemeral: true
        });

        const filter = (i) => i.user.id === interaction.user.id;
        const collector = onayMesaji.createMessageComponentCollector({ filter, time: 60000, max: 1 });

        collector.on("collect", async (i) => {
            if (i.customId === "onayla_duyuru") {
                try {
                    await kanal.send({ embeds: [embed] });
                    await i.update({ content: "✅ | Duyuru başarıyla gönderildi!", components: [] });
                } catch {
                    await i.update({ content: "❌ | Duyuru gönderilemedi. Lütfen kanalı kontrol edin.", components: [] });
                }
            } else if (i.customId === "reddet_duyuru") {
                await i.update({ content: "❌ | Duyuru gönderimi iptal edildi.", components: [] });
            }
        });

        collector.on("end", (collected, reason) => {
            if (reason !== "limit") {
                onayMesaji.edit({ components: [] });
            }
        });
    },
};
