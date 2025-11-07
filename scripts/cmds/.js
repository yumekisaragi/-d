const fs = require("fs");
const path = require("path");
const commands = new Map();

fs.readdirSync(path.join(__dirname, "commands")).forEach(file => {
  if (file.endsWith(".js")) {
    const cmd = require(`./commands/${file}`);
    commands.set(cmd.name, cmd);
  }
});

module.exports = (api, event) => {
  if (!event.body || !event.body.startsWith("+")) return;
  const args = event.body.slice(1).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const command = commands.get(cmdName);
  if (command) command.execute(api, event, args);
};
