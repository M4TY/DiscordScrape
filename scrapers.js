//Scraping
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
//Discord BOT + Cron
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const cron = require("node-cron");

//Discord + Cron

client.login("");

//Scrape data 'n save
async function scrapeProduct(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("ul:nth-child(4) li")).map(
      (x) => x.textContent
    );
  });

  fs.truncate("names.txt");
  names.forEach((element) => {
    if (element.includes("-2.A")) {
      console.log(element);
      fs.appendFile("names.txt", element + "\r\n");
    } else {
    }
  });
  await browser.close();
}
scrapeProduct("https://ssps.cz");

client.on("ready", () => {
  console.log("Running!");
  client.user.setActivity("On!");
});

client.on("message", () => {
  const channel = client.channels.cache.get("742114835688325150");
  channel.send("xd");
  cron.schedule("* * * * * *", () => {
    /*if (message.content === names) {
          scrapeProduct("https://ssps.cz");
          console.log("Scraping product again");
        } else {
          client.channels.cache.get(`742114835688325150`).send(names);
          scrapeProduct("https://ssps.cz");
          console.log("Send scrapeProduct");
        }*/
  });
});
