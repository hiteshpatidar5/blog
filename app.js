//RESTfull Blog App
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

//mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
mongoose.connect("mongodb://hitesh:password@ds239177.mlab.com:39177/hiteshblog", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());//write after bodyParser
app.use(methodOverride("_method"));


var blogScheme = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: { type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogScheme);

/*Blog.create({
    title: "Test Blog",
    image: "https://i2-prod.manchestereveningnews.co.uk/sport/football/football-news/article12650743.ece/ALTERNATES/s615b/messi.jpg",
    body: "Hello! This is a Test.",
    
});*/

app.get("/",function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        } else {
           res.render("index", {blogs: blogs}); 
        }
    });
    
});

//NEW Route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);//for sanitizer
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   }) ;
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
    
});
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);//for sanitizer
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
   
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("SERVER IS RUNNING!"); 
});