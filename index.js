const express = require("express");
const app = express();
const bodyParser = require ( 'body-parser')
const connection = require("./database/database")

const articlesController = require("./articles/ArticlesController")
const categoriesController = require("./categories/CategoriesController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")

//view engine
app.set('view engine','ejs')


//static
app.use(express.static('public'))

//BODYPOASER
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//database
connection
.authenticate()
.then(()=>{
    console.log("Conexão feita com sucesso")
}).catch((err)=>{
    console.log("Houve um erro" + err)
})

app.use("/",articlesController)
app.use("/",categoriesController)


app.get("/",(req, res)=>{
    res.render("index")
})

app.listen(8000, () =>{
    console.log("O servidor está rodando")
})