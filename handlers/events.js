const { readdirSync } = require("fs");

const ascii = require("ascii-table");

let table = new ascii("Events");
table.setHeading("Events", "Load status");

module.exports = (client) => {
    readdirSync("./events/").forEach(dir => {
        const events = readdirSync(`./events/`).filter(file => file.endsWith(".js"));
    
        for (let file of events) {
            let pull = require(`../events/${file}`);
    
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> Events erreur ! help -> events.js`);
                continue;
            }
    
           
        }
    });
    
    console.log(table.toString());
}