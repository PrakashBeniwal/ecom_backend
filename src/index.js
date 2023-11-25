const express=require('express');
// const fs = require('fs');
// const https=require('https')
const path=require('path')
const db=require('./models');
const { resRouter } = require('./api');
require('./errors')
const cors=require('cors')
const mailer=require('./mailer');
const expressSanitizer = require('express-sanitizer');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('./passport')
const app=express();
//const Kue=require('./kue')

//Kue.init();

app.use(passport.initialize());
        app.use(passport.session());


app.use(express.json())
/*cors handling*/
app.use(cors({
	origin:true,
    credentials:true
}));
app.options('*', cors());

app.use(cookieParser(process.env.APP_SECRET));



app.get('/login/failed',(req,res)=>{    

    req.status(401).json({
        success:false,
        message:"failure"
    })
})

app.get('/auth/google',
  passport.authenticate('google-auth', { scope: ['profile','email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google-auth', { failureRedirect: '/login/failed'}),
  function(req, res) {
    // Successful authentication, save user data to session
    res.cookie('_sid',     req.user[2].token, {
        expire: new Date().setMinutes(new Date().getMinutes() + 30),
        httpOnly: false, secure: process.env.APP_SECURE
    });
    res.cookie('email',     req.user[0].email, {
        expire: new Date().setMinutes(new Date().getMinutes() + 30),
        httpOnly: false, secure: process.env.APP_SECURE
    });
    res.redirect('http://localhost:4000/')
  }
  );

app.use(expressSanitizer());


app.use("/",express.static(path.join(__dirname,"front")));
app.use("/",express.static(path.join(__dirname,"build")));

app.get("/shop/*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})
app.get("/p/*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})
app.get("/checkout",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})
app.get("/order/*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})
app.get("/admin/*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'build','index.html'))
})
app.get("/auth/*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'build','index.html'))
})
app.get("/admin",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'build','index.html'))
})
app.get("/change_password.html",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'build','index.html'))
})
app.get("/account/*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})
app.get("/login",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})
app.get("/register",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})
app.get("/product/*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})
app.get("/failed",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'front','index.html'))
})






app.use('/api',resRouter)

app.use((req, res, next) => {
	next(new RequestError('Invalid route', 404));
});


db.sequelize.authenticate().then(()=>{
    console.log("database is connected")
}).
catch((err)=>{
    console.log("something wrong with database",{err:err})
})


/*const httpsOptions={
    cert:readFileSync(path.join(__dirname,'ssl','cert.crt')),
    key:readFileSync(path.join(__dirname,'ssl','cert.key')),
}

https.createServer(httpsOptions,app).listen(4000,()=>{
    console.log("server is running on port 4000")
})*/

  app.listen(4000,()=>{
       console.log("server is running on port http 4000")
           })