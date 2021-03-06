const { Event } = require("klasa");

class GuildMemberAdd extends Event {
  
  run(member) {
    this.client.emit("modlogs", member.guild, "memberJoin", { member, name: "join" });
    const guild = member.guild;
    if(!guild.settings.welcome.enabled || !guild.settings.welcome.message || !guild.settings.welcome.channel || !guild.channels.get(guild.settings.welcome.channel) || !guild.channels.get(guild.settings.welcome.channel).postable) return;
    
    const channel = guild.channels.get(guild.settings.welcome.channel);
    
    const msg = guild.settings.welcome.message
      .replace(/{mention}/ig, `<@${member.id}>`)
      .replace(/{user}/ig, `<@${member.id}>`)
      .replace(/{guild}/ig, guild.name)
      .replace(/{server}/ig, guild.name)
      .replace(/{name}/ig, member.displayName)
      .replace(/{count}/ig, guild.memberCount);
      
    channel.send(msg).catch(() => null);
  }
  
  async init() {
    const { schema } = this.client.gateways.guilds;
    if(!schema.has("welcome")) await schema.add("welcome", {
      message: { type: "string" },
      channel: { type: "channel" },
      enabled: { type: "boolean" }
    });
  }
}

module.exports = GuildMemberAdd;