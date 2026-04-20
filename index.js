const WEBHOOK_URL = "https://discord.com/api/webhooks/1495813218583707772/Sn3aGFYXJmzA9cgW2-gkxYIRk1LldEgpj1jScILX11n4DU5KDogN_KBLQEshAE1ftzmL"; // Cola aqui a URL do seu webhook
const CHECK_INTERVAL = 5 * 60 * 1000; // Checa a cada 5 minutos

const PLATFORMS = {
  Android: "https://clientsettingscdn.roblox.com/v2/client-version/AndroidApp",
  iOS: "https://clientsettingscdn.roblox.com/v2/client-version/iOSApp",
};

const lastVersions = {};

async function checkVersion(platform, url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const version = data.clientVersionUpload;

    if (lastVersions[platform] && lastVersions[platform] !== version) {
      console.log(`[${platform}] Nova versão detectada: ${version}`);
      await sendWebhook(platform, lastVersions[platform], version);
    }

    lastVersions[platform] = version;
    console.log(`[${platform}] Versão atual: ${version}`);
  } catch (err) {
    console.error(`[${platform}] Erro ao checar versão:`, err.message);
  }
}

async function sendWebhook(platform, oldVersion, newVersion) {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: `🎮 Roblox ${platform} Atualizado!`,
            description: "Uma nova versão do Roblox mobile foi lançada!",
            color: platform === "Android" ? 0x3ddc84 : 0xa0a0a0,
            fields: [
              { name: "📦 Versão Anterior", value: `\`${oldVersion}\``, inline: true },
              { name: "✅ Nova Versão", value: `\`${newVersion}\``, inline: true },
            ],
            thumbnail: {
              url: "https://logodownload.org/wp-content/uploads/2017/09/roblox-logo.png",
            },
            timestamp: new Date().toISOString(),
            footer: { text: "Roblox Update Tracker • Atualização detectada" },
          },
        ],
      }),
    });
    console.log(`[${platform}] Webhook enviado com sucesso!`);
  } catch (err) {
    console.error(`[${platform}] Erro ao enviar webhook:`, err.message);
  }
}

async function main() {
  console.log("🔍 Monitorando atualizações do Roblox Mobile...");
  
  // Checa imediatamente ao iniciar
  for (const [platform, url] of Object.entries(PLATFORMS)) {
    await checkVersion(platform, url);
  }

  // Continua checando a cada 5 minutos
  setInterval(async () => {
    for (const [platform, url] of Object.entries(PLATFORMS)) {
      await checkVersion(platform, url);
    }
  }, CHECK_INTERVAL);
}

main();
