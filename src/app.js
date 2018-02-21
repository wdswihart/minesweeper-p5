const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.static(__dirname));

app.get('/minesweeper', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.port || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log('Express server started on port ' + port + '.');
});
