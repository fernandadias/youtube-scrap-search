const puppeteer = require('puppeteer');
const url = 'https://www.youtube.com/results?search_query=live&sp=CAMSBggFEAEYAg%253D%253D';

(async () => {
    // Start puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // get related infos
    const lives = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#contents #contents .ytd-item-section-renderer'))
            .map(live => ({
                live_link:          live.querySelector(".ytd-video-renderer #thumbnail").href || 'not-found',
                live_thumbnail:     live.querySelector(".ytd-video-renderer #thumbnail.img.style-scope").href || 'not-found',
                live_views:         live.querySelector("#metadata-line span:nth-child(1)").innerText.trim() || 'not-found',
                live_date:          live.querySelector("#metadata-line span:nth-child(2)").innerText.trim() || 'not-found',
                live_type:          '',
                channel_thumbnail:  live.querySelector("#channel-info .ytd-video-renderer.img.yt-img-shadow").src || 'not-found',
                channel_name:       live.querySelector("#channel-name .yt-simple-endpoint").innerText.trim() || 'not-found',
                channel_link:       live.querySelector("#channel-name .yt-simple-endpoint").href || 'not-found',
            }))
        )

    // check if video are from a streaming or not
    lives.map(live => (
        live.live_date.indexOf('Streamed') == 0 ? live.live_type = 'Stream' : live.live_type = 'Other',
        live.live_date = live.live_date.replace('Streamed ','')
    ))
    
    console.log(lives),

    await browser.close();
})();