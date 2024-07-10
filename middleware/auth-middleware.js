
import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
var checkUserAuth = async(req,res, next)=>{
    let token
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try{
            token = authorization.split(' ')[1]
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = await userModel.findById(userID).select('-password')
            next()
        }
        catch(error){
            res.status(401).send({status:"failed", message:"unauthorized user"})
        }

    }
    if (!token){
        res.status(401).send({status:"failed", message:"unauthorized user, No token"})
    }


}

export default checkUserAuth