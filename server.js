const bodyParser = require('body-parser');
const express=require('express');
// const k = require('./ssl/')
var https = require('https');
var fs = require('fs');

const cors=require('cors')
// const path = require('path');
const app=express();

var options = {
    key: fs.readFileSync('../ssl/privatekey.key'),
    cert: fs.readFileSync('../ssl/certificate.pem'),
   
};

let corOption ={
    origin:'*',
    methods:["GET","POST","PUT","DELETE"],
  }

  app.use(cors(corOption));

const db=require('./dbConnections')
const indexrouter=require('./router')




app.use(express.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

// let corOption ={
//     origin:['http://localhost:3000','http://localhost:5000'],
//     methods:["GET","POST","PUT","DELETE"],
//   }
//   app.use(cors(corOption));

//   app.options('*', cors());

  app.use(bodyParser.json());

  app.use('/',express.static("Pocket_Vidhya/public/images"))

  app.use(indexrouter)

// app.get('/gettok',(req,res)=>{
//     const auth=req.headers.authorization.split(" ")[1]
//     console.log(auth);
// })

app.get("admin/getUsers/?",(req,res)=>{
  const category=req.params.category;
res.status(200).send({
  success:true,
  category1:category
})
console.log(req.query.category)
})

// app.listen(5000,()=>{
    
//     console.log("Server up and Running on port 5000");
// })

// simple route
app.get("/", (req, res) => {
  res.send(
    `<h1 style='text-align: center'>
          Wellcome to Myadmin Backend 
          <br><br>
          <b style="font-size: 182px;">😃👻</b>
      </h1>`
  );
});

https.createServer(options, app).listen(5000,() => console.log("App running in port 5000 !"));
