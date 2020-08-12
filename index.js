const express = require("express");
const app = express();
const bodyParser = require ( 'body-parser')
const connection = require("./database/database")

const articlesController = require("./articles/ArticlesController")
const categoriesController = require("./categories/CategoriesController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")

    //VIEW ENGINE
app.set('view engine','ejs')


    //STATIC
app.use(express.static('public'))

     //BODYPOASER
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

     //DATABASE
connection
.authenticate()
.then(()=>{
    console.log("Conexão feita com sucesso")
}).catch((err)=>{
    console.log("Houve um erro" + err)
})

app.use("/",articlesController)
app.use("/",categoriesController)


    //ROTAS

// - 1
app.get("/",(req, res)=>{
    Article.findAll({
        order:[
            ['id','DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index",{articles:articles, categories:categories})
        })
    })
})

// - 2
app.get("/:slug", (req, res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article =>{ {        
        if(article != undefined){
           Category.findAll().then((categories)=> {
               res.render("articles", {article:article, categories: categories})
           })
        }else{
            res.redirect("/")
        }
    }
    }).catch((err) =>{
        res.redirect("/")
    })
})

// - 3
app.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories=>{
                res.render("index",{articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})


app.listen(8000, () =>{
    console.log("O servidor está rodando")
})