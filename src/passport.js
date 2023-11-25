const passport=require('passport')
const db = require('./models');
const bcrypt=require('bcrypt-nodejs')
// const {Strategy }=require('passport-local')
const { Strategy:LocalStrategy  } = require('passport-local');
const { Strategy:JwtStrategy  } = require('passport-jwt');
const jwt=require('jsonwebtoken')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
 


const JWTSIGN=(user,date)=>{
    return jwt.sign({
         sub: user.id,
         iam : user.type,
         iat: date.getTime(),
         exp: new Date().setMinutes(date.getMinutes() + 30)
    },process.env.APP_SECRET
    )
     
 }

passport.use('google-auth',new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  function(accessToken, refreshToken, profile, cb) {
    db.customer.findOrCreate({where: { userid: profile.id },
        defaults: {
          // phone:phone_number,
             userid:profile.id,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
          email:profile.emails[0].value,
        }, })
        .then(user=>{
            if (user) {
                var token=null;
                db.customer.findOne({where:{email:profile.emails[0].value}})
                .then(user=>{
                    var date=new Date();
                     token = JWTSIGN(user, date);
                }).then(res=>{
                    return cb(null,[...user,{token}]) 
                })
                
            }
        })
    

    
    // return cb(null,[profile.emails[0].value,accessToken])
  }
));


passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  // Deserialize user based on user ID from the session
  passport.deserializeUser((id, done) => {
    // Retrieve user from the database based on the ID
    const user = id;
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  });
 
  
  
  
  
  





var TokenExtractor = function(req){
    var token = null;
    if (req && req.cookies){
        token = req.cookies['XSRF-token'];
    }
    if(!token && req.headers['authrization']){
        token = req.headers['authrization'];
    }
    return token;
}

passport.use('user-jwt', new JwtStrategy({
    jwtFromRequest: TokenExtractor,
    secretOrKey: process.env.APP_SECRET,
}, async (payload, done) => {
    try {
        var user = await db.User.findOne({ where: { id: payload.sub }});
        
        if (new Date(payload.exp) < new Date()) {
            return done('expired', false);
        }

        if (!user) {
            return done('user', false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use('customer-jwt', new JwtStrategy({
    jwtFromRequest: TokenExtractor,
    secretOrKey: process.env.APP_SECRET,
}, async (payload, done) => {
    try {
        var user = await db.customer.findOne({ where: { id: payload.sub }});
        
        if (new Date(payload.exp) < new Date()) {
            return done('expired', false);
        }

        if (!user) {
            return done('user', false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));


passport.use('customer-local', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},async(req,email,password,done)=>{
    db.customer.findOne({where:{email:email}})
    .then(user=>{
        if (!user) {
            return done(null,false);
            
        }

        var ismatch=bcrypt.compareSync(password,user.password);

        if (!ismatch) {
            return done('password',false)
        } else {
            return done(null,user)
        }
    }).catch(error=>{
        return done(error,false)
    })

   

}))


passport.use('user-local', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},async(req,email,password,done)=>{
    db.User.findOne({where:{email:email}})
    .then(user=>{
        if (!user) {
            return done(null,false);
            
        }

        var ismatch=bcrypt.compareSync(password,user.password);

        if (!ismatch) {
            return done('password',false)
        } else {
            return done(null,user)
        }
    }).catch(error=>{
        return done(error,false)
    })

   

}))




