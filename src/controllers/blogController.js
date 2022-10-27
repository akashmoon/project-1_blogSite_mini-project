const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const middl=require("../middlewares/middleware")

const { isValidEmail,
    isValidName,
    isValid, isValidPassword, isValidTitle, isValidBody } = require("../validation/validator")



//................................................................  POST BLOG API
const createBlog = async function (req, res) {
    try {
        let data = req.body
        let iD = data.authorId
        let published = data.isPublished


        //...........................................  Required Fields validation
        if (!("authorId" in data) || !("title" in data) || !("body" in data) || !("category" in data)) return res.status(400).send({ msg: "The (authorId , title , body , category) fields are required" })

        //............................................Empty Validation And AuthorId Format Validation
        if (!isValid(data.authorId)) return res.status(400).send({ status: false, msg: "Pls Add AuthorId In Authorid Attribute" })
        if (!mongoose.isValidObjectId(data.authorId)) return res.status(400).send({ status: false, msg: "Pls Enter AuthorId In Valid Format" })

        //.......................................... Title Validation
        if (!isValid(data.title)) return res.status(400).send({ status: false, msg: "Pls Add Title In Title Attribute" })
        if (!isValidTitle(data.title)) return res.status(400).send({ status: false, msg: "Pls Use A-Z or a-z and 0-9 While Entering Title " })

        //...............................................  Category Validation
        if (!isValid(data.category)) return res.status(400).send({ status: false, msg: "Pls Add Category In Category Attribute" })
        if (!isValidName(data.category)) return res.status(400).send({ status: false, msg: "Pls Enter Category In OnLy String" })

        //................................................  Body Validation
        if (!isValid(data.body)) return res.status(400).send({ status: false, msg: "Pls Add some Data In Body Attribute" })

        if (!isValidBody(data.body)) return res.status(400).send({ status: false, msg: "Pls Use A-Z or a-z and 0-9 While Entering Body " })
        if (data.tags.length == 0 || !isValidBody(data.tags)) return res.status(400).send({ status: false, msg: "Dont Left Tag Array Empty either give some tags or either remove it (Add Only Alphabetical String)" })

        if (data.subcategory.length == 0 || !isValidBody(data.subcategory)) return res.status(400).send({ status: false, msg: "Dont Left Subcategory Array Empty either give some Subcategory or either remove it (Add Only Alphabetical String)" })

        
        let authId = await authorModel.findById(iD)
        if (!authId) return res.status(400).send({ status: false, msg: "The AuthorId That You Have Written Is Invalid" })
        if (data.isPublished == true) {
            let publishedAt = new Date().toISOString();
            data.publishedAt = publishedAt
        }
        else {
            data.publishedAt = ""
        }
        if (data.isDeleted == true) {
            let deletedAt = new Date().toISOString();
            data.deletedAt = deletedAt
        }
        else {
            data.deletedAt = ""
        }
        let create = await blogModel.create(data)
        res.status(201).send({ status: "true", data: create })
    }
    catch (err) {
        res.status(500).send({ status: "false", msg: err.message })
    }
}

//...................................................... GET BLOGS 

const getBlogs = async function (req, res) {
    try {

        let { category, authorId, subcategory, tags } = req.query
        let obj = {
            isDeleted: false,
            isPublished: true
        }

        if (authorId) {
            if (authorId.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left AuthorId Query Empty" })
            if (!mongoose.isValidObjectId(authorId)) return res.status(400).send({ status: false, msg: "The Format of authorId is invalid" })
            let data = await authorModel.findById({ _id: authorId })
            if (!data) return res.status(400).send({ status: false, msg: "The AuthorId is invalid" })
            obj.authorId = authorId
        }

        if (category) {
            if (category.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left Category Query Empty" })
            obj.category = category.trim()
        }

        if (tags) {
            if (tags.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left Tag Query Empty" })
            obj.tags = { $all: tags.trim().split(",").map(e => e.trim()) }
        }

        if (subcategory) {
            if (subcategory.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left subcategory Query Empty" })
            obj.subcategory = { $all: subcategory.trim().split(",").map(e => e.trim()) }
        }

        let data = await blogModel.find(obj)
        if (data.length == 0) {
            return res.status(404).send({ status: false, msg: "No Blog Found with provided information...Pls Check The Upper And Lower Cases Of letter" })
        }
        else {
            return res.status(200).send({ status: true, msg: data })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}
//...................................................................  updateblog 
const updateBlogbyparams = async function (req, res) {
    try {

        let id = req.params.blogId
        let findId = await blogModel.findById(id)
        if (!findId) return res.status(400).send({ status: "False", message: "The Id You Have Entered Doesn't Exists" })
        if (findId.isDeleted == true) return res.status(400).send({ msg: "The Id You Have Entered Is already deleted" })
        let data = req.body
        published = new Date().toISOString()

        if (Object.keys(data).length == 0) return res.status(400).send({ status: "false", msg: "Pls Enter Some Data To be updated in body" })
        if ("tags" in data) {
            if (!isValid(data.tags)) return res.status(400).send({ status: false, msg: "Dont left tag attribute empty" })
            if (!isValidTitle(data.tags)) return res.status(400).send({ status: false, msg: "pleas enter valid tag" })
        }
        if ("body" in data) {
            if (!isValid(data.body)) return res.status(400).send({ status: false, msg: "Dont Left the body attribute empty" })
        }
        if ("title" in data) {
            if (!isValid(data.title)) return res.status(400).send({ status: false, msg: "Dont Left the title attribute empty" })
            if (!isValidTitle(data.title)) return res.status(400).send({ status: false, msg: "Pls Use A-Z or a-z and 0-9 While Entering Title " })
        }
        if ("category" in data) {
            if (!isValid(data.category)) return res.status(400).send({ status: false, msg: "Dont Left the category attribute empty" })
        }
        if ("subcategory" in data) {
            if (!isValid(data.subcategory)) return res.status(400).send({ status: false, msg: "Dont Left the subcategory attribute empty" })
            if (!isValidTitle(data.subcategory)) return res.status(400).send({ status: false, msg: "Pls Use A-Z or a-z and 0-9 While Entering subcategory and not add empty white spaces " })
        }

        let updatedBlog = await blogModel.findOneAndUpdate({ _id: id }, {
            $set: {
                title: data.title,
                body: data.body,
                category: data.category,
                publishedAt: published,  // new Date()
                isPublished: true
            },
            $push: {
                tags: req.body.tags,
                subcategory: req.body.subcategory
            }
        }, { new: true })
        return res.status(201).send({ staus: "True", data: updatedBlog })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: "False", msg: err.message })
    }
}
//........................................................  deleteblog by params 

const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let find = await blogModel.findById(blogId)
        if (!find) return res.status(400).send({ msg: "The Id You Have Entered Is doesnot exists" })
        if (find.isDeleted == true) return res.status(400).send({ msg: "The Id You have entered is already deleted" })
        let date = new Date().toISOString()
        await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: date } })
        return res.status(200).send({ status: "True", data: "The data Is now deleted" });

    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
//......................................................... deleteBlogByQuery

const deleteBlogByQuery = async function (req, res) {
    try {
        const { authorId, category, tags, subcategory, isPublished } = req.query
        let obj = {}
        if (tags) {
            if (tags.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left The Tag query empty" })
            obj.tags = { $all: tags.trim().split(",").map(e => e.trim()) }
        }
        if (category) {
            if (category.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left The category query empty" })
            obj.category = category
        }
        if (authorId) {
            if (authorId.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left AuthorId Query Empty" })
            if (!mongoose.isValidObjectId(authorId)) return res.status(400).send({ status: false, msg: "The Format of authorId is invalid" })
            let data = await authorModel.findById({ _id: authorId })
            if (!data) return res.status(400).send({ status: false, msg: "The AuthorId is invalid" })
            obj.authorId = authorId
        }
        if (subcategory) {
            if (subcategory.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left subcategory Query Empty" })
            obj.subcategory = { $all: subcategory.trim().split(",").map(e => e.trim()) }
        }
        if (isPublished) {
            if (isPublished.trim().length == 0) return res.status(400).send({ status: false, msg: "Dont Left isPublished Query Empty" })
            obj.isPublished = isPublished
        }
        let deletedTime = new Date().toISOString();
        let blog = await blogModel.find(obj)
        if (!blog) return res.status(400).send({ status: false, msg: "Sorry No Blog Found either check the Upper and Lower case of Letters" })
        console.log(blog)
        
        
        let token= req.headers["X-Api-key"];
        if(!token) token= req.headers["x-api-key"]
        
        //If no token is present in the request header return error
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" }); 
        
        let decodedtoken= jwt.verify(token,"functionup-radon")
        console.log(decodedtoken.authorId)
        
        
        const idOfBlogsTobedel= blog.map(blog=>{
            if(blog.authorId.toString()=== decodedtoken.authorId){
                return blog._id
            }
        })

        if (blog.isDeleted == true) return res.status(200).send({ staus: true, msg: "This is Already Deleted" })
        if ( idOfBlogsTobedel> 0) {
            let data = await blogModel.updateMany ({_id:{$in:idOfBlogsTobedel}},{ $set: { "isDeleted": true, "deletedAt": deletedTime } }, { new: true })
            return res.status(200).send({ status: true, msg: "SuccesFully Deleted", blog: data })
        }
        else {
            res.status(400).send({ status: false, msg: "No such Blog Found" })
        }

    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.deleteBlog = deleteBlog
module.exports.updateBlogbyparams = updateBlogbyparams
module.exports.getBlogs = getBlogs
module.exports.createBlog = createBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery


