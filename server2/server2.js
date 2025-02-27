const express = require('express');
const fs =require('fs');
const path = require('path')
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerDefinitions");
const app =express();
const port =8080;
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req,res)=>{
    fs.readFile(path.join(__dirname,'server.html'), 'utf8', (err,data)=>{
        if (err) res.status(404).send("Ошибка: файл index.html не найден");
        else res.send(data);
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
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар успешно добавлен
 *       400:
 *         description: Некорректные данные
 */
app.post("/add-product", (req, res) => {
    const newProduct = req.body;
    const dataFilePath = path.join("D:", "front3", "cards.json");

    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        try {
            const jsonData = JSON.parse(data);
            jsonData.push(newProduct);

            fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: "Ошибка записи в файл" });
                }
                res.json({ message: "Товар добавлен", product: newProduct });
            });
        } catch (parseError) {
            res.status(500).json({ error: "Ошибка парсинга JSON" });
        }
    });
});
app.use(express.json()); 
/**
 * @swagger
 * /edit-product:
 *   put:
 *     summary: Изменить товар
 *     description: Изменяет товар в JSON-файл.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар успешно изменен
 *       404:
 *         description: Товар не найден
 */
app.put("/edit-product", (req, res) => {
    const updatedProduct = req.body;
    const dataFilePath = path.join("D:", "front3", "cards.json");

    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        try {
            let jsonData = JSON.parse(data);

            const productIndex = jsonData.findIndex((p) => p.name === updatedProduct.name);
            if (productIndex === -1) {
                return res.status(404).json({ error: "Товар не найден" });
            }

            jsonData[productIndex] = updatedProduct;

            fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: "Ошибка записи в файл" });
                }
                res.json({ message: "Товар обновлен", product: updatedProduct });
            });
        } catch (parseError) {
            res.status(500).json({ error: "Ошибка парсинга JSON" });
        }
    });
});
/**
 * @swagger
 * /delete-product:
 *   delete:
 *     summary: Удаляет товар
 *     description: Удаляет товар в JSON-файл.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */
app.delete("/delete-product", (req, res) => {
    const { name } = req.body;
    const dataFilePath = path.join("D:", "front3", "cards.json");

    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        try {
            let jsonData = JSON.parse(data);

            const updatedData = jsonData.filter((product) => product.name !== name);

            if (updatedData.length === jsonData.length) {
                return res.status(404).json({ error: "Товар не найден" });
            }

            fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: "Ошибка записи в файл" });
                }
                res.json({ message: "Товар удален", deleted: name });
            });
        } catch (parseError) {
            res.status(500).json({ error: "Ошибка парсинга JSON" });
        }
    });
});


app.use(express.static(path.join(__dirname, "public")));
app.listen(port, ()=>{
    console.log('Second server is running');
})