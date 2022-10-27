const jwt= require("jsonwebtoken")
const blogModel = require("../models/blogModel")
const authentication= async function(req,res,next){
   try{
    let token= req.headers["X-Api-key"];
    if(!token) token= req.headers["x-api-key"]

    //If no token is present in the request header return error
    if (!token) return res.send({ status: false, msg: "token must be present" }); 

    let decodedtoken= jwt.verify(token,"functionup-radon")

    if(!decodedtoken) return res.status(400).send({status:false,msg:"You Enter The InValid Token "})
    next()
}
catch(err){
    return res.status(500).send({status:false,msg:err.message})
}
}


const authorisation = async function (req,res,next){
    let token= req.headers["X-Api-key"];
    if(!token) token= req.headers["x-api-key"]

    //If no token is present in the request header return error
    if (!token) return res.send({ status: false, msg: "token must be present" }); 

    let decodedtoken= jwt.verify(token,"functionup-radon")
    console.log(decodedtoken.authorId)
    
    let userIdFromParams= req.params.blogId
    let authId= await blogModel.findById(userIdFromParams)
    if(!authId) return res.status(400).send({status:false,msg:"The Id You Have Entered Doesnt Exists, Or Check Can u Pass Only blogId"})
    if(decodedtoken.authorId ==authId.authorId) {
        next()
    }
    else{
        return res.status(403).send({status:false,msg:"The Login User Are not authorize to do this Or Given Token in header Is Invalid"})
    }


}

const auth2= async function(req,res,next){
    let token= req.headers["X-Api-key"];
    if(!token) token= req.headers["x-api-key"]

    //If no token is present in the request header return error
    if (!token) return res.send({ status: false, msg: "token must be present" }); 

    let decodedtoken= jwt.verify(token,"functionup-radon")
    console.log(decodedtoken.authorId)
    let id= req.body.authorId
    if (decodedtoken.authorId==id){
        next()
    }
    else{
        return res.status(403).send({status:false,msg:"The Login User Are not authorize to do this Or Given Token in header Is Invalid"})
    }
}

// const auth4delByquery= async function(req,res,next){
//     let token= req.headers["X-Api-key"];
//     if(!token) token= req.headers["x-api-key"]

//     //If no token is present in the request header return error
//     if (!token) return res.send({ status: false, msg: "token must be present" }); 

//     let decodedtoken= jwt.verify(token,"functionup-radon")
//     console.log(decodedtoken.authorId)
//     id= req.query.authorId
//     if (authorId in req.query){
//         if(id===decodedtoken.authorId)     
//         next()
//     }
//     else{
//         res.send
//     }
// else{
//     return res.status(400).send({status:false,msg:"Sorry You Are Not Authorise To Do this Because The entered id and Login id is not same "})
// }
// }

// module.exports.auth4delByquery=auth4delByquery
module.exports.auth2=auth2
module.exports.authentication=authentication
module.exports.authorisation=authorisation