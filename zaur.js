const Discord = require("discord.js")
const client = new Discord.Client();
const db = require('quick.db')
const moment = require('moment')
require("moment-duration-format")
moment.locale("tr")

client.zaurr = {
token: "",//bot tokeni
prefix: "",//bot prefixi
sahip: "",//sahip id
mesaj: "",//.tag gibi ekleye bilirsiniz
cevap: "",//yukaridakini yazdiginizda gelen cevap
sunucuid: "",//sunucu id
kayitkanal: "",//kayit kanal id
chat: "",//chat kanal id
vip: "",//vip rol id
erkek: "",//erkek rol id
kiz: "",//kiz rol id
kayitsiz: "",//kayitsiz rol id
durum: "",//bot oynuyor kisimi
kayitci: "",//kayit sorumlusu rol id
tag: "",//tag
ekiprol: "",//tag aldiginda verilecek rol id
log: "",//tag alinca gonderilecek kanal id
footer: ""//embedin altina eklenecek yazi
}


client.on('ready', () => {
  client.user.setActivity(client.zaurr.durum)
  console.log(`${client.user.tag} Bot Hazır!`);
});


client.on('message', msg => {
  if (msg.content === client.zaurr.mesaj) {
    msg.channel.send(client.zaurr.cevap);
  }
});

client.on('guildMemberAdd', async zaur => {
zaur.setNickname(`Isim | Yaş`);
zaur.roles.add(client.zaurr.kayitsiz)
let kanal = client.channels.cache.get(client.zaurr.kayitkanal)
const zaurembed = new Discord.MessageEmbed()
.setTitle(zaur.guild.name)
.setColor("RANDOM")
.setDescription(`
  ${zaur} Sunucumuza hoş geldin seninle beraber **${zaur.guild.memberCount}** kişiye ulaştık.
  
  Hesabın kuruluş tarihi: **${moment(zaur.user.createdAt).format('DD/MM/YYYY | HH:mm:ss')}**
  
  Bu Hesap **__${new Date().getTime() - zaur.user.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000 ? "Şüpheli" : "Güvenilir"}__**

  Ses teyite gelerek kaydınızı yaptırabilirsiniz. <@&${client.zaurr.kayitci}> sizinle ilgilenecektir.
  `)
kanal.send(zaurembed)
});

client.on("userUpdate", async (oldUser, newUser) => {
if (oldUser.username !== newUser.username) {
const tag = (client.zaurr.tag)
const tag2 = (client.zaurr.tag2)
const sunucu = (client.zaurr.sunucuid)
const kanal = (client.zaurr.log)
const rol = (client.zaurr.ekiprol)
if (newUser.username.includes(tag) && !client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) {
await client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setColor("GREEN").setDescription(`${newUser} ${tag} Tagımızı Aldığı İçin Ekip Rolünü Verdim`));
await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).setNickname(newUser.displayName.replace(tag));
await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.add(rol);
await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).send(`${newUser.username}, Sunucumuzda Tagımızı Aldığın İçin Ekip Rolünü Sana Verdim!`)
}
if (!newUser.username.includes(tag) && client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) {
await client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setColor("RED").setDescription(`${newUser} ${tag} Tagımızı Çıkardığı İçin Ekip Rolünü Aldım`));
await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).setNickname(newUser.displayName.replace(tag2));
await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.remove(rol);
await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).send(`**${newUser.username}**, Sunucumuzda ${tag} Tagımızı Çıkardığın İçin Ekip olünü Senden Aldım!`)
 }
}
});

client.on("message", async zaurcuk => {
if (!zaurcuk.content.startsWith(client.zaurr.prefix) || 
!zaurcuk.member.roles.cache.has(client.zaurr.kayitci) || 
zaurcuk.author.bot) return;
const args = zaurcuk.content.slice(client.zaurr.prefix.length).split(' ');
const command = args.shift().toLowerCase();
if (command == "e" || command == "erkek") {
const zaur = zaurcuk.mentions.members.first() || zaurcuk.guild.members.cache.get(args[0]) 
const zaur1 = args[1] 
const zaur2 = args[2] 
if (!zaur) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`Bir kullanıcı belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
if (!zaur1) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`İsim belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
if (!zaur2) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`Yaş belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
zaurcuk.react(`✅`)
zaur.setNickname(`${zaur1} | ${zaur2}`)
await zaur.roles.add(client.zaurr.erkek)
await zaur.roles.remove(client.zaurr.kayitsiz)
await db.add(`kullanici.${zaurcuk.author.id}.erkek`, 1)
zaurcuk.guild.channels.cache.get(client.zaurr.chat).send(new Discord.MessageEmbed().setDescription(`${zaur} Aramıza katıldı. Sunucumuz şuanda **${zaurcuk.guild.memberCount}** kişi!`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
}
if (command == "i" || command == "istatistik") {
const erkek = db.get(`kullanici.${zaurcuk.author.id}.erkek`) || 0
const kiz = db.get(`kullanici.${zaurcuk.author.id}.kiz`) || 0
let sayi = erkek + kiz
const embed = new Discord.MessageEmbed()
.setAuthor(`${zaurcuk.author.username}`)
.setThumbnail(zaurcuk.author.avatarURL({dynamic: true}))
.setDescription(`${erkek} Erkek Kayıt Edilmiştir.\n\n${kiz} Kadın Kayıt Edilmiştir.\n\nToplamda ${sayi} Kişi Kayıt Edilmiştir`)
.setFooter(client.zaurr.footer)
.setColor('RANDOM')
zaurcuk.channel.send(embed);
}
if (command == "k" || command == "kadın") {
const zaur = zaurcuk.mentions.members.first() || zaurcuk.guild.members.cache.get(args[0]) 
const zaur1 = args[1] 
const zaur2 = args[2] 
if (!zaur) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`Bir kullanıcı belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
if (!zaur1) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`İsim belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
if (!zaur2) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`Yaş belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
zaurcuk.react(`✅`)
zaur.setNickname(`${zaur1} | ${zaur2}`)
await zaur.roles.add(client.zaurr.kiz)
await zaur.roles.remove(client.zaurr.kayitsiz)
await db.add(`kullanici.${zaurcuk.author.id}.kiz`, 1)
zaurcuk.guild.channels.cache.get(client.zaurr.chat).send(new Discord.MessageEmbed().setDescription(`${zaur} Aramıza katıldı. Sunucumuz şuanda **${zaurcuk.guild.memberCount}** kişi!`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
}
if (command == "v" || command == "vip") {
const zaur = zaurcuk.mentions.members.first() || zaurcuk.guild.members.cache.get(args[0]) 
if (!zaur) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`Bir kullanıcı belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
zaurcuk.react(`✅`)
await zaur.roles.add(client.zaurr.vip)
}
if (command == "isim") {
const zaur = zaurcuk.mentions.members.first() || zaurcuk.guild.members.cache.get(args[0]) 
const zaur1 = args[1] 
const zaur2 = args[2] 
if (!zaur) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`Bir kullanıcı belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
if (!zaur1) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`İsim belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
if (!zaur2) return zaurcuk.channel.send(new Discord.MessageEmbed().setDescription(`Yaş belirtmelisin.`).setFooter(client.zaurr.footer).setColor("RANDOM").setTimestamp());
zaurcuk.react(`✅`)
zaur.setNickname(`${zaur1} | ${zaur2}`)
}
if (command == "sil" || command == "temizle") {
if(!args[0]) return zaurcuk.channel.send("Silinicek Mesaj Miktarını Belirtin.");
zaurcuk.channel.bulkDelete(args[0])
} })

client.login(client.zaurr.token);
