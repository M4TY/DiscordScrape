//Scraping
const puppeteer = require("puppeteer");
//File Writer
const fs = require("fs/promises");
const { readFile, fsyncSync } = require("fs");
// Scrape data 'n save
const cron = require("node-cron");
//Discord
const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { MessageEmbed } = require("discord.js");
const { channel } = require("diagnostics_channel");

async function scrapeProduct() {
  //Open new browser
  const browser = await puppeteer.launch({
    handless: false,
  });
  //New Page
  const page = await browser.newPage();
  // Navigation timeout
  await page.setDefaultNavigationTimeout(0);

  //Goto {{ this }} page
  await page.goto("https://ssps.cz", {
    waitUntil: "load",
    // Remove the timeout
    timeout: 0,
  });

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("ul:nth-child(4) li")).map(
      (x) => x.textContent
    );
  });

  let filename = "names.txt";

  readFile(filename, (error, fileBuffer) => {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    const fileContent = fileBuffer.toString();

    names.forEach((element) => {
      if (element.includes("2.A") && !fileContent.includes(element)) {
        fs.truncate(filename);
        console.log(element);
        fs.appendFile(filename, element + "\r\n");
        client.once("message", () => {
          const channel101 = client.channels.cache.find(
            (channel) => channel.id === "939059791538569277"
          );
          channel101.send(element);
        });
      }
    });
  });

  await browser.close();
}

cron.schedule("*/10 * * * * *", () => {
  scrapeProduct();
});

client.once("ready", () => {
  console.log("Client running on.");
});

client.login("OTM2NTM3NTg5MzQ1ODIwNzE0.YfOomQ.kI6ZyperyQtTXk2CaDENIUVeFIc");
