const express = require("express");
const fs = require("fs");
const path = require("path");
const {graphqlHTTP } = require("express-graphql")
const {buildSchema} = require("graphql")
const dataFilePath = path.join("D:", "front3", "cards.json");
const app = express();
const port = 3000;

const userID = 'client1'; 


app.get('/', (req,res)=>{
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data)=>{
        if (err) res.status(404).send("Ошибка: файл index.html не найден");
        else res.send(data);
    });
});
fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Ошибка чтения файла:", err);
    } else {
        cards = JSON.parse(data);
    }
});
const schema = buildSchema(`
    type Product{
        id: Int
        name: String
        cost: Int
        description: String 
        categories: [String]
    }  
    type Query{
        products: [Product]
    }  
`);
const root ={
    products: () => cards
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.use(express.static(__dirname));
app.listen(port, () => {
    console.log(`Client server started on port ${port}`);
});
