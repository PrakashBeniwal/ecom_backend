const jwt=require('jsonwebtoken')


const authtoken=(req,res,next)=>{
    var token = null;
    if (req && req.cookies){
        token = req.cookies['XSRF-token'];
    }
    if(!token && req.headers['authrization']){
        token = req.headers['authrization'];
    }


    // if(!token && !req.headers['authorization']){

    //      return res.status(500).json({ errors: ['Invalid token recieved']}) 
        
    // }



    if (!token) {
        return res.status(500).json({ errors: ['Invalid token recieved']}) 

    }

    const user=jwt.verify(token,process.env.APP_SECRET)

     if(!user){

         return res.status(500).json({ errors: ['Invalid token recieved']}) 
        
    }

    req.user=user;
   
    return next();

}

module.exports=authtoken;