const { CronJob } = require("cron")
const Promise = require("bluebird")

const puppeteer = require("puppeteer")

require("dotenv").config()

const scrap = require("./services/scrap")
const slack = require("./services/slack")

const urls = require("./data/urls.json")["V0"]

const launch = async () => {
  console.log(`Launching Jobs for ${urls.length} propetires`)
  slack.send(`Launching Jobs for ${urls.length} propetires`)

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  })

  const launchScrapper = url => scrap.run(browser, url)

  // const options = { concurrency: Math.ceil(urls.length / 8) }
  const options = { concurrency: 2 }

  await Promise.map(urls, launchScrapper, options)

  await browser.close()
}

const run = async () => {
  await launch()
  new CronJob("*/10 * * * *", async () => {
    console.log(`Job running running 10 MINUTS : ${new Date()}`)
    await launch()
  }).start()
}

run()
