
# Moderasyon Botu - Konfigürasyon 📜

🎉 **Tebrikler!** Moderasyon botunu kurmaya hazırsınız! Bu rehber, botunuzu doğru bir şekilde yapılandırmak için gereken adımları ve `config` dosyasını nasıl düzenleyeceğinizi anlatacak.

## 1. Token Girişi 🗝️
Botunuzun Discord API'sine bağlanabilmesi için bir **bot token'ı** gereklidir. Bu token'ı, Discord Geliştirici Portalı'ndan alabilirsiniz.

### Adımlar:
1. [Discord Geliştirici Portalı](https://discord.com/developers/applications)'na gidin.
2. Botunuz için bir uygulama oluşturun veya mevcut bir botu seçin.
3. "Bot" sekmesine tıklayın ve "Token" bölümünden bot token'ınızı alın.

**Token'ı `config.json` dosyasına eklemeyi unutmayın:**

```json
{
  "token": "BURAYA_TOKEN_IĞINIZI_YAZIN", // Bot token'ınızı buraya ekleyin.
  "prefix": "!",                         // Komutlar için kullanacağınız prefix (örn. !kick)
  "modRole": "Moderator",                // Moderatör rolü adı
  "logChannel": "mod-logs"               // Logların gönderileceği kanal adı
}
```

🔒 **Önemli:** Token'ınızı kimseyle paylaşmayın! Token'ınız güvenliği tehlikeye atabilir.

## 2. Prefix Ayarı ⚙️
Botunuzun komutlarını başlatmak için bir **prefix** kullanılır. Örneğin, `!kick` komutunu kullanmak için prefix `!` olmalıdır. `config.json` dosyasındaki `prefix` alanını istediğiniz gibi değiştirebilirsiniz.

```json
{
  "prefix": "!"  // Komutlarınız için prefix seçin (örn. "!", "$" vb.)
}
```

## 3. Moderatör Rolü Ayarı 👑
Bot, sadece **moderasyon rolüne sahip kullanıcılar** tarafından yönetilmelidir. `config.json` dosyasındaki `modRole` kısmına, moderatör rolünün adını yazın.

```json
{
  "modRole": "Moderator"  // Moderatör rolünün adını buraya yazın
}
```

## 4. Log Kanalı Ayarı 📝
Bot, gerçekleşen moderasyon işlemlerini (ban, kick, mute vb.) bir log kanalına kaydedecektir. `logChannel` alanına, logların gönderileceği kanalın adını yazın.

```json
{
  "logChannel": "mod-logs"  // Log kanalının adını buraya yazın
}
```

## 5. Botu Başlatma 🚀
Tüm ayarları yaptıktan sonra, botunuzu başlatabilirsiniz. Aşağıdaki komut ile botu çalıştırabilirsiniz:

```bash
node bot.js  // Botu başlatmak için bu komutu kullanın
```

🎉 **Botunuz Başarıyla Çalışıyor!** Artık sunucunuzda moderasyon görevlerini rahatlıkla yerine getirebilir!

## Ekstra Özellikler 🌟
Botunuza yeni özellikler eklemek için kodu özelleştirebilir veya yeni komutlar ekleyebilirsiniz. Eğer bir hata alırsanız, botunuzu debug ederek hatayı çözebilirsiniz.

💬 **Yardım İçin:** Bot komutlarına `!help` yazarak detaylı bilgi alabilirsiniz.

## Geliştirici Bilgisi 👨‍💻

- **Geliştirici:** Picadorso2
- **Proje Lisansı:** MIT

**Teşekkürler!** 🎉
