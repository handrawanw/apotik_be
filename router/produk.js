const Router=require("express").Router();

const controller=require("../controller/produk");

const auth=require("../middleware/auth");

Router.get("/",auth.authJwt,auth.authRole(["admin","karyawan"]),controller.getListProduk);

Router.post("/create",auth.authJwt,auth.authRole(["admin","karyawan"]),controller.createProduk)

Router.patch("/update/:id_produk",auth.authJwt,auth.authRole(["admin","karyawan"]),controller.updateProduk);

Router.delete("/delete/:id_produk",auth.authJwt,auth.authRole(["admin","karyawan"]),controller.deleteProduk);

module.exports=Router;