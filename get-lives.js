const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.youtube.com/results?search_query=live&sp=CAMSBggFEAEYAg%253D%253D');


    const metadata = await page.evaluate(() => 
        Array.from(document.querySelectorAll("#title-wrapper a"), (el) => el.getAttribute('aria-label'))
    )
    
    const lives = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#contents #contents .ytd-item-section-renderer'))
            .map(live => ({
                metadata:      live.querySelector("#title-wrapper a").getAttribute('aria-label'),
                visualizacoes: live.querySelector("#metadata-line span:nth-child(1)").innerText.trim(),
                data: live.querySelector("#metadata-line span:nth-child(2)").innerText.trim(),
                //thumbnail: live.querySelector(".style-scope .yt-img-shadow").src,
                canal:     live.querySelector("#channel-name .yt-simple-endpoint").innerText.trim(),
                canal_link:     live.querySelector("#channel-name .yt-simple-endpoint").href,
                origem: '',
            }))
        )

    lives.map(live => (
        live.data.indexOf('Streamed') == 0 ? live.origem = 'Stream' : live.origem = 'Other',
        live.data = live.data.replace('Streamed ','')
    ))
    
    console.log(lives),

    await browser.close();
})();






