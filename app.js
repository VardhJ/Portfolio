//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connecting to mongoose
mongoose.connect("mongodb://localhost:27017/portfolioDB");


//Schema:
const projectSchema= {
  title: String,
  description: String,
  link: String,
  rating: Number,
}

const Project = mongoose.model("Project", projectSchema);


app.get("/", function(req, res){
  Project.find({}, function(err, results){
    res.render("home",{projectList: results});
  });
});

app.get("/compose", function(req, res){
  res.render("compose");   //linked to contact.ejs
});

app.post("/compose", function(req, res){
  const project= new Project({
    title: req.body.projectTitle,
    description: req.body.projectDesc,
    link: req.body.projectLink,
    rating: req.body.projectRating,
  });
  Project.insertMany(project, function(err){
    if(!err){
      console.log("Successfully added!");
    }
  })
  res.redirect("/");
});

app.get("/:projectName", function(req, res){
  Project.find({title: req.params.projectName}, function(err, result){
    if(!err){
      res.render("project",{project: result});
    }
    else{
      console.log("Could not find the project");
    }
  });
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
