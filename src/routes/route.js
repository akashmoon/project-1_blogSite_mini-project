const express = require('express');
const router = express.Router();
//....................Controllers
const authController= require("../controllers/authController")
const blogController= require("../controllers/blogcontroller")

//....................Middlewares
const middl=require("../middlewares/middleware")

//....................Create Author
router.post("/authors", authController.createAuthor)

//....................Create Blogs
router.post("/blogs",middl.authentication,middl.auth2, blogController.createBlog)

//...................Get List Of Blogs
 router.get("/blogs",middl.authentication, blogController.getBlogs)

//..................Update Blogs By Path params
 router.put("/blogs/:blogId",middl.authentication,middl.authorisation, blogController.updateBlogbyparams)

 //.................Delete Blogs By Path Params
 router.delete("/blogs/:blogId",middl.authentication,middl.authorisation, blogController.deleteBlog)

 //..................Delete Blogs By Query Params
 router.delete("/blogs",middl.authentication,blogController.deleteBlogByQuery)

 //..................Login An Author
 router.post("/login",authController.authLogin)


module.exports = router;