const passport = require("passport");





const customerStrategy=(req,res,next)=>{
    passport.authenticate('customer-local',{session: false},(err,user)=>{

        if (err&&err=='password') {return res.status(400).send({ errors: ['Too many invalid attempts. Please reset your password.']})};
        // if (!user) {return res.redirect('/register')};
        if (!user) {return res.status(400).json({errors:['invalid email']})};
        if (err) { return res.status(400).json({ errors: [ err ]}); }

        req.user=user;
        next();
    })(req,res,next);

}

const LocalStrategy=(req,res,next)=>{
    passport.authenticate('user-local',{session: false},(err,user)=>{

        if (err&&err=='password') {return res.status(500).send({ errors: ['credential is wrong,Please reset your password.']})};
        if (!user) {return res.status(400).send({errors:['invalid email']})};
        if (err) { return res.status(400).json({ errors: [ err ]}); }

        req.user=user;
        next();
    })(req,res,next);

}

const jwtstrategy=(req,res,next)=>{
    passport.authenticate('user-jwt',{session: false},(err,user)=>{
        if (err&&err=='expired') {return res.status(500).send({ errors: ['token is expire please login']})};
        if (err&&err=='user') {return res.status(500).send({ errors: ['token is expired please login']})};
        if (!user) {return res.status(400).send({errors:['user not found please login']})};
        if (err) { return res.status(400).json({ errors: [ err ]}); }
        req.user=user;
        next();
    })(req,res,next);

}

const customerjwt=(req,res,next)=>{
    passport.authenticate('customer-jwt',{session: false},(err,user)=>{
        if (err&&err=='expired') {return res.status(500).send({ errors: ['token is expire please login']})};
        if (err&&err=='user') {return res.status(500).send({ errors: ['token is expire please login']})};
        if (!user) {return res.status(400).send({errors:['user not found please login']})};
        if (err) { return res.status(400).json({ errors: [ err ]}); }
        req.user=user;
        next();
    })(req,res,next);

}

// var jwtstrategy = (req, res, next) => {
//     passport.authenticate('user-jwt', {session: false}, (err, user, info) => { 
//         let contype = req.headers['content-Type'];
//         var json = !(!contype || contype.indexOf('application/json') !== 0);
//         if (err && err == 'expired'){ return json?res.status(500).json({ errors: ['Session is expired']}):res.redirect('/logout'); }
//         if (err && err == 'invalid'){ return json?res.status(500).json({ errors: ['Invalid token recieved']}):res.redirect('/logout'); }
//         if (err && err == 'user'){ return json?res.status(500).json({ errors: ['Invalid user recieved']}):res.redirect('/logout'); }
//         if (err && Object.keys(err).length) { return res.status(500).json({ errors: [ err ]}); }
//         if (err) { return res.status(500).json({ errors: [ 'Invalid user recieved' ]}); }
//         if (!user) { return json?res.status(500).json({ errors: ['Invalid user recieved']}):res.redirect('/logout'); }
//         req.user = user;
//         next();
//     })(req, res, next);
// };



module.exports={
    customerStrategy,
    LocalStrategy,
    jwtstrategy,
    customerjwt
}