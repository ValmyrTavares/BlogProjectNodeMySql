const express = require('express')
const router = express.Router();
const User = require("./User")
const bcrypt = require('bcryptjs')
const adminAuth = require("../middlewares/AdminAuth")

router.get("/admin/users", (req,res)=>{
    User.findAll().then(users =>{
        res.render("admin/users/index",{users:users})
    })
})

router.get("/admin/users/create",(req, res)=>{
    res.render("admin/users/create")
})

router.post("/users/create",(req, res)=>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email:email}}).then(user =>{
        if(user==undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                email:email,
                password:hash
            }).then(()=>{
                res.redirect("/")
            }).catch((err)=>{
                res.redirect("/")
            })

        }else{
            res.redirect("/admin/users/create")
        }
    }) 
   })

   router.get("/login",(req, res)=>{
       res.render("admin/users/login")
   })

   router.post("/authenticated",(req, res)=>{
       var email = req.body.email;
       var password = req. body.password

       User.findOne({
           where:{
               email:email
            }
        }).then((user)=>{
            if(user!=undefined){

                var correct = bcrypt.compareSync(password, user.password)

                if(correct){
                    req.session.user = {
                        id:user.id,
                        email:user.email
                    }
                    res.redirect("/admin/articles")
                }else{
                    res.redirect("/login")
                    console.log("A senha não bate")
                }
            }else{
                res.redirect("/login")
                console.log("Email não encontrado")
            }
        })
   })

   router.get("/logout", (req, res)=>{
       debugger
       req.session.user = undefined;
       console.log(req.session.user)
       res.redirect("/")
   })




module.exports = router;