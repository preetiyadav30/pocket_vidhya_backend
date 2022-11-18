
const mysql=require('mysql');
const db=mysql.createConnection({
    user:"root",
    password:"301bac5b0d309f39",
    host:"localhost",
    database:"pocket_vidya"
})
db.connect((err)=>{

    if(err){
        console.log("Can't Connected")
    }
    else{
        console.log("Database Connected")
    }
    
})
module.exports=db
