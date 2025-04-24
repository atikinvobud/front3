const express = require("express");
const fs = require("fs");
const path = require("path");
const {graphqlHTTP } = require("express-graphql")
const {buildSchema} = require("graphql")
const cards = require('./cards.json'); 
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));
const userID = 'client1'; 


app.get('/', (req,res)=>{
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data)=>{
        if (err) res.status(404).send("Ошибка: файл index.html не найден");
        else res.send(data);
    });
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
app.listen(port, () => {
    console.log(`Client server started on port ${port}`);
});
