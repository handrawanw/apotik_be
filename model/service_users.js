const knex_psql=require("../db/knex");

module.exports={

    searchUsers:async({username})=>{
        let query=knex_psql.select("*").from("users");

        query.innerJoin("users_roles as ur",function(){
            this.on("ur.id_users","users.id");
        })

        query.innerJoin("roles as rl",function(){
            this.on("rl.id","ur.id_roles");
        })

        query.where("users.username",username);

        query.first();

        return query;
    },

    listUsers:async({username})=>{
        let query=knex_psql.select([
            "id","nama","username","phone","alamat",
            "roles.name_roles",
            "created_at","updated_at"
        ]).from("users");

        query.innerJoin("users_roles as ur",function(){
            this.on("ur.id_users","users.id");
        })

        query.innerJoin("roles as rl",function(){
            this.on("rl.id","ur.id_roles");
        })

        query.where("users.is_deleted",0);

        query.where("users.username",username);


        query.first();

        return query;
    }

};