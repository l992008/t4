const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { createHandler } = require('graphql-http/lib/use/express'); // Исправленный импорт
const { buildSchema } = require('graphql');
const schema = require('./schema');
const root = require('./resolvers');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));

// Добавляем обработчик GraphQL
app.all('/graphql', createHandler({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

// Существующие роуты оставляем без изменений
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/products", (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, "data/products.json"));
    res.json(JSON.parse(data));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Сервер graphQL и каталог работают на http://localhost:${PORT}`));