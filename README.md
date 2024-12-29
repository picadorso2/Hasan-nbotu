
# Moderasyon Botu - Konfigürasyon 📜

🎉 **Tebrikler!** Moderasyon botunu kurmaya hazırsınız! Bu rehber, botunuzu doğru bir şekilde yapılandırmak için gereken adımları ve `config` dosyasını nasıl düzenleyeceğinizi anlatacak.

## 1. Token Girişi 🗝️
Botunuzun Discord API'sine bağlanabilmesi için bir **bot token'ı** gereklidir. Bu token'ı, Discord Geliştirici Portalı'ndan alabilirsiniz.

### Adımlar:
1. [Discord Geliştirici Portalı](https://discord.com/developers/applications)'na gidin.
2. Botunuz için bir uygulama oluşturun veya mevcut bir botu seçin.
3. "Bot" sekmesine tıklayın ve "Token" bölümünden bot token'ınızı alın.

**Token'i `config.json` dosyasına eklemeyi unutmayın:**

```json
module.exports = {
  "token": "Bot Tokeninizi buraya girmelisiniz ( config.json dosyasına gidin )"
}

```

🔒 **Önemli:** Token'ınızı kimseyle paylaşmayın! Token'ınız güvenliği tehlikeye atabilir.


## 2. Botu Başlatma 🚀
Tüm ayarları yaptıktan sonra, botunuzu başlatabilirsiniz. Aşağıdaki komut ile botu çalıştırabilirsiniz:

```bash
node index.js
```

🎉 **Botunuz Başarıyla Çalışıyor!** Artık sunucunuzda moderasyon görevlerini rahatlıkla yerine getirebilir!

## Ekstra Özellikler 🌟
Botunuza yeni özellikler eklemek için kodu özelleştirebilir veya yeni komutlar ekleyebilirsiniz. Eğer bir hata alırsanız, botunuzu debug ederek hatayı çözebilirsiniz.

💬 **Yardım İçin:** Bot komutlarına `/yardım` yazarak detaylı bilgi alabilirsiniz.

## Geliştirici Bilgisi 👨‍💻

- **Geliştirici:** Picadorso2
- **Proje Lisansı:** MIT

**Teşekkürler!** 🎉
