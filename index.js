"use strict";

const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "-";
const { readFile, fsyncSync } = require("fs");
const cron = require("node-cron");

cron.schedule("*/5 * * * * *", () => {
    scrapeProduct();
    console.log("scraped");
  });

readFile("../names.txt", (error, fileBuffer) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  const fileContent = fileBuffer.toString();

  client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "scrape") {
      cron.schedule("* * * * * *", () => {
        message.channel.send(fileContent);
      });
    }
  });
});

client.once("ready", () => {
  console.log("Client running on.");
});

client.login("OTM2NTM3NTg5MzQ1ODIwNzE0.YfOomQ.kI6ZyperyQtTXk2CaDENIUVeFIc");
