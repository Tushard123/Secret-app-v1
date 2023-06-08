//jshint esversion:6
require('dotenv').config();
const  express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
email:String,
password:String
});



userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});


const User = new mongoose.model('User',userSchema);



app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});


app.get("/register",(req,res)=>{
    res.render("register");
});

app.post('/register',async (req,res)=>{
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    try{
        const userSaved = await newUser.save();
        if(userSaved){
            res.render("secrets");
        }else{
            res.send('An error occured while saving the user');
        }
    }catch(err){
        res.send(err);
    }
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    try {
      const foundUser = await User.findOne({ email: username });
     
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.send("Invalid username or password.");
         
        }
      } else {
        res.send("User not found.");
      }
    } catch (err) {
      console.log(err);
      res.send("An error occurred while logging in.");
    }

  });
 

app.listen(3000,()=>{
    console.log("Server started on port 3000");
});