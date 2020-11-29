const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
var session = require('express-session')
const MongoStore = require('connect-mongo')(session)


const ObjectId = mongoose.Types.ObjectId


const Schema = mongoose.Schema


const app = express()
const port = 3000


// serve static files
app.use("/static", express.static('./static/'))


// session configuration
app.use(session({
    secret: "sjdciyisndks",
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: 'native'
    }),
    name: "YourRecipesSec",
    saveUninitialized: false,
    rolling: true,
    resave: true,
    cookie: {
        domain: "localhost",
        maxAge: 1000*60*60*24*365
    }
}))


app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json


// Connect to database
mongoose.connect('mongodb+srv://your:recipes@yourrecipes.thepu.mongodb.net/YourRecipesDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})


// Create account schema
const Account = new Schema({
    username: String,
    password: String,
    email: String
})


// Create saved recipes schema
const SavedRecipes = new Schema({
    acc_id: ObjectId,
    recipes: String
})


// Create account model
const AccModel = mongoose.model("Account", Account)


// Create saved recipes model
const SRModel = mongoose.model("SavedRecipes", SavedRecipes)


// Send out signup page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})


// process signup
app.post('/api/signup', async (req, res) => {
    var result = {success: false}

    try{
        //Search if username is taken
        var foundDoc = await new Promise((resolve, reject) => {
            AccModel.findOne({username: req.body.username}, function(err, doc){
                if(err) reject(err)
                resolve(doc)
            })
        })
        if(foundDoc) throw "Error: Account already exists with this username!"

        //Check that fields are not empty
        if(!req.body.username) throw "Missing username"
        if(!req.body.password) throw "Missing password"
        if(!req.body.email) throw "Missing email"

        //Make password safe
        var hashedPass = await bcrypt.hash(req.body.password, 10)

        //Prepare data to save
        var accDoc = new AccModel()
        accDoc.username = req.body.username
        accDoc.password = hashedPass
        accDoc.email = req.body.email

        //Save to database
        await new Promise((resolve, reject) => {
            accDoc.save(function(e){
                if(e) reject(e)
                resolve()
            })
        })

        result.success = true

    }
    catch(e){
        if(typeof e === "string") result.reason = e
        else {
            result.reason = "Server error"
            console.log(e)
        }
    }

    res.json(result)
})


// Send out login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})


// process login
app.post('/api/login', async (req, res) => {
    var result = {success: false}

    try{
        if(req.session.uid) throw "You're already logged in!"

        //sanitization
        var username = req.body.username
        if(!username) throw "Missing username!"

        var password = req.body.password
        if(!password) throw "Missing password!"

        var accData = await new Promise((resolve, reject) => {
            AccModel.findOne({username: username}, function(err, doc){
                if(err) reject(err)
                resolve(doc)
            })
        })
        if(!accData) throw "No account exists with that username!"

        var accPas = accData.password

        var passwordMatched = await bcrypt.compare(password, accPas)
        if(!passwordMatched) throw "The password is incorrect!"

        req.session.uid = accData._id

        result.success = true

    }
    catch(e){
        if(typeof e === "string") result.reason = e
        else {
            result.reason = "Server error"
            console.log(e)
        }
    }

    res.json(result)
})


// Send out login page
app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/test.html')
})


// process save recipe
app.post('/api/saverecipe', async (req, res) => {
    var result = {success: false}

    try{
        if(!req.session.uid) throw "Login or create an account to save recipes"

        var id = new ObjectId(req.session.uid)

        //Search for existing saved recipes doc
        var foundDoc = await new Promise((resolve, reject) => {
            SRModel.findOne({acc_id: id}, function(err, doc){
                if(err) reject(err)
                resolve(doc)
            })
        })
        if(foundDoc){
            // Prepare to save
            foundDoc.recipes += ("," + req.body.recipe)

            //Save to database
            await new Promise((resolve, reject) => {
                foundDoc.save(function(e){
                    if(e) reject(e)
                    resolve()
                })
            })
        }
        else{
            //Prepare data to save
            var recDoc = new SRModel()
            recDoc.acc_id = id
            recDoc.recipes = req.body.recipe

            //Save to database
            await new Promise((resolve, reject) => {
                recDoc.save(function(e){
                    if(e) reject(e)
                    resolve()
                })
            })
        }

        result.success = true
    }
    catch(e){
        if(typeof e === "string") result.reason = e
        else {
            result.reason = "Server error"
            console.log(e)
        }
    }

    res.json(result)
})


// send out recipe data
app.get('/recipedata', async (req,res)=>{
    try{
        if(!req.session.uid) return res.json(null)

        var id = new ObjectId(req.session.uid)

        // check for recipe data
        var recipeData = await new Promise((resolve, reject) => {
            SRModel.findOne({acc_id: id}, function(err, doc){
                if(err) reject(err)
                resolve(doc)
            })
        })

        // recipe data does not exist
        if (!recipeData) return res.json(null)

        var recipes = recipeData.recipes

        res.json({recipes: recipes})
    }
    catch(e){
        if(typeof e === "string") result.reason = e
        else {
            console.log(e)
        }
    }
})


app.get('/', (req, res) => {
    return res.redirect('/search')
})


// send out search page
app.get('/search', async (req, res) => {
    res.sendFile(__dirname + '/searchPage.html')
})


app.get('/userdata', async (req,res)=>{
    if(!req.session.uid) return res.json(null)

    var id = new ObjectId(req.session.uid)

    var accData = await new Promise((resolve, reject) => {
        AccModel.findOne({_id: id}, function(err, doc){
            if(err) reject(err)
            resolve(doc)
        })
    })

    var username = accData.username
    var email = accData.email

    res.json({username: username , message: email})
})


app.get('/render', (req,res)=>{
    res.sendFile(__dirname +"/test.html")
})


// logout mechanism
app.get('/logout', (req, res) => {
    if(req.session.uid) req.session.destroy()
    res.redirect("/")
})


app.get('/recipe', (req,res)=>{
    res.sendFile(__dirname +"/recipePage.html")
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
