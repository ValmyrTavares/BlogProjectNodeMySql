const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slygify = require("slugify");
const { default: slugify } = require("slugify");

router.get("/admin/categories/new", (req, res)=>{
    res.render("admin/categories/new")
})

router.post("/categories/save",(req, res)=>{
    var title = req.body.title;
    if(title != undefined){

        Category.create({
            title:title,
            slug:slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories")
        })

    }else{
        res.redirect("/admin/categories/new")
        console.log("Houve um erro")
    }
})

router.get("/admin/categories", ( req, res) =>{
    Category.findAll().then((categories)=>{
        res.render("admin/categories/index", {categories:categories});     
    })
})

router.post("/categories/delete", (req, res) =>{
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where:{
                    id:id
                }
            }).then(()=> {
                res.redirect("/admin/categories")
            })
        }else{
            res.redirect("/admn/categories");
        }
    }else{
        res.redirect("/admn/categories");
    }
})

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories")
        console.log("não é o papai")
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){

           res.render("admin/categories/edit",{category:category})
            console.log("foi")
        }else{
            res.redirect("/admin/categories")
            console.log("Não foi ")
        }
    }).catch(erro => {
        res.redirect("admin/categories")
        console.log("Não foi mesmo")
    })
})

router.post("/categories/update", (req, res)=> {
    var id = req.body.id;
    var title = req.body.title

    Category.update({title:title, slug:slugify(title)},{
        where:{id:id}
    }).then(()=>{
        res.redirect("/admin/categories")
    })
})

module.exports = router;