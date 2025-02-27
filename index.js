const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.get('/', (req,res)=>{
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data)=>{
        if (err) res.status(404).send("Ошибка: файл index.html не найден");
        else res.send(data);
    });
});

app.get("/json", (req, res) => {
    fs.readFile(path.join(__dirname, "cards.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Ошибка чтения файла" });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        }
        catch (parseError) {
            res.status(500).json({ error: "Ошибка парсинга JSON" });
        }
    });
});

app.use(express.static(__dirname));

app.listen(port, ()=>(
    console.log('First server started on port 3000')
));
