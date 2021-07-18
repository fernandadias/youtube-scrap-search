const puppeteer = require('puppeteer');
const url = 'https://www.youtube.com/results?search_query=live&sp=CAMSBggFEAEYAg%253D%253D';

(async () => {
    // Start puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // reference: https://stackoverflow.com/questions/64227537/how-to-scrape-infinite-scroll-websites-using-puppeteer/64233851#64233851

    // load all scroll
    page.on('console', async msg => {
        const args = msg.args();
        const vals = [];
        for (let i = 0; i < args.length; i++) {
            vals.push(await args[i].jsonValue());
        }
        console.log(vals.join('\t'));
    });
    await page.setViewport({
        width: 1280,
        height: 768,
        deviceScaleFactor: 1,
      });
    await page.goto(url);
    await page.evaluate(()=> {
        const wait = (duration) => { 
          console.log('waiting', duration);
          return new Promise(resolve => setTimeout(resolve, duration)); 
        };
        (async () => { 
          window.atBottom = false;
          const scroller = document.documentElement;  // usually what you want to scroll, but not always
          let lastPosition = -1;
          while(!window.atBottom) {
            scroller.scrollTop += 2000;
            // scrolling down all at once has pitfalls on some sites: scroller.scrollTop = scroller.scrollHeight;
            await wait(3000);
            const currentPosition = scroller.scrollTop;
            if (currentPosition > lastPosition) {
              console.log('currentPosition', currentPosition);
              lastPosition = currentPosition;
            }
            else {
              window.atBottom = true;
            }
          }
          console.log('Done!');
        })();
      });
      await page.waitForFunction('window.atBottom == true', {
        timeout: 900000,
        polling: 80000
      });

    // end scroll or timeout
    
    // get related infos
    const lives = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#contents #contents .ytd-item-section-renderer'))
            .map(live => ({
                live_link:          live.querySelector(".ytd-video-renderer #thumbnail").href || 'not-found',
                live_thumbnail:     live.querySelector(".ytd-video-renderer #thumbnail img.style-scope").href || 'not-found',
                live_views:         live.querySelector("#metadata-line span:nth-child(1)").innerText.trim() || 'not-found',
                live_date:          live.querySelector("#metadata-line span:nth-child(2)").innerText.trim() || 'not-found',
                live_type:          '',
                channel_thumbnail:  live.querySelector("#channel-info .ytd-video-renderer img.yt-img-shadow").src || 'not-found',
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






