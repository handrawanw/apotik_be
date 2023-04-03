const knex_psql=require("../db/knex");
const response=require("../helper/response");
const hashing_password=require("../helper/hashing");
const query_model=require("../model/users");

module.exports={

    getListUsers:async(req,res)=>{

        try {
            const {page="1",limit="10"}=req.query;
    
            let payload=await query_model.getAllUsers({page,limit});

            response.ok(payload,res);
            
        } catch (error) {
            response.error({},res,error.message);
        }

    },

    createUsers:async(req,res)=>{
        try {
            const {username,password,nama,phone,alamat,id_roles}=req.body;

            let payload=await knex_psql("users").insert({username,password:hashing_password.hashPass(password),nama,phone,alamat}).returning("*");
            payload=Array.isArray(payload)&&payload.length>0?payload[0]:{};

            if(id_roles&&payload){
                await knex_psql("users_roles").insert({id_users:payload.id,id_roles}).returning("*");
            }

            response.ok(payload,res);
            
        } catch (error) {
            response.error({},res,error.message);            
        }
    },

    updateUsers:async(req,res)=>{
        try {
            const {id_user}=req.params;
            const {username,nama,phone,alamat,id_roles}=req.body;

            let payload=await knex_psql("users").update({username,nama,phone,alamat,updated_at:knex_psql.fn.now()}).where({id:parseInt(id_user)}).returning("*");
            payload=Array.isArray(payload)&&payload.length>0?payload[0]:null;

            if(id_roles&&payload){
                await knex_psql("users_roles").update({id_roles}).where({id_users:id_user});
            }

            if(payload){
                response.ok(payload,res);
            }
            
            response.notFound({},res,"Pengguna tidak ditemukan");
            

        } catch (error) {
            response.error({},res,error.message);            
        }
    },

    updateMyUsers:async(req,res)=>{
        try {
            const {users_id}=req.decoded;
            const {nama,phone,alamat}=req.body;

            let payload=await knex_psql("users").update({nama,phone,alamat,updated_at:knex_psql.fn.now()}).where({id:parseInt(users_id)}).returning("*");
            payload=Array.isArray(payload)&&payload.length>0?payload[0]:{};

            response.ok(payload,res);
            
        } catch (error) {
            response.error({},res,error.message);            
        }
    },

    updatePassword:async(req,res)=>{
        try {
            const {id_user}=req.params;
            const {password}=req.body;

            await knex_psql("users").update({password:hashing_password.hashPass(password),updated_at:knex_psql.fn.now()}).where({id:parseInt(id_user)}).returning("*");

            response.ok({},res);
            
        } catch (error) {
            response.error({},res,error.message);            
        }
    },

    deleteUser:async(req,res)=>{
        try {
            const {id_user}=req.params;

            await knex_psql("users").update({is_deleted:1}).where({id:parseInt(id_user)});

            response.ok({},res);
            
        } catch (error) {
            response.error({},res,error.message);            
        }
    }

};