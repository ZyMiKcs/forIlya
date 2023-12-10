const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Обработка запроса
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './text.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType =
        {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
        }[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Страница с ошибкой 404
                fs.readFile('./404.html', (err, notFoundContent) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(notFoundContent, 'utf-8');
                });
            } else {
                // Внутренняя ошибка сервера
                fs.readFile('./500.html', (err, serverErrorContent) => {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(serverErrorContent, 'utf-8');
                });
            }
        } else {
            // Успешный ответ с кодом 200
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
