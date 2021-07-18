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
                meta:      live.querySelector("#title-wrapper a").getAttribute('aria-label'),
            }))
        )
    

    //console.log(titulos),
    //console.log(metadata),
    console.log(lives),

    await browser.close();
})();






