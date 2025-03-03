const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerDefinitions");
const app = express();
const port = 8080;
const dataFilePath = path.join("D:", "front3", "cards.json");
let clients ={};
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, "server.html"), "utf8", (err, data) => {
        if (err) res.status(404).send("Ошибка: файл index.html не найден");
        else res.send(data);
    });
});

app.get("/products", (req, res) => {
    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });
        res.json(JSON.parse(data));
    });
});
/**
 * @swagger
 * /add-product:
 *   post:
 *     summary: Добавить новый товар
 *     description: Добавляет товар в JSON-файл.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: int
 *                 description: Уникальный идентификатор товара
 *               name:
 *                 type: string
 *                 description: Название товара
 *               cost:
 *                 type: number
 *                 description: Цена товара
 *               description:
 *                 type: string
 *                 description: Описание товара
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Категории товара
 *     responses:
 *       201:
 *         description: Товар успешно добавлен
 *       400:
 *         description: Некорректные данные
 */
app.post("/add-product", (req, res) => {
    const { name, cost, description, categories } = req.body;
    if (!name || !cost || !description || !categories) {
        return res.status(400).json({ error: "Некорректные данные" });
    }

    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        let jsonData = JSON.parse(data).map(p => ({
            ...p,
            id: Number(p.id) // Приводим id к числу
        }));

        const lastId = jsonData.length > 0 ? Math.max(...jsonData.map(p => p.id)) : 0;
        const newId = lastId + 1;

        const newProduct = { id: newId, name, cost, description, categories };
        jsonData.push(newProduct);

        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Ошибка записи в файл" });
            res.status(201).json({ message: "Товар добавлен", product: newProduct });
        });
    });
});


/**
 * @swagger
 * /edit-product/:id:
 *   put:
 *     summary: Редактировать товар
 *     description: Редактирует товар в JSON-файл.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: int
 *                 description: Уникальный идентификатор товара
 *               name:
 *                 type: string
 *                 description: Название товара
 *               cost:
 *                 type: number
 *                 description: Цена товара
 *               description:
 *                 type: string
 *                 description: Описание товара
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Категории товара
 *     responses:
 *       200:
 *         description: Товар успешно изменен
 *       404:
 *         description: Товар не найден
 */
app.put("/edit-product/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, cost, description, categories } = req.body;

    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        let jsonData = JSON.parse(data).map(p => ({
            ...p,
            id: Number(p.id) // Приводим id к числу
        }));

        const productIndex = jsonData.findIndex(p => p.id === id);

        if (productIndex === -1) return res.status(404).json({ error: "Товар не найден" });

        jsonData[productIndex] = { id, name, cost, description, categories };

        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Ошибка записи в файл" });
            res.json({ message: "Товар обновлен", product: jsonData[productIndex] });
        });
    });
});



/**
 * @swagger
 * /delete-product/:id:
 *   delete:
 *     summary: Редактировать товар
 *     description: Редактирует товар в JSON-файл.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: int
 *                 description: Уникальный идентификатор товара
 *     responses:
 *       200:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */
app.delete("/delete-product/:id", (req, res) => {
    const id = Number(req.params.id);
    
    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        let jsonData = JSON.parse(data).map(p => ({
            ...p,
            id: Number(p.id) // Приводим id к числу
        }));

        const updatedData = jsonData.filter((product) => product.id !== id);
        if (updatedData.length === jsonData.length) return res.status(404).json({ error: "Товар не найден" });

        fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Ошибка записи в файл" });
            res.json({ message: "Товар удален", deletedId: id });
        });
    });
});

app.use(express.static(path.join(__dirname, "public")));
app.listen(port, () => {
    console.log("Server is running on port " + port);
});