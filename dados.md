artista_canal_link
artista_canal_thumbnail
artista_canal_nome
nome_da_live
link_youtube
descricao
apoio
link_qr_code
visualizações

Array.from(document.querySelectorAll("#title-wrapper a [aria-label]")).map(live => live.innerText.trim()) // Nome das lives
Array.from(document.querySelectorAll("#metadata-line .ytd-video-meta-block")).map(live => live.innerText.trim()) // Views e data
Array.from(document.querySelectorAll("#channel-info img")).map(live => live.src) // Thumb
Array.from(document.querySelectorAll("#channel-name .yt-simple-endpoint")).map(live => live.innerText.trim()) // Nome canal

Array.from(document.querySelectorAll("#contents #contents .ytd-item-section-renderer #title-wrapper a [aria-label]")).map(live => live.innerText.trim()) // Nome das lives


Array.from(document.querySelectorAll('#contents #contents .ytd-item-section-renderer'))
      .map(live => ({
          nome:      live.querySelector("#title-wrapper a [aria-label]").innerText.trim(),
          metadata:  live.querySelector("#metadata-line .ytd-video-meta-block").innerText.trim(),
          thumbnail: live.querySelector("#channel-info img").src,
          canal:     live.querySelector("#channel-name .yt-simple-endpoint").innerText.trim()
      }))
    )


    const lives = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#contents #contents .ytd-item-section-renderer'))
            .map(live => ({
                nome:      live.querySelector("#title-wrapper a [aria-label]").innerText.trim(),
                metadata:  live.querySelector("#metadata-line .ytd-video-meta-block").innerText.trim(),
                thumbnail: live.querySelector("#channel-info img").src,
                canal:     live.querySelector("#channel-name .yt-simple-endpoint").innerText.trim()
            }))
        )