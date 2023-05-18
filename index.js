const Discord = require('discord.js-selfbot-v13')
const client = new Discord.Client({
  checkUpdate: false
})
const config = require('./config.json')
const backup = require('discord-backup')
const c = require('gradient-string')
const q = require('readline-sync')
const fs = require('fs')

if (!fs.existsSync("./backups")) fs.mkdirSync("./backups")
if (!fs.existsSync("./emotes")) fs.mkdirSync("./emotes")

backup.setStorageFolder(__dirname + "/backups/");

const language = (fr, en) => {
  switch (config.language) {
    case "en":
      return en
    case "fr":
      return fr
    default:
      return en
  }
}

const color = () => {
  switch(config.color){
    case "blue":
      return ["#3c00ff", "#07d6fa"]
    case "green":
      return ["#4dff00", "#00ff88"]
    case "pink":
      return ["#f5008f", "#f500dc"]
    case "red":
      return ["#f50018", "#f54e00"]
    case "cyan":
      return ["#00f59b", "#00f5e5", "#00f5e5"]
    case "orange":
      return ["#f54e00", "#f59f00"]
    case "yellow":
      return ["#f5cc00", "#d4f500"]
    default :
      return ["#3c00ff", "#07d6fa"]
  }
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const makeid = (length) => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return result;
}

client.login(config.token || process.env.token)

const main = async () => {
  console.clear()
  console.log(c(color())(`
      ██████╗  █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗     ████████╗ ██████╗  ██████╗ ██╗         ██╗   ██╗██████╗ 
      ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗    ╚══██╔══╝██╔═══██╗██╔═══██╗██║         ██║   ██║╚════██╗
      ██████╔╝███████║██║     █████╔╝ ██║   ██║██████╔╝       ██║   ██║   ██║██║   ██║██║         ██║   ██║ █████╔╝
      ██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝        ██║   ██║   ██║██║   ██║██║         ╚██╗ ██╔╝██╔═══╝ 
      ██████╔╝██║  ██║╚██████╗██║  ██╗╚██████╔╝██║            ██║   ╚██████╔╝╚██████╔╝███████╗     ╚████╔╝ ███████╗
      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝            ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝      ╚═══╝  ╚══════╝`))
  console.log(c(color().reverse())("========================================================================================================================"))
  console.log(c(color())(`
                                      [1] - ${language("Créé Une Backup", "Create A Backup")}
                                      [2] - ${language("Créé Une Backup (Sans Chargement)", "Create A Backup (Without Loading)")}
                                      [3] - ${language("Créé Une Backup Des Emotes", "Create A Backup Of Emotes")}
                                      [4] - ${language("Créé Une Backup (Avec les Messages)", "Create A Backup (With Messages)")}
                                      [5] - ${language("Charger une Backup", "Load A Backup")}
                                      [6] - ${language("Supprime Les Tickets (Par nom)", "Delete Tickets (Delete By Name)")}
                                      [7] - ${language("Supprime Les Tickets (d'une Categorie)", "Delete Tickets (Delete From Category)")}
                                      [8] - ${language("Créé Un Modèle (Besoin de Permissions)", "Create A Template (need permissions)")}
                                      [9] - ${language("Affiche La Liste Des Backups", "See The List Of Backups")}
                                      [0] - ${language("Fermer", "Exit")}`))
  const choix = q.question(c(color())(language("Quel est votre Choix ? : ", "What's your Choice ? : ")))

  switch (parseInt(choix)) {
    default:
      console.log(c(color())("Missclick ??"))
      sleep(2000)
        .then(() => main())
      break

    case 1: {
      const askguild = q.question(c(color())(language("Veuillez me donner l'ID du serveur : ", "Give me the ID of the guild : ")))
      const guild = client.guilds.cache.get(askguild)
      if (!guild) {
        console.log(c(color())(language("Serveur non trouvé", "Guild not found")))
        await sleep(2000)
        return main()
      }
      console.log(c(color())(language("Création de la backup en cours...", "Creation of the current backup...")))
      const bkp = await backup.create(guild, {
        maxMessagesPerChannel: 0,
        jsonSave: true,
        jsonBeautify: true,
        doNotBackup: ["emojis", "bans"]
      });
      const newguild = await client.guilds.create("Backup Tool V2")
      console.log(c(color())(language("Chargement de la backup en cours...", 'Loading the current backup...')))
      let cc = 0
      bkp.channels.categories.forEach((c) => c.children.forEach(() => cc = cc + 1))
      bkp.channels.others.forEach(() => cc = cc + 1)
      backup.load(bkp.id, newguild)
      setTimeout(async () => {
        console.log(c(color())(language("Chargement terminé", "Loading finished")))
        await sleep(5000)
        return main()
      }, cc * 1000 + 12 * 1000);
      break;
    }

    case 2: {
      const askguild = q.question(c(color())(language("Veuillez me donner l'ID du serveur : ", "Give me the ID of the guild : ")))
      const guild = client.guilds.cache.get(askguild)
      if (!guild) {
        console.log(c(color())(language("Serveur non trouvé", "Guild not found")))
        await sleep(2000)
        return main()
      }
      console.log(c(color())(language("Création de la backup en cours...", "Creation of the current backup...")))
      const bkp = await backup.create(guild, {
        maxMessagesPerChannel: 0,
        jsonSave: true,
        jsonBeautify: true,
        doNotBackup: ["emojis", "bans"]
      });
      console.log(c(color())(language(`Voici l'ID de votre backup: ${bkp.id}`, `That's the ID of your backup: ${bkp.id}`)))
      q.question(c(color())(language("Appuyez sur espace pour continuer...", "Press the space button for continue")))
      main()
      break
    }

    case 3: {
      const askguild = q.question(c(color())(language("Veuillez me donner l'ID du serveur : ", "Give me the ID of the guild : ")))
      const guild = client.guilds.cache.get(askguild)
      if (!guild) {
        console.log(c(color())(language("Serveur non trouvé", "Guild not found")))
        await sleep(2000)
        return main()
      }

      let backupid = makeid(16)
      const er = new Array()

      guild.emojis.cache.forEach(e => er.push(`"${e.toString()}"`))

      if (!fs.existsSync(`./emotes/${backupid}.json`)) fs.writeFileSync(`./emotes/${backupid}.json`, `{\n        "emojis": [${er}],\n        "name": "${guild.name}",\n        "code": "${backupid}",\n        "size": "${guild.emojis.cache.size}"\n}`)
      console.log(c(color())(language(`Voici l'ID de la backup d'emotes: ${backupid}`, `That's the ID of the emote backup: ${backupid}`)))
      q.question(c(color())(language("Appuyez sur espace pour continuer...", "Press the space button for continue")))
      main()
      break
    }

    case 4: {
      const askguild = q.question(c(color())(language("Veuillez me donner l'ID du serveur : ", "Give me the ID of the guild : ")))
      const guild = client.guilds.cache.get(askguild)
      if (!guild) {
        console.log(c(color())(language("Serveur non trouvé", "Guild not found")))
        await sleep(2000)
        return main()
      }
      console.log(c(color())(language("Création de la backup en cours...", "Creation of the current backup...")))
      const bkp = await backup.create(guild, {
        maxMessagesPerChannel: 10,
        jsonSave: true,
        jsonBeautify: true,
        doNotBackup: ["emojis", "bans"],
        saveImages: "base64"
      });
      const newguild = await client.guilds.create("Backup Tool V2")
      console.log(c(color())(language("Chargement de la backup en cours...", 'Loading the current backup...')))
      let cc = 0
      bkp.channels.categories.forEach((c) => c.children.forEach(() => cc = cc + 1))
      bkp.channels.others.forEach(() => cc = cc + 1)
      backup.load(bkp.id, newguild)
      setTimeout(async () => {
        console.log(c(color())(language("Chargement terminé", "Loading finished")))
        await sleep(5000)
        return main()
      }, cc * 1000 + 12 * 1000);
      break;
    }

    case 5: {

      const bkpid = q.question(c(color())(language("Veuillez me donner l'ID de la Backup : ", "Give me the ID of the Backup : ")))
      const askguild = q.question(c(color())(language("Veuillez me donner l'ID du serveur : ", "Give me the ID of the guild : ")))
      const guild = client.guilds.cache.get(askguild)
      if (!guild) {
        console.log(c(color())(language("Serveur non trouvé", "Guild not found")))
        await sleep(2000)
        return main()
      }
      if (fs.existsSync(`./emotes/${bkpid}.json`)) {
        if (!guild.members.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
          console.log(c(color())(language("Il vous faut la permissions MANAGE_EMOJIS", "You need the MANAGE_EMOJIS permissions")))
          await sleep(2000)
          return main()
        }
        let cc = 1
        const data = require(`./emotes/${bkpid}.json`)
        await data.emojis.forEach(async emote => {
          let emoji = Discord.Util.parseEmoji(emote);
          if (emoji.id) {
            const Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`;
            guild.emojis
              .create(`${Link}`, `${`${emoji.name}`}`)
              .then(() => {
                console.log(c(color())(language(`[${cc + "/" + data.size}] ${emoji.name} créé`, `[EMOTE] ${emoji.name} created`)));
                cc = cc + 1
              })
              .catch((err) => {
                console.log(c(color())(`[ERR] ${err}`));
                cc = cc + 1
              })
            if (cc === data.size) {
              console.log(c(color())(language("Les emotes ont été créés", "The emotes has been created")))
              await sleep(3000)
              main()
            }
          }
        })
      } else if (backup.fetch(bkpid)) {
        if (!guild.members.me.permissions.has("ADMINISTRATOR")) {
          console.log(c(color())(language("Il vous faut la permissions ADMINISTRATEUR", "You need the ADMINITRATOR permissions")))
          await sleep(2000)
          return main()
        }
        const bkpp = await backup.fetch(bkpid)
        let cc = 0
        bkpp.data.channels.categories.forEach((c) => c.children.forEach(() => cc = cc + 1))
        bkpp.data.channels.others.forEach(() => cc = cc + 1)
        backup.load(bkpp.id, guild)
        setTimeout(async () => {
          console.log(c(color())(language("Chargement terminé", "Loading finished")))
          await sleep(5000)
          return main()
        }, cc * 1000 + 12 * 1000);
      } else {
        console.log(c(color())(language("Aucune backup de trouvée", "No backup found")))
        await sleep(2000)
        main()
      }
      break
    }

    case 6: {
      const askguild = q.question(c(color())(language("Veuillez me donner l'ID du serveur : ", "Give me the ID of the guild : ")))
      const guild = client.guilds.cache.get(askguild)
      if (!guild) {
        console.log(c(color())(language("Serveur non trouvé", "Guild not found")))
        await sleep(2000)
        return main()
      }
      if (!guild.members.me.permissions.has("MANAGE_CHANNELS")) {
        console.log(c(color())(language("Vous n'avez pas les permissions nécessaires: Gérer Les Salons", "You didn't have the permissions Manage Channels")))
        await sleep(2000)
        return main()
      }
      const name = q.question(c(color())(language("Quel est le nom des salons a supprimer (ex: ticket-) : ", "What's the name of channels to be deleted (ex: ticket-) : ")))
      if (!name) {
        console.log(c(color())(language("Veuillez me donner un nom valide", "Give me a valid name")))
        await sleep(2000)
        return main()
      }
      let del = 1
      const num = guild.channels.cache.filter(c => c.name.includes(name)).size
      if (num === 0) {
        console.log(c(color())(language("Aucun salon a supprimer de trouvé", "No channel to delete found")))
        await sleep(2000)
        main()
      }
      guild.channels.cache
        .filter(ch => ch.name.includes(name))
        .forEach(ch => ch.delete()
          .then(async () => {
            console.log(c(color())(language(`[${del}/${num}] Le salon ${ch.name} a été supprimé`, `[${del}/${num}] The channel ${ch.name} has been deleted`)))
            del = del + 1
            if (del === num) {
              await sleep(2000)
              return main()
            }
          })
          .catch(async () => {
            console.log(c("#07d6fa", "#3c00ff")(language(`[${del}/${num}] Le salon ${ch.name} n'a pas pu être supprimé`, `[${del}/${num}] The channel ${ch.name} cannot be delete`)))
            del = del + 1
            if (del === num) {
              await sleep(2000)
              return main()
            }
          })
        )
      break
    }

    case 7: {
      const cat = q.question(c(color())(language("Quel est l'ID de la categorie : ", "What's the ID of the category : ")))
      const channel = client.channels.cache.get(cat)
      if (!channel || channel.type !== "GUILD_CATEGORY") {
        console.log(c(color())(language("Aucune catégorie de trouvée", "No category found")))
        await sleep(2000)
        return main()
      }
      if (!channel.guild.members.me.permissions.has("MANAGE_CHANNELS")) {
        console.log(c(color())(language("Vous n'avez pas les permissions nécessaires: Gérer Les Salons", "You didn't have the permissions Manage Channels")))
        await sleep(2000)
        return main()
      }
      if (!channel.children) {
        console.log(c(color())(language("Cette catégorie ne contient pas de salon", "This category don't have any channel")))
        await sleep(2000)
        return main()
      }
      let del = 1
      let num = 0
      channel.children.forEach(() => num = num + 1)

      channel.children.forEach(ch => ch.delete()
        .then(async () => {
          console.log(c(color())(language(`[${del}/${num}] Le salon ${ch.name} a été supprimé`, `[${del}/${num}] The channel ${ch.name} has been deleted`)))
          del = del + 1
          if (del === num) {
            await sleep(2000)
            return main()
          }
        })
        .catch(async () => {
          console.log(c("#07d6fa", "#3c00ff")(language(`[${del}/${num}] Le salon ${ch.name} n'a pas pu être supprimé`, `[${del}/${num}] The channel ${ch.name} cannot be delete`)))
          del = del + 1
          if (del === num) {
            await sleep(2000)
            return main()
          }
        })
      )
      break
    }

    case 8: {
      const askguild = q.question(c(color())(language("Veuillez me donner l'ID du serveur : ", "Give me the ID of the guild : ")))
      const guild = client.guilds.cache.get(askguild)
      if (!guild) {
        console.log(c(color())(language("Serveur non trouvé", "Guild not found")))
        await sleep(2000)
        return main()
      }
      if (!guild.members.me.permissions.has("MANAGE_GUILD")) {
        console.log(c(color())(language("Vous n'avez pas les permissions nécessaires: Gérer Le Serveur", "You didn't have the permissions Manage Guild")))
        await sleep(2000)
        return main()
      }
      const ask = () => {
        q.question(c(color())(language("Appuyez sur espace pour continuer...", "Press the space button for continue")))
        return main()
      }
      guild.createTemplate(`${guild.name}`, `Backup Tool V2`)
        .then((l) => {
          console.log(c(color())(l.url))
          ask()
        })
        .catch(() => {
          guild.fetchTemplates()
            .then(l => {
              console.log(c(color())(`https://discord.new/${l.first()}`))
              ask()
            })
            .catch((err) => {
              console.log(c(color())(`[ERR] ${err}`))
              ask()
            })
        })
      break
    }

    case 9: {
      backup.list().then(async (backups) => {

        let backupFetched = [];
        for (let i = 0; i < backups.length; i++) {
          const fetchingBackup = await backup.fetch(backups[i])
          backupFetched.push(fetchingBackup)
        }

        const backupInfos = (await Promise.all(backupFetched.sort(function(a, b) {
          return a.data.name.localeCompare(b.data.name)
        }).map((e, i) => `${e.data.name}\` ➜ ${e.id}`))).join('\n')

        console.log(c(color())(`${backupInfos.length > 0 ? backupInfos : language("Aucune backup", "No Backup")}`))

        let backupemotes = []
        const emotes = fs.readdirSync(`./emotes/`).filter(files => files.endsWith(".json"));
        for (const file of emotes) {
          const cont = require(`./emotes/${file}`)
          backupemotes.push(`${cont.name} ➜ ${cont.code}`)
        }

        console.log(c(color(), color())("========================================================================================================================"))
        console.log(c(color())(`${backupemotes.length > 0 ? backupemotes : language("Aucune backup d'emoji", "No Emoji's Backup")}`))
        console.log("\n")
        q.question(c(color())(language("Appuyez sur espace pour continuer...", "Press the space button for continue")))
        return main()

      })
      break
    }


    // case 0:
    // process.exit()
  }
}


client.once('ready', () => main())