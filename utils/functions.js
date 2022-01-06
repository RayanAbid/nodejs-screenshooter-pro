const puppeteer = require("puppeteer");
const { cloudinary } = require("../utils/cloudinary");

async function takeScreenshot(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
    ],
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  await page.setViewport({
    width: 1920,
    height: 800,
  });

  // await autoScroll(page);

  const screenshot = await page.screenshot({
    omitBackground: true,
    encoding: "binary",
    fullPage: true,
  });
  console.log("browser closed");
  await browser.close();

  return screenshot;
}

function uploadScreenshot(screenshot) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {};
    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(screenshot);
  });
}

//   funstion to autoscroll
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = { uploadScreenshot, takeScreenshot };
