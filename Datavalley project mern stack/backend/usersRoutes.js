const express= require("express")
const database = require("./connect")
const ObjectId=require("mongodb").ObjectId

let usersRoutes = express.Router()

//1- Retrive all
usersRoutes.route("/users").get(async (request, responce)=>{
    let db= database.getDb()
    let data = await db.collection("users").find({}).toArray()
    if (data.length >0){
        responce.json(data)
    }else{
        throw new Error("Data was not found.")
    }

})
//2- Retrive one
usersRoutes.route("/users/:id").get(async (request, responce)=>{
    let db= database.getDb()
    let data = await db.collection("users").findOne({_id:new ObjectId(request.params.id)})
    if (Object.keys(data).length >0){
        responce.json(data)
    }else{
        throw new Error("Data was not found.")
    }

})
//3- create one
usersRoutes.route("/users").post(async (request, responce)=>{
    let db= database.getDb()
    let mongoObject={
        user:request.body.user,
        email:request.body.email,
        password:request.body.password,
        role:request.body.role
    }
    let data = await db.collection("users").insertOne(mongoObject)
    
    responce.json(data)

})
//4- Update one
usersRoutes.route("/users/:id").put(async (req, res) => {
  let db = database.getDb();
  console.log(req.body)
  let mongoObject = {
    $set: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    }
  };
  let data = await db.collection("users").updateOne({ _id: new ObjectId(req.params.id) }, mongoObject);
  res.json(data);
});

//5- Delete one
usersRoutes.route("/users/:id").delete(async (request, responce)=>{
    let db= database.getDb()
    
    let data = await db.collection("users").deleteOne({_id:new ObjectId(request.params.id)})
    
    responce.json(data)
})
//6-Login
usersRoutes.route("/users/login").post(async(request,responce)=>{
    let db=database.getDb()

    let user = await db.collection("users").findOne({email:request.body.email})
    if(user){
            if(request.body.password==user.password)
            {
                responce.json({success:true,message:"User Found :)",data:user})
            }
            else{
                responce.json({success:false,message:"Login Failed,Wrong Password :("})
            }
    }
    else{
        responce.json({success:false,message:"User Not Found :("})
    }
})

module.exports = usersRoutes