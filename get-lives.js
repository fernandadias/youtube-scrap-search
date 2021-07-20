const fs = require('fs');
const stringify = require('csv-stringify');
const puppeteer = require('puppeteer');
const baseEmpty = 'not-found';
const baseUrl = 'https://www.youtube.com/';
const search = 'results?search_query=live&sp=CAMSBggFEAEYAg%253D%253D';

(async () => {
    // Start puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    // Navigate to the demo page.
    await page.goto(baseUrl+search);

    await page.waitForSelector('.ytd-item-section-renderer', { timeout: 10000 });
    
    // get related infos
    let lives = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#contents #contents .ytd-item-section-renderer'))
            .map(live => ({
                live_name:          live.querySelector("#video-title").getAttribute("href") || 'not-found',
                live_link:          live.querySelector("#video-title").getAttribute("href") || 'not-found',
                live_thumbnail:     live.querySelector(".ytd-thumbnail .yt-img-shadow").getAttribute("href") || 'not-found',
                live_views:         live.querySelector("#metadata-line span:nth-child(1)").innerText.trim() || 'not-found',
                live_date:          live.querySelector("#metadata-line span:nth-child(2)").innerText.trim() || 'not-found',
                live_type:          '',
                channel_thumbnail:  live.querySelector("img.yt-img-shadow").getAttribute("src") || 'not-found',
                channel_name:       live.querySelector("#channel-name .yt-simple-endpoint").innerText.trim() || 'not-found',
                channel_link:       live.querySelector("#channel-name .yt-simple-endpoint").getAttribute("href") || 'not-found',
            }))
        )

    lives.map(live => (
      // check if video are from a streaming or not
      live.live_date.indexOf('Streamed') == 0 ? live.live_type = 'Stream' : live.live_type = 'Other',
      live.live_date = live.live_date.replace('Streamed ','')
    ))

    const columns = {
      live_name: 'live_name', 
      live_link: 'live_link', 
      live_thumbnail: 'live_thumbnail', 
      live_views: 'live_views', 
      live_date: 'live_date', 
      live_type: 'live_type', 
      channel_thumbnail: 'channel_thumbnail', 
      channel_name: 'channel_name', 
      channel_link: 'channel_link'};
    
    console.log(lives),

    stringify(lives, { header: true, columns: columns }, (err, output) => {
      if (err) throw err;
      fs.writeFile('lives.csv', output, (err) => {
        if (err) throw err;
        console.log('lives.csv saved.');
      });
    });

    await browser.close();
})();