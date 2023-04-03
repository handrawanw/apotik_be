const express=require("express");
const app=express();

require("dotenv").config()

const helmet=require("helmet");

const PORT=8000||process.env.PORT;

// form body
app.use(express.urlencoded({extended:true}))
app.use(express.json({}))
// form body

// helmet
app.use(helmet())
app.use(helmet.hidePoweredBy("PHP 7.2.0"))
// helmet

// router
app.use("/api/v1",require("./router/index"));
app.use(require("./middleware/errHandler"));
// router

require("./tes");

app.listen(PORT,(err)=>{
    if(err) throw err;
        console.log(`Server is running ${PORT}`)
});
