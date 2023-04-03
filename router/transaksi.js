const Router=require("express").Router();

const controller=require("../controller/transaksi");

const auth=require("../middleware/auth");

// validation request
// const {body}=require("express-validator");
// const validation_request=require("../middleware/validation");

Router.get("/cart",auth.authJwt,auth.authRole(["admin","karyawan"]),controller.getAllProdukCart)
Router.get("/report",auth.authJwt,auth.authRole(["admin"]),controller.getAllReportTransaksi)

Router.post("/cashier",auth.authJwt,auth.authRole(["admin","karyawan"]),controller.createTransaksiKasir)
Router.post("/product",auth.authJwt,auth.authRole(["admin","karyawan"]),controller.createTransaksiProduk)

module.exports=Router;