
const mysql=require('mysql');
const db=mysql.createConnection({
    user:"root",
    password:"",
    host:"localhost",
    database:"pocket_vidhya"
})
db.connect((err)=>{

    if(err){
        console.log("Can't Connected database")
    }
    else{
        console.log("Database Connected")
    }
    
})

 // change the dbconnection .js file
module.exports=db
