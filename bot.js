const Discord = require("discord.js");
const Browser = require('zombie');
//const client = new Discord.Client();
const config = require("./config.json");
const token = process.env.token;

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
    console.log(`${bot.user.username} está online`);
    bot.user.setActivity('Use /metar [aerodromo]');
});

bot.on('guildMemberRemove', (member) =>{
    let imgUser = member.user.avatarURL;
    const joinChannel = member.guild.channels.find('name', '⏰chat-principal⏰');
    let embedWelcome = new Discord.RichEmbed()
        .setDescription('Usuario saiu!')
        .setColor("#1c8e26")
        .setThumbnail(imgUser)
        .addField(`Infelizmente o membro saiu do servidor`, `**${member.user}**`);  
    
    joinChannel.send(embedWelcome);
});

bot.on('guildMemberAdd', (member) =>{
    let imgUser = member.user.avatarURL;
    var joinRole = member.guild.roles.find('name', 'Inativo');
    member.addRole(joinRole);
    const joinChannel = member.guild.channels.find('name', '⏰chat-principal⏰');
    let embedWelcome = new Discord.RichEmbed()
        .setDescription('Usuario entrou!')
        .setColor("#1c8e26")
        .setThumbnail(imgUser)
        .addField(`Um novo piloto acabou de pousar`, `**${member.user}**`);  
    
    joinChannel.send(embedWelcome);
    member.createDM().then(channel =>{
        channel.send(`Olá a todos, bem vindos ao Discord da Sudeste Linhas Aéreas!

        - Sinta-se á vontade para registrar-se na companhia que simula com altos padrões de qualidade, e para registrar-se, aceda o site: https://www.sudesteva.com/
        - Caso seja membro da mesma já, leia as regras e aguarde a sua conta ser ativa. Esqueci-me de algo ? R: sim, divirta-se e desfrute do que preparamos para você!
        
        REGRAS DO SERVIDOR:
        
        Olá a todos, bem vindos a este grupo Discord.
        
        ~por favor respeite as seguintes regras ...
        
        • não use comentários ofensivos.
        •respeitar as regras da companhia.
        
        .Proibido:
        
        - Pornografia; 
        - Racismo; 
        - Homofobia; 
        - enviar Link de qualquer site mais de 3 vezes a hora.
        
        •Fazer / Não fazer: 
        - Não Enganar os membros do servidor; 
        - Não divulgar sites mais de 3 vezes a hora.
        - Respeite os outros membros e administradores;
        - Não xingue desnecessariamente; 
        - Não faça com os outros o que não gostaria que fizessem com você (pense duas vezes antes de fazer alguma zueira/trollagem); 
        
        :bangbang:️:warning:️•Obrigado •:warning:️:bangbang:️
        Esperamos que você respeite as regras ...
        Obrigado e bem-vindo.`);
    }).catch(console.error);
});

metar = new Browser();

bot.on("message", async message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split (" ");
    let cmd = messageArray[0];
    var args = messageArray.slice(1);
    var msg = message.content.toUpperCase();
    
    if(cmd === `${prefix}ajuda`){
        let imageBot = "https://pngimage.net/wp-content/uploads/2018/06/icone-ajuda-png-4.png";
        let embedBot = new Discord.RichEmbed()
        .setDescription('Criado por Dogs')
        .setColor("#1c8e26")
        .setThumbnail(imageBot)
        .addField(`Comandos`, ` - /metar [Aerodromo]`);  
        return message.channel.send(embedBot);
    }
    if(cmd === `${prefix}metar`){
        if(args == ""){
            return message.channel.send("**Informe um ICAO para saber seu metar.**");
        }

        let imageBot = "https://i0.wp.com/www.clickset.com.br/wp-content/uploads/2016/04/nuvem.png";
        metar.visit("http://tgftp.nws.noaa.gov/data/observations/metar/stations/" + `${args.toString().toUpperCase()}` + ".TXT", function(){
            let embedBot = new Discord.RichEmbed()
            .setDescription('Metar de: ')
            .setColor("#1c8e26")
            .setThumbnail(imageBot)
            .addField(`${args.toString().toUpperCase()}`, `${metar.text()}`);  
            console.log(metar.text());
            return message.channel.send(embedBot);
        });
        
    }

    //Xingamentos
    if(msg.includes('FDP')){
        message.delete();
        message.channel.send(`${message.author}, enviou uma mensagem ofensiva!`)
    }
    if(msg.includes('FUDER')){
        message.delete();
        message.channel.send(`${message.author}, enviou uma mensagem ofensiva!`)
    }
});

bot.login(token);