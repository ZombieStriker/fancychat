const fs = require("fs");
const {Vector3, Ray, rayIntersectsPrism} = require("./math.js");
const {red, orange, yellow, green, cyan, blue, magenta, white, gray, black} = require("./colors");

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

module.exports = class FancyChat {
    constructor(omegga, config, store) {
      this.config = config;
      this.store = store;
    }

    async init() {

          let {
            'chat-range': chatrange,
            'enable-chat-range': chatrangeEnabled,
            'stop-sending-exclamation': stopSendingExclamation,
            'enable-nicknames': nicknamesEnabled,
          } = this.config;

            Omegga.on("chat", async (user, message) => {
              let players = Omegga.getPlayers();
              let sender = Omegga.getPlayer(user);
              let senderpos = await sender.getPosition();

              let sentMessage = message;
              sentMessage = sentMessage
                            .replaceAll("&1","<color=\""+"f00"+"\">")
                            .replaceAll("&2","<color=\""+"f80"+"\">")
                            .replaceAll("&3","<color=\""+"ff0"+"\">")
                            .replaceAll("&4","<color=\""+"0f0"+"\">")
                            .replaceAll("&5","<color=\""+"00f"+"\">")
                            .replaceAll("&6","<color=\""+"08f"+"\">")
                            .replaceAll("&7","<color=\""+"f0f"+"\">")
                            .replaceAll("&8","<color=\""+"fff"+"\">")
                            .replaceAll("&9","<color=\""+"aaa"+"\">")
                            .replaceAll("&0","<color=\""+"000"+"\">");

              let name = await this.store.get("fc."+user+".nickname") || user;



              if(sentMessage.startsWith("!") && stopSendingExclamation){
              }else{
                let color = await this.store.get("fc."+user+".namecolor");
                if(color == null){
                  color = "929";
                }
                players.forEach(async (item, i) =>  {
                    let player = Omegga.getPlayer(item.name);
                    if(players[i].name != user){
                      if(!chatrangeEnabled || (dist(player.getPosition(),senderpos) <= chatrange)){
                          Omegga.whisper(players[i],"<b><color=\""+color+"\">"+name+":</> "+ sentMessage);
                      }
                    }
                });
              }
            });

                        Omegga.on('chatcmd:namecolor', (name, ...args) => {
                        let sender = Omegga.getPlayer(name);
                        try{
                        this.store.set("fc."+name+".namecolor",args[0]);
                          Omegga.whisper(sender,"<b><color=\""+args[0]+"\"> Changed name color to \""+args[0]+"\".</b>");
                      }catch(e){
                        Omegga.whisper(sender,"Failed to set name color to "+args[0]+": "+e);
                      }
    });

                                              Omegga.on('chatcmd:nickname', (name, ...args) => {
                                              let sender = Omegga.getPlayer(name);
                                              if(nicknamesEnabled){
                                              try{
                                                if(args[0]){
                                              this.store.set("fc."+name+".nickname",args[0]);
                                                  Omegga.whisper(sender,"<b><color=\""+"FAB"+"\"> Changed nickname to \""+args[0]+"\".</b>");
                                            }else{
                                              this.store.delete("fc."+name+".nickname");
                                                  Omegga.whisper(sender,"<b><color=\""+"FAB"+"\"> Set your nickname back to default.</b>");

                                            }
                                            }catch(e){
                                              Omegga.whisper(sender,"Failed to set name color to "+args[0]+": "+e);
                                            }
                                          }else{
                                              Omegga.whisper(sender,"Nicknames are not enabled on this server.");
                                          }
                        });
            Omegga.on('chatcmd:me', async (name, ...args) => {
              let players = Omegga.getPlayers();
              let sentMessage = args.join(' ');


              sentMessage = sentMessage
              .replaceAll("&1","<color=\""+"f00"+"\">")
              .replaceAll("&2","<color=\""+"f80"+"\">")
              .replaceAll("&3","<color=\""+"ff0"+"\">")
              .replaceAll("&4","<color=\""+"0f0"+"\">")
              .replaceAll("&5","<color=\""+"00f"+"\">")
              .replaceAll("&6","<color=\""+"08f"+"\">")
              .replaceAll("&7","<color=\""+"f0f"+"\">")
              .replaceAll("&8","<color=\""+"fff"+"\">")
              .replaceAll("&9","<color=\""+"aaa"+"\">")
              .replaceAll("&0","<color=\""+"000"+"\">")

                            let nickname = await this.store.get("fc."+name+".nickname") || name;
              for(let i = 0; i < players.length; i++){
                Omegga.whisper(players[i],"<b><color=\"b5a\">"+nickname+" "+sentMessage+"</>");
              }

            });

                        Omegga.on('chatcmd:msg', (name, ...args) => {
                          let target = undefined;
                            let players = Omegga.getPlayers();
                          for(let i = 0; i < players.length; i++){
                            if(players[i].name.toLowerCase().startsWith(args[0])){
                              target = players[i];
                              break;
                            }
                          }
                          let sentMessage = "";
                          for(let i = 1; i < args.length;i++){
                            sentMessage+=" "+args[i];
                          }
                            try{
                            Omegga.whisper(target,"<b><color=\"aaaaaa\">"+name+" sent:"+sentMessage+"</>");
                            Omegga.whisper(Omegga.getPlayer(name),"<b><color=\"aaaaaa\">To "+target.name+":"+sentMessage+"</>");
                          }catch(e){
                          Omegga.whisper(Omegga.getPlayer(name),"<b><color=\"aaaaaa\">Failed to send a message to "+args[0]+".</>");

                          }


                        });
          }

    async stop() {
    }


  // sanitize a warp name
  static cleanName(args) {
    return args.join(' ').replace(/[^a-zA-Z0-9."'!@#% -]/g, '').trim();
  }

}
