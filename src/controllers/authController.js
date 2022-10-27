const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken")
const { isValidEmail,
    isValidName,
    isValid, isValidPassword, isValidTitle } = require("../validation/validator");
const { auth2 } = require("../middlewares/middleware");


const createAuthor = async function (req, res) {
    try {
        let data = req.body;
    
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ msg: "Body should not be empty" })
        }

        if (!("fname" in data) || !("lname" in data) || !("title" in data) || !("email" in data) || !("password" in data)) return res.status(400).send({ msg: "fname,lname,title,email,password are required" })

        if (!isValid(data.password)) return res.status(400).send({ status: false, msg: "The Password Attributes should not be empty" })
        if (!isValidPassword(data.password)) return res.status(400).send({ status: false, msg: "Password must contains 1 upperCaseletter 1 smallCaseLetter 1 special character and 1 digit" })

        if (!isValid(data.email)) return res.status(400).send({ status: false, msg: "The email Attributes should not be empty" })
        if (!isValidEmail(data.email)) return res.status(400).send({ status: false, message: "Pls Enter Email in valid Format" })

        if (!isValid(data.lname)) return res.status(400).send({ status: false, msg: "The lname Attributes should not be empty" })
        if (!isValidName(data.lname)) return res.status(400).send({ status: false, msg: "Pls Enter Valid Last Name" })

        if (!isValid(data.fname)) return res.status(400).send({ status: false, msg: "The fname Attributes should not be empty" })
        if (!isValidName(data.fname)) return res.status(400).send({ status: false, msg: "Pls Enter Valid First Name" })

        if (!isValid(data.title)) return res.status(400).send({ status: false, msg: "The Title Attributes should not be empty" })
        
        let checkunique= await authorModel.findOne({email:req.body.email}) 
        if (checkunique) return res.status(400).send({status:false,msg:"This Email Id Already Exists Pls Use Another"})
        let savedData = await authorModel.create(data);
        res.status(201).send({ status: "True", data: savedData });
    }

    catch (error) {
        return res.status(500).send({ status: "False", msg: error.message })
    }
};

//........................................................ Author Login 
const authLogin = async function (req, res) {
    let value = req.body
    let userName = value.email
    let password = value.password
    //................................................... Empty Body Validation 
    if (!("email" in value) || !("password" in value)) return res.status(400).send({ status: "false", msg: "Pls Enter Email And Password" })

    //....................................................Empty Attributes Validation
    if (!isValid(userName) || !isValid(password)) return res.status(400).send({ status: "false", msg: "Pls Provide data in Email And Password" })

    let author = await authorModel.findOne({ $and: [{ email: userName, password: password }] })
    if (!author) return res.status(404).send({ status: "false", msg: "Pls Use Valid Credentials" })

    let token = jwt.sign({
        authorId: author._id.toString()
    }, "functionup-radon")

    console.log(token)

    res.status(201).send({ status: "Succesfully Login", token: token })

}


module.exports.authLogin = authLogin
module.exports.createAuthor = createAuthor