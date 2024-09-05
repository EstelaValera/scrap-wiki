const express = require('express')
const app = express()
const axios = require('axios')
const cheerio = require('cheerio')

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

app.get('/', (req, res) => {

    axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
    }).then((response) => {
        if (response.status === 200) {
            const html = response.data
            const $ = cheerio.load(html)

            const h1 = $('h1').text()

            const imgs = []
            $('img').each((index, element) => {
                const imgSrc = $(element).attr('src')
                if (imgSrc) {
                    imgs.push(`https:${imgSrc}`) 
                }
            })

            const parrafos = []
            $('p').each((index, element) => {
                const parrafo = $(element).text()
                parrafos.push(parrafo.trim())
            })


            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(
                `<!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${h1}</title>
                </head>
                <body>

                    <h1>${h1}</h1>
                    <h2>Imágenes</h2>
                    <ul>
                        ${imgs.map(img => `<li><img src="${img}" width="200"/></li>`).join('')}
                    </ul>

                    <h2>Párrafos</h2>
                    <div>
                        ${parrafos.map(parrafo => `<p>${parrafo}</p>`).join('')}
                    </div>
                </body>
                </html>`
            )
            res.end()
        }
    }).catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching data');
        console.error(error);
    })
})

app.listen(3001, () => {
    console.log('Servidor escuchando en http://localhost:3001')
})