const express= require("express")
const database = require("./connect")
const ObjectId=require("mongodb").ObjectId

let performanceRoutes = express.Router()

//1- Retrive all
performanceRoutes.route("/performance").get(async (request, responce)=>{
    let db= database.getDb()
    let data = await db.collection("performance").find({}).toArray()
    if (data.length >0){
        responce.json(data)
    }else{
        throw new Error("Data was not found.")
    }

})
//2- Retrive one
performanceRoutes.route("/performance/:id").get(async (request, responce)=>{
    let db= database.getDb()
    let data = await db.collection("performance").findOne({_id:new ObjectId(request.params.id)})
    if (Object.keys(data).length >0){
        responce.json(data)
    }else{
        throw new Error("Data was not found.")
    }

})
//3 - Update one
performanceRoutes.route("/performance/:id").put(async (req, res) => {
  let db = database.getDb();
  
  const { newSubject } = req.body;

  if (newSubject) {
    // Push newSubject to subject array & 0 to progress array
    let data = await db.collection("performance").updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $push: { 
          subject: newSubject,
          progress: "0"
        }
      }
    );
    return res.json(data);
  }

  // If no newSubject, update user basic info (as before)
  
  let data = await db.collection("performance").updateOne({ _id: new ObjectId(req.params.id) }, mongoObject);
  res.json(data);
});


module.exports = performanceRoutes