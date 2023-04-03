const knex_psql=require("../db/knex");
const response=require("../helper/response");
const query_model=require("../model/produk");
const function_helper=require("../helper/function_helper");

module.exports={

    getListProduk:async(req,res)=>{

        try {
            const {page="1",limit="10"}=req.query;
    
            let payload=await query_model.getAllProduk({page,limit});

            response.ok(payload,res);
            
        } catch (error) {
            response.error({},res,error.message);
        }

    },

    createProduk:async(req,res)=>{
        try {
            const {nama_produk,harga_beli,harga_jual,stok}=req.body;

            let payload=await knex_psql("produk").insert({
                nama_produk,
                kode_produk:`COI-${function_helper.randomNumber(999999,100000)}-${function_helper.randomNumber(999,100)}`,
                harga_beli,harga_jual,stok
            }).returning("*");
            payload=Array.isArray(payload)&&payload.length>0?payload[0]:{};

            response.ok(payload,res);
        } catch (error) {
            response.error({},res,error.message);            
        }
    },

    updateProduk:async(req,res)=>{
        try {
            const {id_produk}=req.params;
            const {nama_produk,harga_beli,harga_jual}=req.body;

            let payload=await knex_psql("produk").update({
                nama_produk,
                harga_beli,harga_jual,
                updated_at:knex_psql.fn.now()
            }).where({id:parseInt(id_produk)}).returning("*");
            payload=Array.isArray(payload)&&payload.length>0?payload[0]:{};

            response.ok(payload,res);
            
        } catch (error) {
            response.error({},res,error.message);            
        }
    },

    deleteProduk:async(req,res)=>{
        try {
            const {id_produk}=req.params;

            await knex_psql("produk").update({is_deleted:1}).where({id:parseInt(id_produk)});

            response.ok({},res);
            
        } catch (error) {
            response.error({},res,error.message);            
        }
    }

};