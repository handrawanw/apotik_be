const Router=require("express").Router();

const controller=require("../controller/service_users");

// validation request
const {body}=require("express-validator");
const validation_request=require("../middleware/validation");

Router.post("/login",
body("username").isString().notEmpty(),body("password").isLength({min:6}),
validation_request,
controller.loginUser)

module.exports=Router;