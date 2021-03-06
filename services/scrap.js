const slack = require("./slack")

const SELECTOR = ".addToCart .sold_out"

const run = async (browser, url) => {
  const names = url.split("/")
  const name = names[names.length - 2]

  // console.log(`Running Scrapper for PROPERTY ${name}`)

  try {
    const page = await browser.newPage()
    await page.goto(url)
    // await page.goto(url, { waitUntil: "load", timeout: 1000 * 10 })

    if ((await page.$(SELECTOR)) === null)
      await slack.send(`PROPERTY ${name} AVAILABLE : ${url}`)
    else console.log(`PROPERTY ${name} UNAVAILABLE`)

    // await page.screenshot({ path: `${__dirname}/screens/${name}.png` })
  } catch (error) {
    console.log(`[ERROR] SCRAPPING PROPERTY ${name} : ${error.message}
    ${url}`)
    slack.send(`[ERROR] SCRAPPING PROPERTY ${name} : ${error.message}
    ${url}`)
  }
}

module.exports = {
  run
}
