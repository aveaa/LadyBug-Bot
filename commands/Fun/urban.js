const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

class Urban extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search a term in urban dictionary!",
      cooldown: 5,
      runIn: ["text"],
      aliases: ["ud", "urbandictionary"],
      usage: "<term:string>",
      requiredPermissions: ["MANAGE_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"]
    });
  }
  
  async run(msg, [term]) {
    if(!msg.channel.nsfw) throw "You can use urban in nsfw channels only! sorry but it has inappropriate words, which could be against Discord ToS (Terms of Services).";
    
    const res = await superagent.get(`https://api.urbandictionary.com/v0/define?term=${term}`).catch(() => null);
    if(!res) throw "Something went wrong with urban, try again later.";
    
    const display = new RichDisplay(
      new MessageEmbed()
        .setTitle("Urban Dictionary")
        .setColor(0xff0000)
    );
    
    for(const data of res.body.list) {
      display.addPage((em) => em.setDescription(`${data.definition}\n\n*${data.example}*\n\n**Votes**\n:thumbsup: ${data.thumbs_up} :thumbsdown: ${data.thumbs_down}`));  
    }
    
    return display.run(await msg.send("Loading urban..."), { filter: (reaction, user) => user.id === msg.author.id });
  }
}

module.exports = Urban;
