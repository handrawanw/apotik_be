const query_service_users=require("../model/service_users");
const response=require("../helper/response");
const hashing_password=require("../helper/hashing");
const jwt_token=require("../helper/jwt_token");

module.exports={

    loginUser:async(req,res)=>{
        const {username,password}=req.body;

        let data_user=await query_service_users.searchUsers({username});

        if(data_user&&hashing_password.checkPass(password,data_user.password)){
            response.ok({
                users:{
                    users_id:data_user.id,
                    name_roles:data_user.name_roles,
                    username:data_user.username
                },
                token:jwt_token.generateToken({
                    users_id:data_user.id,
                    name_roles:data_user.name_roles,
                    username:data_user.username
                }) // expired token 1 day
            },res)
        }else{
            response.error({},res);
        }

    }

};