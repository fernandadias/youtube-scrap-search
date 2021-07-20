const page = 1;
// Global Set to store all entries
let lives = new Set(); // Prevents dupes
// Pause between pagination, fine-tune according to load times
const PAUSE = 4000;

// Accepts a parent DOM element and extracts the title and URL
function scrapeSingleLive(visibleLives) {
    try {
        const
            _name =           visibleLives.querySelector("#video-title"),
            _link =           visibleLives.querySelector("#video-title"),
            _thumbnail =      visibleLives.querySelector(".ytd-thumbnail .yt-img-shadow"),
            _views =          visibleLives.querySelector("#metadata-line span:nth-child(1)"),
            _date =           visibleLives.querySelector("#metadata-line span:nth-child(2)"),
            _cthumbnail =     visibleLives.querySelector("img.yt-img-shadow"),
            _cname =          visibleLives.querySelector("#channel-name .yt-simple-endpoint"),
            _clink =          visibleLives.querySelector("#channel-name .yt-simple-endpoint");

        if (_name) {
            const
                live_name =         _name.getAttribute("href") || 'not-found',
                live_link =         _link.getAttribute("href") || 'not-found',
                live_thumbnail =    _thumbnail.getAttribute("href") || 'not-found',
                live_views =        _views.innerText.trim() || 'not-found',
                channel_thumbnail = _cthumbnail.getAttribute("src") || 'not-found',
                channel_name =      _cname.innerText.trim() || 'not-found',
                channel_link =      _clink.getAttribute("href") || 'not-found';
                
            let 
                live_type =         '',
                live_date =         _date.innerText.trim();

            live_date.indexOf('Streamed') == 0 ? live_type = 'Stream' : live_type = 'Other',
            live_date = live_date.replace('Streamed ','')

            lives.add({
                live_name,
                live_link,
                live_thumbnail,
                live_views,
                live_date,
                channel_thumbnail,
                channel_name,
                channel_link,
                live_type
            });
        }
    } catch (e) {
        console.error("Error capturing individual live", e);
    }
}

// Get all lives in the visible context
function scrapeLives() {
    console.log(`Scraping page ${page}`);
    const visibleLives = document.querySelectorAll('#contents #contents .ytd-item-section-renderer');
    if (visibleLives.length > 0) {
        console.log(`Scraping page ${page}... found ${visibleLives.length} lives`);
        Array.from(visibleLives).forEach(scrapeSingleLive);
    } else {
        console.warn(`Scraping page ${page}... found no threads`);
    }
// Return master list of threads;
    return visibleLives.length;
}

// Scrolls to the bottom of the viewport
function loadMore() {
    console.log(`Load more... page ${page}`);
    window.scrollTo(0, document.body.scrollHeight);
}

