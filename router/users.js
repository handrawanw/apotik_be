const Router=require("express").Router();

const controller=require("../controller/users");

const auth=require("../middleware/auth");

Router.get("/",auth.authJwt,auth.authRole(["admin"]),controller.getListUsers);

Router.post("/create",auth.authJwt,auth.authRole(["admin"]),controller.createUsers)

Router.patch("/update/:id_user",auth.authJwt,auth.authRole(["admin"]),controller.updateUsers);

Router.patch("/my_update/:id_user",auth.authJwt,auth.authRole(["karyawan"]),controller.updateMyUsers);

Router.patch("/update_password/:id_user",auth.authJwt,auth.authRole(["admin","karyawan"]),controller.updatePassword);

Router.delete("/delete/:id_user",auth.authJwt,auth.authRole(["admin"]),controller.deleteUser);

module.exports=Router;